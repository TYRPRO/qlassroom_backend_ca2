let cloudinary = require("../model/cloudinary");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const path = require("path");

async function mediaUpload(file, callback) {
	let fileName = path.basename(file.path);
	let contentResults = typeOfContent(fileName);
	let { validFileType, content_type } = contentResults;
	let fileSizePass = fileSizeChecker(file.path, content_type);
	if (validFileType) {
		if (fileSizePass) {
			cloudinary.uploadFile(file, async function (error, result) {
				try {
					console.log(result);
					console.log(error);
					let media_url = await result.imageURL;
					await unlinkAsync(file.path);
					let data = { success: true, media_url: media_url, content_type: content_type };
					return callback(null, data);
				}
				catch (error) {
					let message = "File Submission Failed";
					console.log(error);
					// Generic Error Message
					await unlinkAsync(file.path);
					let data = { success: false, "message": message };
					return callback(data, null);
				}
			});
		}
		else {
			await unlinkAsync(file.path);
			return callback({ "message": "File too big!" }, null);
		}
	}
	else {
		await unlinkAsync(file.path);
		return callback({ "message": "Invalid File Type" }, null);
	}

}

//check content type
function typeOfContent(fileName) {
	console.log("Filename: " + fileName);
	let fileExtension = fileName.split(".");
	fileExtension = fileExtension[fileExtension.length - 1];
	let validFileType = false;
	let content_type;
	switch (fileExtension.toLowerCase()) {
	case "jpg":
		validFileType = true;
		content_type = 1;
		break;
	case "jpeg":
		validFileType = true;
		content_type = 1;
		break;
	case "png":
		validFileType = true;
		content_type = 1;
		break;
	}

	return { validFileType: validFileType, content_type: content_type };
}

function fileSizeChecker(filePath, content_type) {
	let stats = fs.statSync(filePath);
	let fileSizeInBytes = stats.size;
	let fileSizeMB = fileSizeInBytes / 1000000;
	if (content_type == 1 || content_type == 3) {
		if (fileSizeMB < 10) {
			return true;
		}
		else {
			return false;
		}
	}
	else if (content_type == 2) {
		if (fileSizeMB < 100) {
			return true;
		}
		else {
			return false;
		}
	}
}


module.exports = mediaUpload;