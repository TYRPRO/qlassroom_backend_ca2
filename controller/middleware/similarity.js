/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
function similarity(string, string2) {
	var longer = string;
	var shorter = string2;
	if (string.length < string2.length) {
		longer = string2;
		shorter = string;
	}
	var longerLength = longer.length;

	var num = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);

	return num;
}

function matchPattern(string, string2) {
    
	var arr = [];
	var matchDistance = 0;

	string = string.replace(/[^a-zA-Z0-9]/g, "");
	string2 = string2.replace(/[^a-zA-Z0-9]/g, "");

	string = string.match(/.{1,2}/g);
	string2 = string2.match(/.{1,2}/g);

	var totallength = string.length + string2.length;

	for (var i = 0; i < string.length; i++) {
		for (var count = 0; count < string2.length; count++) {
			if (string[i].toLowerCase() == string2[count].toLowerCase() && (string[i] != "#" && string2[count] != "#")) {
				if (i - count > 0) {
					matchDistance += (i - count);
				}
				else if (count - i > 0) {
					matchDistance += (count - 1);
				}

				arr.push(string[i]);
				string[i] = "#";
				string2[count] = "#";
			}
		}
	}

	var formula = (2 * arr.length) / totallength;
	// console.log("Pattern:" + formula);
	// console.log("Match dist:" + matchDistance);
	if (matchDistance > 1) {
		var matchDistance = (formula)/ (Math.log(matchDistance));
		var final = (matchDistance * 0.1) + (formula * 0.9);
		//console.log(final);
		return final;
	}
	else {
		//console.log(formula);
		return formula;
	}
}

//Levenshtein Distance
function editDistance(string, string2) {
	string = string.replace(/[^a-zA-Z0-9]/g, "");
	string2 = string2.replace(/[^a-zA-Z0-9]/g, "");

	string = string.toLowerCase();
	string2 = string2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= string.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= string2.length; j++) {
			if (i == 0)
				costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (string.charAt(i - 1) != string2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue),
							costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) {
			costs[string2.length] = lastValue;
		}
	}
	return costs[string2.length];
}

function calculateSimilarity(string, string2) {
	var similaritylst = [];
	var similarityScore = 0;

	var patternlst = [];
	var patternScore = 0;

	var stringarr = string.split(/\s+/);
	var stringarr2 = string2.split(/\s+/);

	// repeat pattern match to compare each word from string with each word from string2
	if (matchPattern(string, string2) < 0.6) {
		for (var count = 0; count < stringarr.length; count++) {
			patternlst.push(0); 
		}
		for (var i = 0; i < stringarr.length; i++) {
			var highest = patternlst[i];
			for (var counter = 0; counter < stringarr2.length; counter++) {
				if (matchPattern(stringarr[i],string2) > 0.2 && matchPattern(stringarr[i],string2) > highest) {
					highest = matchPattern(stringarr[i],string2);
				}
				else if (matchPattern(stringarr[i],stringarr2[counter]) > 0.2 && matchPattern(stringarr[i],stringarr2[counter]) > highest) {
					highest = matchPattern(stringarr[i],stringarr2[counter]);
				}
			}
			patternlst[i] = highest;
		}

		for (var i = 0; i < patternlst.length; i++) {
			patternScore += patternlst[i];
		}
		patternScore = patternScore/patternlst.length;
	}
	else {
		patternScore = matchPattern(string, string2);
	}

	// repeat similarity to compare each word from string with each word from string2
	if (similarity(string, string2) != 1) {
		if (similarity(string, string2) > 0.2 && !checkRepeat(similaritylst, matchPattern(string, string2))) {
			similaritylst.push(similarity(string, string2));
		}
		for (var i = 0; i < stringarr.length; i++) {
			if (similarity(stringarr[i], string2) > 0.2 && !checkRepeat(similaritylst, similarity(stringarr[i], string2))) {
				similaritylst.push(similarity(stringarr[i], string2));
			}
			for (var count = 0; count < stringarr2.length; count++) {
				if (similarity(stringarr[i], stringarr2[count]) > 0.2 && !checkRepeat(similaritylst, similarity(stringarr[i], stringarr2[count]))) {
					similaritylst.push(similarity(stringarr[i], stringarr2[count]));
				}
				if (similarity(string, stringarr2[count]) > 0.2 && !checkRepeat(similaritylst, similarity(string, stringarr2[count]))) {
					similaritylst.push(similarity(string, stringarr2[count]));
				}
			}
		}

		//collate scores
		if (similaritylst.length > 0) {
			for (var i = 0; i < similaritylst.length; i++) {
				similarityScore += similaritylst[i];
			}
			similarityScore = similarityScore / similaritylst.length;
		}
		else {
			similarityScore = 0;
		}
	}
	else {
		similarityScore = similarity(string, string2);
	}

	var score = (patternScore * (3 / 10)) + (similarityScore * (7 / 10));
	// console.log("Pattern Score: " + patternScore);
	// console.log("Similarity Score: " + similarityScore);
	return score;
}

function checkRepeat(arr, string) {
	for (var i = 0; i < arr.length; i++) {
		if (string == arr[i]) {
			return true;
		}
	}

	return false;
}

module.exports = calculateSimilarity;