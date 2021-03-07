const BASE_URL = "http://localhost:5000/api";

export default {
	async getTotalPrices() {
		const callResponse = await fetch(BASE_URL, {
			method:'get',
		})
		if (callResponse.ok) {
			const data = await callResponse.json()
			return data;
		} else {
			return false;
		}
	},

	async calculateUpdatedValue(currentAmount, prevAmount, currentType) {
		const post_data = JSON.stringify({
			"updatedAmount": (currentAmount) ? currentAmount : 0, 
			"previousAmount": (prevAmount) ? prevAmount : 0, 
			"type": currentType
		})
		const requestOption = {
			method:'post',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
			},
			body: post_data
		}
		const callResponse = await fetch(BASE_URL + '/calculate', requestOption)
		if (callResponse.ok) {
			const data = await callResponse.json()
			return data;
		} else {
			return false;
		}
	},

	async calculateConversionValue(baseCurrency, selectedCurrency, data) {
		const requestOption = {
			method:'post',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
			},
			body: JSON.stringify({ "currency": baseCurrency, "selectedCurrency": selectedCurrency, "dataNeedsToUpdate": data }),
		}
		const callResponse = await fetch(BASE_URL + '/currencyconversion', requestOption)
		if (callResponse.ok) {
			const data = await callResponse.json()
			return data;
		} else {
			return false;
		}
	},
}



