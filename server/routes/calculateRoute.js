var express = require("express");
var router = express.Router();
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

router.get('/', (req, res) => {
	const { cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities } = data;
	this.totalAssets = calculateTotal(cashAndInvestments, longTermAssets);
	this.totalLiabilities = calculateTotal(shortTermLiabilities, longTermLiabilities);
	this.netWorth = this.totalAssets - this.totalLiabilities
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({"data": {"assets": this.totalAssets, "liabilities": this.totalLiabilities, "netWorth": this.netWorth}})
});

router.post('/calculate', (req, res) => {
	let { updatedAmount, previousAmount, type } = req.body;
	updatedAmount = validateInput(updatedAmount)
	previousAmount = validateInput(previousAmount)
	if (type === "assets") {
		this.totalAssets = (this.totalAssets - parseFloat(previousAmount)) + parseFloat(updatedAmount)
	} else if (type === "liability") {
		this.totalLiabilities = (this.totalLiabilities - parseFloat(previousAmount)) + parseFloat(updatedAmount)
	}
	this.netWorth = this.totalAssets - this.totalLiabilities
	res.status(201).send({"data": {"assets": this.totalAssets, "liabilities": this.totalLiabilities, "netWorth": this.netWorth}})
});

router.post('/currencyconversion', (req, res) => {
	const { updatedData } = req.body
	const { cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities } = updatedData;
	this.totalAssets = calculateTotal(cashAndInvestments, longTermAssets);
	this.totalLiabilities = calculateTotal(shortTermLiabilities, longTermLiabilities);
	this.netWorth = this.totalAssets - this.totalLiabilities
	res.setHeader('Content-Type', 'application/json');
	res.status(201).send({"data": {"assets": this.totalAssets, "liabilities": this.totalLiabilities, "netWorth": this.netWorth}})
});

module.exports = router;