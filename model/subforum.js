console.log("---------------------------------");
console.log(" Qlassroom > model > subforum.js");
console.log("---------------------------------");

// Imports
var sequelize = require("./sequelize/databaseModel.js");
const { Subforum } = sequelize.models;
const { Op } = require("sequelize");

const subforum = {
  createSubforum: function (fk_user_id, subforum_name, subforum_description, callback) {
    Subforum.findOne({ where: { subforum_name } }).then(function (result) {
      if (result == null) {
        Subforum.create({
          subforum_description,
          subforum_name,
          fk_user_id,
        })
          .then(function (result) {
            return callback(null, result);
          })
          .catch(function (err) {
            console.log("Error: " + err);
            return callback(err, null);
          });
      } else {
        return callback("duplicate", null);
      }
    });
  },
};

module.exports = subforum;
