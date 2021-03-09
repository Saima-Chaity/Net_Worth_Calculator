var fetch = require('node-fetch');

exports.getConversionRate = async function (baseCurrency) {
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

module.exports = exports;