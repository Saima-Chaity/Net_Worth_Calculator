var express = require("express");
var router = express.Router();
var data = require('../../data/data.json');
var utils = require('../utils/index');
var services = require('../services/index');

this.totalAssets = 0
this.totalLiabilities = 0
this.netWorth = 0

// Route returns initial totals
router.get('/', (req, res) => {
	try {
		const { cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities } = data;
		this.totalAssets = utils.calculateTotal(cashAndInvestments, longTermAssets);
		this.totalLiabilities = utils.calculateTotal(shortTermLiabilities, longTermLiabilities);
		this.netWorth = this.totalAssets - this.totalLiabilities
		res.setHeader('Content-Type', 'application/json');
		res.status(200).send({"data": {"assets": this.totalAssets, "liabilities": this.totalLiabilities, "netWorth": this.netWorth}})
	} catch (error) {
		res.status(404).end();
	}
});

// Route returns totals after an account line is edited
router.post('/calculate', (req, res) => {
	try {
		let { updatedAmount, previousAmount, type } = req.body;
		updatedAmount = utils.validateInput(updatedAmount)
		previousAmount = utils.validateInput(previousAmount)
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

// Route makes a call to get currency rate and update all the values in each editable row and calculate totals
router.post('/currencyconversion', async (req, res) => {
	try {
		const { currency, selectedCurrency, dataNeedsToUpdate } = req.body
		const { cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities } = dataNeedsToUpdate;
		let response = await services.getConversionRate(currency)
		utils.updateAllRowValue(response.rates[selectedCurrency], dataNeedsToUpdate);
		this.totalAssets = utils.calculateTotal(cashAndInvestments, longTermAssets);
		this.totalLiabilities = utils.calculateTotal(shortTermLiabilities, longTermLiabilities);
		this.netWorth = this.totalAssets - this.totalLiabilities;
		res.setHeader('Content-Type', 'application/json');
		res.status(201).send({"data": {"assets": this.totalAssets, "liabilities": this.totalLiabilities, "netWorth": this.netWorth, "updatedRows": dataNeedsToUpdate}})
	} catch (error) {
		res.status(400).end();
	}
});

module.exports = router;