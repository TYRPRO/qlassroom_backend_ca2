const express = require("express");
const router = express.Router();
const user = require("../model/user");
const verify = require("./middleware/verify.js");
const printDebugInfo = require("./middleware/printDebugInfo");

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

// Endpoints

router.get("/verify", printDebugInfo, verify.checkAdmin, function (req, res) {
	res.status(200).send({ "Results": "Verified" });
});

router.get("/userData", printDebugInfo, verify.extractUserData, function (req, res) {
	res.status(200).send({ "Results": "Verified" });
});

//login
router.post("/api/login", printDebugInfo, function (req, res) {

	var email = req.body.email;
	var password = req.body.password;

	user.login(email, password, function (err, token, result) {
		if (!err) {
			if (!result) {
				// this is matched to callback(null, null, null)
				var message = { "message": "Invalid Credentials" };

				res.status(401).send(message);
			}
			else {
				// this is matched to callback(null, not null)  
				var msg = {
					"token": token
				};
				res.status(200).send(msg);
			}

		} else {
			// this is matched to callaback(not null, null)
			res.status(500).send({ "message": "Error authenticating user." });
		}

	});
});

//adduser
router.post("/signup", upload.single("image"), printDebugInfo, function (req, res) {
	console.log(req.body);
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var password = req.body.password;
	var roles = ["forum_user"];
	var phone_number = req.body.phone_number;

	var school = req.body.school;
	var date_of_birth = req.body.date_of_birth;
	var gender = req.body.gender;
	
	function submitEdit(profile_pic) {
		user.addUser(first_name, last_name, email, roles, phone_number, function (err, result) {
			if (!err) {
				if (result == "duplicate") {
					res.status(422).send({ "message": "User already exists!" });
				}
				else {
					user.getUserID(email, function (err, result) {
						var fk_user_id = result.user_id;
						if (!err) {
							user.addPassword(fk_user_id, password, function (err, result) {
								if (!err) {
									user.addUserProfile(fk_user_id, profile_pic, school, date_of_birth, gender, function (err, result) {
										if (!err) {
											res.status(201).send({ "Result": "Success!" });
										}
										else {
											res.status(500).send({ "message": "Error creating Profile" });
										}
									});
								}
								else {
									res.status(500).send({ "message": "Error creating Password" });
								}
							});
						}
						else {
							res.status(500).send({ "message": "Error extracting User ID" });
						}
					});
				}
			}
			else {
				res.status(500).send({ "message": "Error adding User" });
			}
		});
	}

	var file = req.file;
	if (file != null) {
		mediaUpload(file, function (err, result) {
			if (result) {
				var profile_pic = result.media_url;
				submitEdit(profile_pic);
			}
			else {
				if (err.message == "File too big!" || err.message == "Invalid File Type") {
					res.status(400).send({ "message": err.message });
				}
				else {
					res.status(500).json({ "message": err.message });
				}
			}
		});
	}
	else {
		submitEdit(null);
	}
});

//get profile info
router.get("/profile", printDebugInfo, verify.extractUserId, function(req,res) { 
	let user_id = req.body.token_user_id;
	user.getProfile(user_id, function (err, result){
		if (result == null){
			res.status(400).send({"Error":"User not found."});
		}
		else if (result) {
			res.status(200).send(result);
		}
		else{
			res.status(500).send(err);
		}
	});
});

//edit user profile
router.put("/profile", upload.single("file"), printDebugInfo, verify.extractUserId, function(req,res){
	var user_id = req.body.token_user_id;
	var password = req.body.password;
	var profile_pic = req.body.profile_pic;
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;


	user.checkPassword(user_id, password, function (err, result) {
		if (!err && result != null) {
			var file = req.file;
			console.log(file);
			if (file != null){
				console.log("uploading file");
				mediaUpload(file, function (err,result){
					if (result){
						let profile_pic_arr = result.media_url.split("upload");
						let temp_profile_pic = profile_pic_arr[0] + "upload" + "/ar_1.0,c_fill/r_max" + profile_pic_arr[1];
						profile_pic = temp_profile_pic;
						submitEdit(profile_pic);
					}
					else{
						res.status(500).json({"Message":err.message});
					}
				});
			}
			else{
				submitEdit(profile_pic);
			}   
		}
		else {
			if (err.message == "Wrong Password!"){
				res.status(401).send({"message":err.message});
			}
			console.log(err);
			res.status(500).send({"message":"Error checking password."});
		}
	});
	

	function submitEdit(profile_pic){
    
		user.editProfile(user_id, profile_pic, first_name, last_name, email, function (err, result) {
			if (!err) {
				var output = {
					"success": true,
					"affected rows": result.affectedRows,
					"changed rows": result.changedRows
				};
				res.status(200).send(output);
			}
			else {
				res.status(500).send({"Message":"Error editing user details."});
			}
		});
	}    
});

//edit password
router.put("/password", printDebugInfo, verify.extractUserId, function(req,res){
	var user_id = req.body.token_user_id;
	var new_password = req.body.new_password;
	var old_password = req.body.old_password;


	user.checkPassword(user_id, old_password, function (err, result) {
		if (!err && result != null) {
			var file = req.file;
			console.log(file);
			user.changePassword(user_id, new_password, function (err, result){
				if (result){
					res.status(200).send(result);
				}
				else{
					res.status(500).send(err);
				}
			});
		}
		else {
			if (err.message == "Wrong Password!"){
				res.status(401).send({"message":err.message});
			}
			console.log(err);
			res.status(500).send({"message":"Error checking password."});
		}
	});  
});

module.exports = router;