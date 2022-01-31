const express = require("express");
const router = express.Router();
const subforum = require("../model/subforum");
const printDebugInfo = require("./printDebugInfo");

router.post("/create", printDebugInfo, (req, res) => {
  let { fk_user_id, subforum_name, subforum_description } = req.body;
  let emptyErrMsg = ["", " cannot be empty! "];
  let lengthErrMsg = "";
  let emptyErrored = false;
  let lengthErrored = false;

  function addEmptyErrMsg(emptyFieldName) {
    emptyErrMsg[0] += emptyFieldName;
    emptyErrored = true;
  }

  function addLengthErrMsg(messageString) {
    lengthErrMsg += messageString;
    lengthErrored = true;
  }
  try {
    //Empty Fields Check
    if (fk_user_id.trim().length === 0) {
      addEmptyErrMsg("User ID");
    }
    if (subforum_name.trim().length === 0) {
      emptyErrored ? (emptyErrMsg[0] += ", Subforum Name") : addEmptyErrMsg("Subforum Name");
    }
    if (subforum_description.trim().length === 0) {
      emptyErrored ? (emptyErrMsg[0] += ", Subforum Description") : addEmptyErrMsg("Subforum Description");
    }
    emptyErrMsg[0] += emptyErrMsg[1];

    //Character Limit Check
    if (subforum_name.length > 45) {
      addLengthErrMsg("Subforum Name cannot exceed 45 characters");
    }
    if (subforum_description.length > 100) {
      lengthErrored ? (lengthErrMsg += " and Subforum Description cannot exceed 100 characters") : addLengthErrMsg("Subforum Description cannot exceed 100 characters");
    }
    lengthErrMsg += "!";

    if (emptyErrored && lengthErrored) {
      res.status(400).send({ Error: emptyErrMsg[0] + lengthErrMsg });
    } else if (emptyErrored) {
      res.status(400).send({ Error: emptyErrMsg[0] });
    } else if (lengthErrored) {
      res.status(400).send({ Error: lengthErrMsg });
    } else {
      subforum.createSubforum(fk_user_id, subforum_name, subforum_description, function (err, result) {
        if (result) {
          res.status(201).send({ Message: "Subforum created successfully!" });
        } else if (err === "duplicate") {
          res.status(422).send({ Error: "Subforum exists!" });
        } else {
          res.status(500).send({ Error: "Internal server error occured!" });
        }
      });
    }
  } catch {
    res.status(400).send({ Error: "Bad Request Received." });
  }
});

module.exports = router;
