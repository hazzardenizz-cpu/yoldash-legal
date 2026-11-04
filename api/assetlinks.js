export default function handler(_req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
  res.status(200).send(JSON.stringify([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.hazardeniz.yoldash",
        sha256_cert_fingerprints: [
          "46:07:B3:3C:23:71:FE:40:4D:38:2B:56:E7:34:B1:18:93:97:7A:89:FA:FD:98:F1:B0:2B:B0:C6:5E:94:28:83"
        ]
      }
    }
  ]));
}
