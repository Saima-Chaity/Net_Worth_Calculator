var express = require("express");
var router = express.Router();
var fetch = require('node-fetch');
var data = require('../../client/src/constants/data.json');
var utils = require('../utils/index');

this.totalAssets = 0
this.totalLiabilities = 0
this.netWorth = 0

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

router.post('/currencyconversion', async (req, res) => {
	try {
		const { currency, selectedCurrency, dataNeedsToUpdate } = req.body
		const { cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities } = dataNeedsToUpdate;
		let response = await getConversionRate(currency)
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