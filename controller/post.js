/* eslint-disable no-redeclare */
const express = require("express");

const router = express.Router();
const post = require("../model/post");
const printDebugInfo = require("./middleware/printDebugInfo");
const calculateSimilarity = require("./middleware/similarity");

//Imports required for media upload
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./mediaUploadTemp/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
	}
});
const upload = multer({ dest: "./mediaUploadTemp", storage: storage });
const mediaUpload = require("./mediaUpload");
const verify = require("../controller/middleware/verify");

// Get All Posts
router.get("/", printDebugInfo, (req, res) => {
	post.getAllPosts((err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			res.status(200).send(result);
		}
	});
});

router.post("/", printDebugInfo, verify.verifySameUserId, (req, res) => {
	var title = req.body.title;
	var content = req.body.content;
	var user_id = req.body.user_id;
	var subforum_id = req.body.subforum_id;
	var grade = req.body.grade_id;
	var tags = req.body.tags;

	let pattern = /^[a-zA-Z0-9#$.?! ()%,]*$/;


	if (!pattern.test(title)) {
		return res.status(400).send({ "err": "Please enter a title that is less than 85 characters and contains only letters, numbers, and the following symbols: #$%.,?!()" });
	}
	else {
		post.createPost(user_id, subforum_id, title, content, grade, tags, (err, result) => {
			if (err) {
				if (err.name == "SequelizeValidationError") {
					res.status(400).send({ "err": "Post Information is either missing or invalid" });
				}
				else {
					res.status(500).send({ "err": "Unexpected Error Occured" });
				}
			}
			else {
				res.status(200).send(result);
			}
		});
	}

});


router.put("/", printDebugInfo, (req, res) => {
	var title = req.body.title;
	var content = req.body.content;
	var user_id = req.body.user_id;
	var subforum_id = req.body.subforum_id;
	var grade = req.body.grade_id;
	var tags = req.body.tags;
	var post_id = req.body.post_id;

	let pattern = /^[a-zA-Z0-9#$.?! ()%,]*$/;
	if (!pattern.test(title)) {
		return res.status(400).send({ "err": "Please enter a title that is less than 85 characters and contains only letters, numbers, and the following symbols: #$%.,?!()" });
	}
	else {
		post.updatePost(post_id, title, content, user_id, subforum_id, grade, tags, (err, result) => {
			if (err) {
				if (err.original.code == "22P02") {
					res.status(400).send({ "err": "Post Information is either missing or invalid" });
				}
				else {
					res.status(500).send({ "err": "Unexpected Error Occured" });
				}
			}
			else {
				res.status(200).send(result);
			}
		});
	}

});

// Get Post Made by User ID
router.get("/user/:user_id", printDebugInfo, (req, res) => {
	var user_id = req.params.user_id;
	console.log(user_id);

	post.getAllPostByUser(user_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		}
		else {
			res.status(200).send(result);
		}
	});

});

// Get Saved Post by User ID
router.get("/save/user/:user_id", printDebugInfo, (req, res) => {
	var user_id = req.params.user_id;

	post.getAllSavedPostByUser(user_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.post("/save", printDebugInfo, (req, res) => {
	var user_id = req.body.user_id;
	var post_id = req.body.post_id;

	post.savePost(user_id, post_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			res.status(200).send(result);
		}
	});
});

router.delete("/remove", printDebugInfo, (req, res) => {
	var user_id = req.body.user_id;
	var post_id = req.body.post_id;

	post.removeSavedPost(user_id, post_id, (err, result) => {
		if (err) {
			res.sendStatus(500).send(err);
			console.log(err);
		} else {
			res.sendStatus(202).send(result);
		}
	});
});

router.get("/getAllFromSubforum/:fk_subforum_id", printDebugInfo, (req, res) => {
	var fk_subforum_id = req.params.fk_subforum_id;

	post.getAllSubforumPosts(fk_subforum_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		}
		else {
			res.status(200).send(result);
		}
	});

});

