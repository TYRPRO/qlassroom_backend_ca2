const express = require("express");
const router = express.Router();
const { Server } = require("socket.io");

// var port = "";
// port = 8001;

// const io = new Server(port, {
// 	cors: {
// 		origin: port,
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


module.exports = router;