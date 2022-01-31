// var express = require("express");
// var { Server } = require("socket.io");
// var router = express.Router();
// var port = process.env.PORT || 8000;
// var baseUrl;
// if (process.env.PORT != null) {
// 	baseUrl = "http://localhost:3000/";
// }
// else {
// 	baseUrl = "https://qlassroomforum.herokuapp.com/:" + process.env.PORT;
// }

// const io = new Server(port, {
// 	cors: {
// 		origin: baseUrl
// 	}
// });

// io.on("connection", (socket) => {
// 	socket.on("join", (data) => {
// 		socket.join(data.roomid);
// 	});

// 	socket.on("sendmessage", (data) => {
// 		console.log(data);
// 		if (data.user != undefined) {
// 			io.in(data.roomid).emit("receivemessage", data);
// 		}
// 	});


// 	socket.on("leave", (data) => {
// 		socket.leave(data.roomid);
// 	});
// });


// module.exports = router;