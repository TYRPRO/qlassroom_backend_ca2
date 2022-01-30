/* eslint-disable no-redeclare */
var config = require("../config.js");
var jwt = require("jsonwebtoken");

var sequelize = require("./sequelize/databaseModel.js");
const e = require("express");
const { User, UserProfile, Authenticate } = sequelize.models;

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
					return callback(null, token, result[0]);
				}
			});
	},

	addUser: function (first_name, last_name, email, roles, phone_number, callback) {
		User.findOne({ where: { email: email } })
			.then(function (result) {
				User.findOne({ where: { phone_number: phone_number } })
					.then(function (result) {
						if (result == null) {
							User.create({
								first_name: first_name,
								last_name: last_name,
								email: email,
								roles: roles,
								phone_number: phone_number
							}).then(function (result) {
								return callback(null, result);
							});

						}
						else {
							var result = "duplicate";
							return callback(null, result);
						}
					});
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
	changePassword: function (user_id, new_password, callback){
		Authenticate.update({
			password: new_password
		},
		{
			where: {
				fk_user_id: user_id
			},
		}
		).then(function(success){
			return callback(null,success);
		}).catch(function(err){
			return callback(err,null);
		});
	}
};

//-----------------------------------
// exports
//-----------------------------------
module.exports = user;