import Capacitor
import PencilKit
import UIKit

@objc(NativeAnnotationPlugin)
public class NativeAnnotationPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "NativeAnnotationPlugin"
    public let jsName = "NativeAnnotation"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "open", returnType: CAPPluginReturnPromise)
    ]

    @objc(open:)
    public func `open`(_ call: CAPPluginCall) {
        guard let imageSource = call.getString("imageSource"), !imageSource.isEmpty else {
            call.reject("Missing imageSource.")
            return
        }

        let title = call.getString("title") ?? "原生标注"
        let pageId = call.getString("pageId") ?? ""
        let drawingDataBase64 = call.getString("drawingDataBase64") ?? call.getString("drawingData") ?? ""

        DispatchQueue.global(qos: .userInitiated).async {
            guard let image = Self.decodeImage(from: imageSource) else {
                DispatchQueue.main.async {
                    call.reject("无法读取当前歌谱图片。")
                }
                return
            }

            let existingDrawing = Self.decodeDrawing(from: drawingDataBase64)

            DispatchQueue.main.async { [weak self] in
                guard let self = self, let presenter = self.bridge?.viewController else {
                    call.reject("原生标注页面暂时不可用。")
                    return
                }

                let editor = NativeAnnotationViewController(
                    image: image,
                    title: title,
                    pageId: pageId,
                    drawing: existingDrawing
                )

                editor.onCancel = {
                    call.resolve(["cancelled": true])
                }

                editor.onDone = { result in
                    call.resolve([
                        "cancelled": false,
                        "pageId": pageId,
                        "drawingDataBase64": result.drawingDataBase64,
                        "imageWidth": result.imageSize.width,
                        "imageHeight": result.imageSize.height,
                        "updatedAt": ISO8601DateFormatter().string(from: Date())
                    ])
                }

                let navigation = UINavigationController(rootViewController: editor)
                navigation.modalPresentationStyle = .fullScreen
                presenter.present(navigation, animated: true)
            }
        }
    }

    private static func decodeImage(from source: String) -> UIImage? {
        if let data = decodeDataURL(source) ?? decodePlainBase64(source),
           let image = UIImage(data: data) {
            return image
        }

        guard let url = URL(string: source) else {
            return nil
        }

        if url.isFileURL {
            return UIImage(contentsOfFile: url.path)
        }

        guard let data = try? Data(contentsOf: url),
              let image = UIImage(data: data) else {
            return nil
        }

        return image
    }

    private static func decodeDataURL(_ source: String) -> Data? {
        guard source.hasPrefix("data:"),
              let commaIndex = source.firstIndex(of: ",") else {
            return nil
        }

        let encoded = String(source[source.index(after: commaIndex)...])
        return Data(base64Encoded: encoded, options: [.ignoreUnknownCharacters])
    }

    private static func decodePlainBase64(_ source: String) -> Data? {
        guard !source.hasPrefix("http://"),
              !source.hasPrefix("https://"),
              !source.hasPrefix("file://") else {
            return nil
        }

        return Data(base64Encoded: source, options: [.ignoreUnknownCharacters])
    }

    private static func decodeDrawing(from base64: String) -> PKDrawing {
        guard !base64.isEmpty,
              let data = Data(base64Encoded: base64, options: [.ignoreUnknownCharacters]),
              let drawing = try? PKDrawing(data: data) else {
            return PKDrawing()
        }

        return drawing
    }
}

struct NativeAnnotationResult {
    let drawingDataBase64: String
    let imageSize: CGSize
}

final class NativeAnnotationViewController: UIViewController, UIScrollViewDelegate {
    var onCancel: (() -> Void)?
    var onDone: ((NativeAnnotationResult) -> Void)?

    private let image: UIImage
    private let pageId: String
    private let initialDrawing: PKDrawing
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    private let imageView = UIImageView()
    private let canvasView = PKCanvasView()
    private var toolPicker: PKToolPicker?
    private var hasConfiguredZoom = false

    init(image: UIImage, title: String, pageId: String, drawing: PKDrawing) {
        self.image = image
        self.pageId = pageId
        self.initialDrawing = drawing
        super.init(nibName: nil, bundle: nil)
        self.title = title
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.systemBackground
        configureNavigation()
        configureScrollView()
        configureCanvas()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        configureZoomIfNeeded()
        centerContent()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        showToolPicker()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        toolPicker?.setVisible(false, forFirstResponder: canvasView)
    }

