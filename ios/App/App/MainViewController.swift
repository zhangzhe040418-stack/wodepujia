import Capacitor
import UIKit

@objc(MainViewController)
class MainViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        super.capacitorDidLoad()
        bridge?.registerPluginType(NativeAnnotationPlugin.self)
    }
}
