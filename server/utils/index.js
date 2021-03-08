exports.validateInput = function (input) {
	if (isNaN(input) || input == undefined || input == "NaN" || input == "") {
			return 0;
	}
	return input;
}

exports.calculateTotal = function (category1, category2) {
	let totalValue = 0
	for(let i = 0; i < category1.length; i++) {
		if (exports.validateInput(category1[i].amount) == 0) {
			continue
		}
		totalValue += parseFloat(category1[i].amount)
	} 
	for(let i = 0; i < category2.length; i++) {
		if (exports.validateInput(category2[i].amount) == 0) {
			continue
		}
		totalValue += parseFloat(category2[i].amount)
	}
	return totalValue;
}

exports.updateRowValue = function (item, conversionRate) {
	for (let i = 0; i < item.length; i++) {
		if (exports.validateInput(item[i].amount) == 0) {
			continue
		}
		item[i].amount = (parseFloat(item[i].amount) * conversionRate).toFixed(2)
	}
	return item;
}

exports.updateAllRowValue = function (conversionRate, dataNeedsToUpdate) {
	const { cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities } = dataNeedsToUpdate;
	exports.updateRowValue(cashAndInvestments, conversionRate)
	exports.updateRowValue(longTermAssets, conversionRate)
	exports.updateRowValue(shortTermLiabilities, conversionRate)
	exports.updateRowValue(longTermLiabilities, conversionRate)
}

module.exports = exports;