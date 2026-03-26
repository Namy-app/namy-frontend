import UIKit
import Capacitor
import WebKit

class ViewController: CAPBridgeViewController, WKNavigationDelegate {

    private let dynamicRoutes: [(pattern: String, placeholder: String)] = [
        ("/stores/", "stores/placeholder/index.html"),
        ("/admin/stores/", "admin/stores/placeholder/index.html"),
        ("/admin/users/", "admin/users/placeholder/index.html"),
    ]

    override func viewDidLoad() {
        super.viewDidLoad()
        webView?.navigationDelegate = self
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }

        let path = url.path

        for route in dynamicRoutes {
            if path.contains(route.pattern) {
                if let publicDir = Bundle.main.resourceURL?.appendingPathComponent("public") {
                    let relativePath = path.hasPrefix("/") ? String(path.dropFirst()) : path
                    let indexFile = publicDir
                        .appendingPathComponent(relativePath)
                        .appendingPathComponent("index.html")
                    if !FileManager.default.fileExists(atPath: indexFile.path) {
                        let placeholderURL = publicDir.appendingPathComponent(route.placeholder)
                        decisionHandler(.cancel)
                        webView.load(URLRequest(url: placeholderURL))
                        return
                    }
                }
            }
        }

        decisionHandler(.allow)
    }
}