    private func configureNavigation() {
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            title: "取消",
            style: .plain,
            target: self,
            action: #selector(cancelEditing)
        )
        navigationItem.rightBarButtonItem = UIBarButtonItem(
            title: "完成",
            style: .done,
            target: self,
            action: #selector(finishEditing)
        )
    }

    private func configureScrollView() {
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.delegate = self
        scrollView.backgroundColor = UIColor.systemBackground
        scrollView.bouncesZoom = true
        scrollView.alwaysBounceVertical = false
        scrollView.alwaysBounceHorizontal = false
        scrollView.showsVerticalScrollIndicator = false
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.delaysContentTouches = false
        scrollView.canCancelContentTouches = true

        view.addSubview(scrollView)
        NSLayoutConstraint.activate([
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])

        scrollView.addSubview(contentView)

        imageView.image = image
        imageView.contentMode = .scaleToFill
        imageView.isUserInteractionEnabled = false
        contentView.addSubview(imageView)
    }

    private func configureCanvas() {
        canvasView.backgroundColor = .clear
        canvasView.isOpaque = false
        canvasView.isScrollEnabled = false
        canvasView.drawing = initialDrawing
        canvasView.drawingPolicy = .anyInput
        canvasView.minimumZoomScale = 1
        canvasView.maximumZoomScale = 1
        canvasView.contentInset = .zero
        canvasView.alwaysBounceVertical = false
        canvasView.alwaysBounceHorizontal = false
        contentView.addSubview(canvasView)
    }

    private func configureZoomIfNeeded() {
        guard !hasConfiguredZoom, scrollView.bounds.width > 0, scrollView.bounds.height > 0 else {
            return
        }

        hasConfiguredZoom = true
        let imageSize = normalizedImageSize()
        contentView.frame = CGRect(origin: .zero, size: imageSize)
        imageView.frame = contentView.bounds
        canvasView.frame = contentView.bounds
        canvasView.contentSize = imageSize

        scrollView.contentSize = imageSize
        let widthScale = scrollView.bounds.width / max(imageSize.width, 1)
        let heightScale = scrollView.bounds.height / max(imageSize.height, 1)
        let minimumScale = min(widthScale, heightScale)
        scrollView.minimumZoomScale = max(minimumScale, 0.05)
        scrollView.maximumZoomScale = max(scrollView.minimumZoomScale * 8, 6)
        scrollView.zoomScale = scrollView.minimumZoomScale
    }

    private func normalizedImageSize() -> CGSize {
        let size = image.size
        if size.width > 0, size.height > 0 {
            return size
        }

        return CGSize(width: max(image.cgImage?.width ?? 1, 1), height: max(image.cgImage?.height ?? 1, 1))
    }

    private func centerContent() {
        let boundsSize = scrollView.bounds.size
        var frame = contentView.frame
        frame.origin.x = frame.size.width < boundsSize.width ? (boundsSize.width - frame.size.width) / 2 : 0
        frame.origin.y = frame.size.height < boundsSize.height ? (boundsSize.height - frame.size.height) / 2 : 0
        contentView.frame = frame
    }

    private func showToolPicker() {
        let picker = PKToolPicker()
        picker.addObserver(canvasView)
        picker.setVisible(true, forFirstResponder: canvasView)
        canvasView.becomeFirstResponder()
        toolPicker = picker
    }

    func viewForZooming(in scrollView: UIScrollView) -> UIView? {
        return contentView
    }

    func scrollViewDidZoom(_ scrollView: UIScrollView) {
        centerContent()
    }

    @objc private func cancelEditing() {
        dismiss(animated: true) { [weak self] in
            self?.onCancel?()
        }
    }

    @objc private func finishEditing() {
        let drawingData = canvasView.drawing.dataRepresentation()
        let result = NativeAnnotationResult(
            drawingDataBase64: drawingData.base64EncodedString(),
            imageSize: normalizedImageSize()
        )

        dismiss(animated: true) { [weak self] in
            self?.onDone?(result)
        }
    }
}
