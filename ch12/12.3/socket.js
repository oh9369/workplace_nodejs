const SocketIO = require("socket.io");

module.exports = (server) => {
  const io = SocketIO(server, { path: "/socket.io" });

  io.on("connection", (socket) => {
    // 웹소켓 연결시
    const req = socket.request;
    const ip = req.headers["x-forward-for"] || req.socket.remoteAddress;
    console.log("새로운 클라이언트 접속", ip,socket.id, req.ip);
    socket.on("disconnect", () => {
      // 연결 종료시
      console.log("클라이언트 접속 해제", ip, socket.id);
      clearInterval(socket.interval);
    });
    socket.on("error", (err) => {
      // 에러시
      console.error(err);
    });
    socket.on("reply", (data) => {
      // 클라이언트로부터 메시지
      console.log(data);
    });
    socket.interval = setInterval(() => {
      // 3초마다 클라이언트로 메시지 전송
      socket.emit("news", "Hello Socket.IO");
    }, 3000);
  });
};
