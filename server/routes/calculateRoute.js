var express = require("express");
var router = express.Router();
var fetch = require('node-fetch');
const data = require('../../client/src/constants/data.json');

this.totalAssets = 0
this.totalLiabilities = 0
this.netWorth = 0

function validateInput(input) {
	if (isNaN(input) || input == undefined || input == "NaN" || input == "") {
		return 0;
	}
	return input;
}

function calculateTotal(category1, category2) {
	let totalValue = 0
	for(let i = 0; i < category1.length; i++) {
		if (validateInput(category1[i].amount) == 0) {
			continue
		}
		totalValue += parseFloat(category1[i].amount)
	} 
	for(let i = 0; i < category2.length; i++) {
		if (validateInput(category2[i].amount) == 0) {
			continue
		}
		totalValue += parseFloat(category2[i].amount)
	}
	return totalValue;
}

async function getConversionRate(baseCurrency) {
	const callResponse = await fetch(`https://api.exchangeratesapi.io/latest?base=${baseCurrency}`, {
		method:'get',
	})
	if (callResponse.ok) {
		const data = await callResponse.json()
		return data;
	} else {
		return false;
	}
}

function updateRowValue (item, conversionRate) {
	for (let i = 0; i < item.length; i++) {
		if (validateInput(item[i].amount) == 0) {
			continue
		}
		item[i].amount = (parseFloat(item[i].amount) * conversionRate).toFixed(2)
	}
	return item;
}

function updateAllRowValue (conversionRate, dataNeedsToUpdate) {
	const { cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities } = dataNeedsToUpdate;
	updateRowValue(cashAndInvestments, conversionRate)
	updateRowValue(longTermAssets, conversionRate)
	updateRowValue(shortTermLiabilities, conversionRate)
	updateRowValue(longTermLiabilities, conversionRate)
}

router.get('/', (req, res) => {
	try {
		const { cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities } = data;
		this.totalAssets = calculateTotal(cashAndInvestments, longTermAssets);
		this.totalLiabilities = calculateTotal(shortTermLiabilities, longTermLiabilities);
		this.netWorth = this.totalAssets - this.totalLiabilities
		res.setHeader('Content-Type', 'application/json');
		res.status(200).send({"data": {"assets": this.totalAssets, "liabilities": this.totalLiabilities, "netWorth": this.netWorth}})
	} catch (error) {
		res.status(404).end();
	}
});

router.post('/calculate', (req, res) => {
	try {
		let { updatedAmount, previousAmount, type } = req.body;
		updatedAmount = validateInput(updatedAmount)
		previousAmount = validateInput(previousAmount)
		if (type === "assets") {
			this.totalAssets = (this.totalAssets - parseFloat(previousAmount)) + parseFloat(updatedAmount)
		} else if (type === "liability") {
			this.totalLiabilities = (this.totalLiabilities - parseFloat(previousAmount)) + parseFloat(updatedAmount)
		}
		this.netWorth = this.totalAssets - this.totalLiabilities;
		res.status(201).send({"data": {"assets": this.totalAssets, "liabilities": this.totalLiabilities, "netWorth": this.netWorth}})
	} catch (error) {
		res.status(400).end();
	}
});

router.post('/currencyconversion', async (req, res) => {
	try {
		const { currency, selectedCurrency, dataNeedsToUpdate } = req.body
		const { cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities } = dataNeedsToUpdate;
		let response = await getConversionRate(currency)
		updateAllRowValue(response.rates[selectedCurrency], dataNeedsToUpdate);
		this.totalAssets = calculateTotal(cashAndInvestments, longTermAssets);
		this.totalLiabilities = calculateTotal(shortTermLiabilities, longTermLiabilities);
		this.netWorth = this.totalAssets - this.totalLiabilities;
		res.setHeader('Content-Type', 'application/json');
		res.status(201).send({"data": {"assets": this.totalAssets, "liabilities": this.totalLiabilities, "netWorth": this.netWorth, "updatedRows": dataNeedsToUpdate}})
	} catch (error) {
		res.status(400).end();
	}
});

module.exports = router;