router.post("/upload_image", upload.single("file"), printDebugInfo, (req, res) => {
	var file = req.file;
	if (file != null) {

		mediaUpload(file, function (err, result) {
			if (result) {
				res.status(201).send(result);
				//result: { success: true, media_url: media_url, content_type: content_type }
			}
			else {
				console.log(err);
				res.status(500).send(err);
				//result: { success: false, message: message }
			}
		});
	}
	else {
		res.status(500).send("No file uploaded");
	}
});

// filter
router.post("/filter/home", printDebugInfo, (req, res) => {
	var subforum_id = req.body.subforum_id;
	var grade_id = req.body.grade_id;
	var isanswered = req.body.isanswered;
	if (grade_id == undefined) {
		grade_id = null;
	}
	if (isanswered == undefined) {
		isanswered = null;
	}
	if (subforum_id == undefined) {
		subforum_id = null;
	}
	post.getFilteredPost(subforum_id, grade_id, isanswered, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			res.status(200).send(result);
		}
	});
});

// filter similar posts
router.post("/filter/similar", printDebugInfo, (req, res) => {
	var word = req.query.query;
	
	var subforum_id = req.body.subforum_id;
	var grade_id = req.body.grade_id;
	var isanswered = req.body.isanswered;
	if (grade_id == undefined) {
		grade_id = null;
	}
	if (isanswered == undefined) {
		isanswered = null;
	}
	if (subforum_id == undefined) {
		subforum_id = null;
	}
	post.getFilteredPost(subforum_id, grade_id, isanswered, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			if (word != "") {
				var newarr = [];
				for (var i = 0; i < result.length; i++) {
					console.log(result[i].post_title);
					if (calculateSimilarity(word, result[i].post_title) > 0.4) {
						result[i].dataValues.similar = parseFloat(calculateSimilarity(word, result[i].post_title));
						newarr.push(result[i]);
					}
				}
				res.status(200).send(newarr);
			}
			else {
				res.status(200).send(result);
			}
		}
	});
});

// Updates Post with a Accepted Answer
router.put("/correctAnswer", printDebugInfo, (req, res) => {
	var post_id = req.body.post_id;
	var answer_id = req.body.answer_id;

	post.setCorrectAnswer(post_id, answer_id, (err, result) => {
		if (err) {
			res.status(500).send(err);
			console.log(err);
		} else {
			res.status(200).send(result);
		}
	});
});

//get post searches
router.get("/search", printDebugInfo, function (req, res) {
	var query = req.query.query;

	post.searchPost(query, function (err, result) {
		if (!err) {
			res.status(200).send({ "Result": result });
		} else {
			res.status(500).send({ "message": "Error while searching for post" });
		}
	});

});

//smart search posts
router.get("/SimilarSearch", printDebugInfo, function (req, res) {
	var word = req.query.query;

	post.getAllPosts(function (err, result) {
		if (!err) {
			if (word != "") {
				var newarr = [];
				for (var i = 0; i < result.length; i++) {
					console.log(result[i].post_title);
					if (calculateSimilarity(word, result[i].post_title) > 0.4) {
						result[i].dataValues.similar = parseFloat(calculateSimilarity(word, result[i].post_title));
						newarr.push(result[i]);
					}
				}
				res.status(200).send(newarr);
			}
			else {
				res.status(200).send(result);
			}
		} else {
			console.log(err);
			res.status(500).send({ "message": err });
		}
	});
});

router.get("/:post_id", printDebugInfo, (req, res) => {
	var post_id = req.params.post_id;

	post.getPost(post_id, (err, result) => {
		if (err) {
			if (err.original.code == "22P02") {

				res.status(400).send({ "error": "Invalid Post ID" });
			}
			else {
				console.log(err);
				res.status(500).send({ "error": "Unexpected Error Occured" });
			}
		}
		else {
			if (result == null) {
				res.status(400).send({ "error": "Post not found" });
			}
			else {
				res.status(200).send(result);
			}

		}
	});

});

module.exports = router;