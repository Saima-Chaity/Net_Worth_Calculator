var express = require("express");
var router = express.Router();
const data = require('../../client/src/constants/data.json');

this.totalAssets = 0
this.totalLiabilities = 0
this.netWorth = 0

function calculateTotal(category1, category2) {
	let totalValue = 0
	for(let i = 0; i < category1.length; i++) {
		if (category1[i].amount) {
			totalValue += parseInt(category1[i].amount)
		}
	}   
	for(let i = 0; i < category2.length; i++) {
		if (category2[i].amount) {
			totalValue += parseInt(category2[i].amount)
		}
	}
	return totalValue;
}

router.get('/', (req, res) => {
	const {cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities} = data;
	this.totalAssets = calculateTotal(cashAndInvestments, longTermAssets);
	this.totalLiabilities = calculateTotal(shortTermLiabilities, longTermLiabilities);
	this.netWorth = this.totalAssets - this.totalLiabilities
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send({"data": {"assets": this.totalAssets, "liabilities": this.totalLiabilities, "netWorth": this.netWorth}})
});

module.exports = router;