const express = require("express");
const router = express.Router();
const { Server } = require("socket.io");

// var PORT = process.env.PORT;
// var INDEX = "/home";

// const server = express()
// 	.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
// 	.listen(PORT, () => console.log(`Listening on ${PORT}`));

// const io = new Server({ server });



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