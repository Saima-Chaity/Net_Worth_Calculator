export default {
	validateInput: function (input) {
		if (isNaN(input) || input == undefined || input == "NaN" || input == "") {
			return 0;
		}
		return input;
	}
}