/* eslint-disable no-redeclare */
var config = require("../config.js");
var jwt = require("jsonwebtoken");

var sequelize = require("./sequelize/databaseModel.js");
const { User, UserOAuth, UserProfile, Authenticate } = sequelize.models;

//-----------------------------------
// objects / functions
//-----------------------------------
var user = {

	login: function (email, password, callback) {
		User.findAll({
			attributes: ["user_id", "first_name", "last_name", "roles"],
			where: {
				email: email
			},
			include: [
				{
					model: Authenticate,
					attributes: ["fk_user_id"],
					where: {
						password: password
					},
				},
			]
		})
			.then(function (result) {
				if (result.length == 0) {
					return callback(null, null, null);
				}
				// it must be that we have ONE result here,
				// since the email is Unique
				else {
					//confirm if we have the key
					console.log("Secret Key: " + config.key);
					console.log("Result[0] userid: " + result[0].user_id);
					console.log("Result: " + result);
					//generate the token

					var token = jwt.sign(
						// (1) Payload
						{
							userData: result[0]
						},
						// (2) Secret Key
						config.key,
						// (3) Lifretime of token
						{
							//expires in 24 hrs
							expiresIn: 86400
						}
					);
					console.log(result);
					return callback(null, token, result[0]);
				}
			});
	},
  
	checkUserExists: function (google_uuid, callback) {
		UserOAuth.findOne({
			attributes: ["fk_user_id"],
			where: { oauth_id: google_uuid }
		}).then((result) => {
			callback(null, result);
		}).catch((err) => {
			callback(err, null);
		});
	},

	loginOAuth: function (auth_id, email, callback) {
		UserOAuth.findAll({
			attributes: ["fk_user_id"],
			where: {
				oauth_id: auth_id
			},
			include: [
				{
					model: User,
				}
			]
		}).then(function (result) {
			if (result.length == 0) {
				return callback(null, null, null);
			}
			// it must be that we have ONE result here,
			// since the oauthid is Unique
			else {

				result = [result[0].dataValues.User];
				console.log(result);

				if(result[0].dataValues.email != email) {
					return callback(null, null, null);
				}
				//confirm if we have the key
				console.log("Secret Key: " + config.key);
				console.log("Result[0] userid: " + result[0].user_id);
				console.log("Result: " + result);
				//generate the token

				var token = jwt.sign(
					// (1) Payload
					{
						userData: result[0]
					},
					// (2) Secret Key
					config.key,
					// (3) Lifretime of token
					{
						//expires in 24 hrs
						expiresIn: 86400
					}
				);
				return callback(null, token, result[0]);
			}
		});
	},

	createAssociation: function (user_id, google_uuid, callback) {
		UserOAuth.create({
			fk_user_id: user_id,
			oauth_id: google_uuid
		}).then((result) => {
			callback(null, result);
		}).catch((err) => {
			callback(err, null);
		});
	},


	addUser: function (first_name, last_name, email, roles, callback) {
		User.findOne({ where: { email: email } })
			.then(function (result) {
				if (result) {
					if (result == null) {
						User.create({
							first_name: first_name,
							last_name: last_name,
							email: email,
							roles: roles,
						}).then(function (result) {
							return callback(null, result);
						});

					}
					else {
						var result = "duplicate";
						return callback(null, result);
					}
				}
				else {
					User.create({
						first_name: first_name,
						last_name: last_name,
						email: email,
						roles: roles,
					}).then(function (result) {
						return callback(null, result);
					}).catch(function (err) {
						console.log(err);
						return callback(err, null);
					});
				}
			});
	},

	addUserProfile: function (fk_user_id, profile_pic, school, date_of_birth, gender, callback) {
		UserProfile.create({
			fk_user_id: fk_user_id,
			profile_pic: profile_pic,
			school: school,
			date_of_birth: date_of_birth,
			gender: gender
		}).then(function (result) {
			return callback(null, result);
		});
	},

	addOAuthUserProfile: function (fk_user_id, callback) {
		UserProfile.create({
			fk_user_id: fk_user_id,
		}).then(function (result) {
			return callback(null, result);
		});
	},

	addPassword: function (fk_user_id, password, callback) {
		Authenticate.create({
			fk_user_id: fk_user_id,
			password: password
		}).then(function (result) {
			return callback(null, result);
		});
	},

	getUserID: function (email, callback) {
		User.findOne({ where: { email: email } })
			.then(function (result) {
				return callback(null, result);
			});
	},
	getProfile: function (user_id, callback) {
		User.findOne({
			attributes: ["user_id", "first_name", "last_name", "roles", "email"],
			where: {
				user_id
			},
			include: [
				{
					model: UserProfile
				}
			]
		})
			.then(function (result) {
				if (result.length == 0) {
					return callback(null, null);
				}
				else {
					return callback(null, result);
				}
			})
			.catch(function (err) {
				return callback(err, null);
			});
	},
	checkPassword: function (user_id, password, callback) {
		User.findOne({
			where: {
				user_id
			},
			include: [
				{
					model: Authenticate,
					where: {
						password
					},
				},
			]
		})
			.then(function (result) {
				if (typeof result === "undefined" || result == null) {
					var err = { message: "Wrong Password!" };
					return callback(err, null);
				}
				else {
					return callback(null, true);
				}
			});
	},
	editProfile: function (user_id, profile_pic, first_name, last_name, email, callback) {
		User.update(
			{
				first_name,
				last_name,
				email
			},
			{ where: { user_id } }
		)
			.then(function (result) {
				let previousResult = result;
				UserProfile.update(
					{
						profile_pic
					},
					{ where: { fk_user_id: user_id } }
				).then(function () {
					return callback(null, previousResult);
				}).catch(function (err) {
					return callback(err, null);
				});
			}).catch(function (err) {
				return callback(err, null);
			});
	},
	changePassword: function (user_id, new_password, callback) {
		Authenticate.update({
			password: new_password
		}, {
			where: {
				fk_user_id: user_id
			},
		}
		).then(function (success) {
			return callback(null, success);
		}).catch(function (err) {
			return callback(err, null);
		});
	}
};

//-----------------------------------
// exports
//-----------------------------------
module.exports = user;