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
	}
}