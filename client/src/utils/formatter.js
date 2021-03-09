import validator from './validator';

export default {
	formatInput: function (number) {
		if (validator.validateInput(number) == 0) {
			number = 0
		}
		return number.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
	},

	removeCommas: function (number) {
		number = number.toString();
		number = number.replace(/\,/g,'');
		return number;
	}
}