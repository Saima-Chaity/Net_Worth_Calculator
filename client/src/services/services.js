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
			return "Something went wrong"
		}
	}
}



