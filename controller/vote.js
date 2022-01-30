const express = require("express");
const router = express.Router();
const vote = require("../model/vote.js");
const { verifySameUserId } = require("./middleware/verify.js");

router.get("/subforum", (req, res) => {
	var subforum_id = req.query.subforum_id;
	var user_id = req.query.user_id;
	vote.getUserSubforumPostVotes(user_id, subforum_id, (result, err) => {
		if (err) {
			res.status(500).send({ "message": "Internal Server Error" });
		} else {
			res.status(200).send(result);
		}
	});
});

router.post("/post_rating", verifySameUserId, (req, res) => {
	var user_id = req.body.user_id;
	var post_id = req.body.post_id;
	var vote_type = req.body.vote_type;

	// Find the user's standing on Post
	vote.getUserPostVotes(user_id, post_id, (result, err) => {
		if (err) {
			console.log(err);
			res.status(500).send({ "message": "Internal Server Error" });
		}
		else {
			if (result.length == 0) {
				vote.createPostVote(vote_type, post_id, user_id, (result, err) => {
					if (err) {
						res.status(500).send({ "message": "Internal Server Error" });
					}
					else {
						res.status(201).send({ "message": "Vote Created" });
					}
				});
			}
			else {
				var requested_vote;
				if (vote_type == 0) {
					requested_vote = false;
				} else {
					requested_vote = true;
				}


				if (requested_vote == result[0].vote_type) {
					res.status(409).send({ "message": "You have already voted on this post" });
				}
				else if (requested_vote != result[0].vote_type) {
					vote.updatePostVote(vote_type, post_id, user_id, (result, err) => {
						if (err) {
							res.status(500).send({ "message": "Internal Server Error" });
						}
						else {
							res.status(200).send({ "message": "Vote Updated" });
						}
					});
				}

			}

		}
	});

});

router.delete("/post_rating", (req, res) => {
	var user_id = req.body.user_id;
	var post_id = req.body.post_id;

	vote.deletePostVote(post_id, user_id, (result, err) => {
		if (err) {
			res.sendStatus(500).send(err);
		}
		else {
			res.sendStatus(200);
		}
	});
});

router.get("/all", (req, res) => {
	var user_id = req.query.user_id;
	vote.getUserVotes(user_id, (result, err) => {
		if (err) {
			res.status(500).send({ "message": "Internal Server Error" });
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.get("/post_rating", (req, res) => {
	var user_id = req.query.user_id;
	var post_id = req.query.post_id;
	vote.getUserPostVotes(user_id, post_id, (result, err) => {
		if (err) {
			res.status(500).send({ "message": "Internal Server Error" });
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.get("/posts/:post_id", (req, res) => {
	var post_id = req.params.post_id;
	vote.getPostVotes(post_id, (result, err) => {
		if (err) {
			res.status(500).send({ "message": "Internal Server Error" });
		}
		else {
			res.status(200).send(result);
		}
	});
});

// Response votes api
// Get a specific response's rating
router.get("/response_rating", (req,res) => {
	console.log("swanfkjnaljksndfljnasjldfknlaksnlkdnjflkjanslkdfnlkjsnklfnjlkjasfasdf");
	var user_id = req.query.user_id;
	var response_id = req.query.response_id;
	vote.getUserResponseVotes(user_id, response_id, (result,err) => {
		if(err) {
			console.log(err);
			res.status(500).send({"message": "Internal Server Error"});
		}
		else {
			res.status(200).send(result);
		}
	});
});

// Add new response rating or update if exists
router.post("/response_rating", verifySameUserId, (req,res) => {
	var user_id = req.body.user_id;
	var response_id = req.body.response_id;
	var vote_type = req.body.vote_type;

	// Find the user's standing on Post
	vote.getUserResponseVotes(user_id, response_id, (result, err) => {
		if(err) {
			console.log(err);
			res.status(500).send({"message": "Internal Server Error"});
		}
		else {
			if(result.length == 0) {
				vote.createResponseVote(vote_type, response_id, user_id, (result,err) => {
					if(err) {
						res.status(500).send({"message": "Internal Server Error"});
					}
					else {
						res.status(201).send({"message": "Vote Created"});
					}
				});
			}
			else {
				var requested_vote;
				if(vote_type == 0) {
					requested_vote = false;
				} else {
					requested_vote = true;
				}


				if(requested_vote == result[0].vote_type) {
					res.status(409).send({"message": "You have already voted on this post"});
				}
				else if (requested_vote != result[0].vote_type) {
					vote.updateResponseVote(vote_type, response_id, user_id, (result,err) => {
						if(err) {
							res.status(500).send({"message": "Internal Server Error"});
						}
						else {
							res.status(200).send({"message": "Vote Updated"});
						}
					});
				}
                
			}
            
		}
	});

});

//Remove a rating
router.delete("/response_rating", (req,res) => {
	var user_id = req.body.user_id;
	var response_id = req.body.response_id;

	vote.deleteResponseVote(response_id, user_id, (result,err) => {
		if(err) {
			res.sendStatus(500).send(err);
		}
		else {
			res.sendStatus(200);
		}
	});
});

//Get all response ratings for 1 post
router.get("/post", (req,res) => {
	var post_id = req.query.post_id;
	var user_id = req.query.user_id;
	vote.getUserPostResponseVotes(user_id, post_id, (result,err) => {
		if(err) {
			res.status(500).send({"message": "Internal Server Error"});
		} else {
			res.status(200).send(result);
		}
	});
});

//Get all votes for 1 response
router.get("/responses/:response_id", (req,res) => {
	var response_id = req.params.response_id;
	vote.getResponseVotes(response_id, (result,err) => {
		if(err) {
			res.status(500).send({"message": "Internal Server Error"});
		}
		else {
			res.status(200).send(result);
		}
	});
});

router.get("/:user_id", (req, res) => {
	var user_id = req.params.user_id;

	vote.getUpvotesGiven(user_id, (result, err) => {
		if (err) {
			res.status(500).send(err);
		}
		else {
			res.status(200).send(result);
		}
	});
});

module.exports = router;