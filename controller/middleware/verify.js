console.log("---------------------------------");
console.log(" ADES > CA1 > Qlassroom > controller > app.js");
console.log("---------------------------------");
const jwt = require("jsonwebtoken");
const config = require("../../config.js").key;

const verify = {
	verifySameUserId : function (req, res, next){
		console.log(req.body);
		var user_id = req.body.user_id || req.params.user_id || req.body.data.user_id;
		console.log("user_id: " + user_id);

		if (typeof req.headers.authorization !== "undefined") {
			// Retrieve the authorization header and parse out the
			// JWT using the split function
			
			let token = req.headers.authorization.split(" ")[1];
			jwt.verify(token, config, (err, data) => {
				console.log(data);
				if (err) {
					console.log(err);
					return res.status(403).send({ "message": "Unauthorized access", errCode: 1 });
				} else {
					if (data.type == 2) {
						req.body.fk_user_type_id = data.userData.user_id;
						next();
					}
					else {
						if (data.userData.user_id !== user_id){
							return res.status(403).send({ "message": "Unauthorized access", errCode: 2 });
						}
						else{
							req.body.fk_user_type_id = data.type;
							next();
						}
					}
				}
			});
		} else {
			res.status(403).send({ "message": "Unauthorized access" });
		}
	},

	extractUserId : function (req, res, next){
		if (typeof req.headers.authorization !== "undefined") {
			// Retrieve the authorization header and parse out the
			// JWT using the split function

			let token = req.headers.authorization.split(" ")[1];
			jwt.verify(token, config, (err, data) => {
				if (err) {
					console.log(err);
					return res.status(403).send({ "message": "Unauthorized access", errCode: 1 });
				} else {
					req.body.token_user_id = data.userData.user_id;
					next();
				}
			});
		} else {
			res.status(401).send({ "message": "Unauthorized access" });
		}
	},

	checkAdmin : function (req, res, next){
		if (typeof req.headers.authorization !== "undefined") {
			// Retrieve the authorization header and parse out the
			// JWT using the split function

			let token = req.headers.authorization.split(" ")[1];
			jwt.verify(token, config, (err, data) => {
				if (err) {
					console.log(err);
					return res.status(403).send({ "message": "Unauthorized access", errCode: 1 });
				} else {
					if (data.type != 2){
						return res.status(403).send({ "message": "Unauthorized access", errCode: 2 });
					}
					else{
						req.body.token_fk_user_type_id = data.type;
						next();
					}
				}
			});
		} else {
			res.status(401).send({ "message": "Unauthorized access" });
		}
	},

	extractUserData : function (req, res){
		if (typeof req.headers.authorization !== "undefined") {
			// Retrieve the authorization header and parse out the
			// JWT using the split function

			let token = req.headers.authorization.split(" ")[1];
			jwt.verify(token, config, (err, data) => {
				if (err) {
					console.log(err);
					return res.status(403).send({ "message": "Unauthorized access", errCode: 1 });
				} else {
					req.body.token_userData = data.userData;
					res.status(200).send(data.userData);
				}
			});
		} else {
			res.status(401).send({ "message": "Unauthorized access" });
		}
	},
};

module.exports = verify;
