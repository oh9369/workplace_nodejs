const https = require("https");
const fs = require("fs");

https
  .createServer(
    {
      cert: fs.readfileSync("도메인 인증서 경로"),
      key: fs.readfileSync("도메인 비밀키 경로"),
      ca: [
        fs.readfileSync("상위 인증서 경로"),
        fs.readfileSync("상위 인증서 경로"),
      ],
    },
    (req, res) => {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.write("<h1>Hello Node!</h1>");
      res.end("<p>Hello Server!</p>");
    }
  )
  .listen(443, () => {
    console.log("443번 포트에서 서버 대기 중입니다!");
  });
