import React, { Component } from 'react';
import AssetsTable from './AssetsTable';
import LiabilitiesTable from './LiabilitiesTable';
import services from '../services/services';
import data from '../constants/data.json';
import { currency_options } from '../constants/CurrencyOptions';

class LandingPage extends Component{
	constructor(props) {
		super(props)
		this.state = {
			netWorthValue: 0,
			assets: 0,
			liabilities: 0,
			inputValue: 0,
			prevValue: 0,
			currentType: "",
			filteredList: currency_options,
			initialCurrency: currency_options[0]['value'],
			updatedCurrency: "",
		}
	}

	async componentDidMount () {
		const response = await services.getTotalPrices();
		this.updateStateValue(response);
	}

	updateStateValue = (response) => {
		this.setState({ 
			assets: response.data.assets,
			liabilities: response.data.liabilities,
			netWorthValue: response.data.netWorth
		})
	}

	handleKeyUp = async () => {
		console.log(data)
		const response = await services.calculateUpdatedValue(this.state.inputValue, this.state.prevValue, this.state.currentType)
		this.updateStateValue(response);
	}

	onInputChange = (e, index, type) => {
		let inputValue = e.target.value
		let updatedAmount = parseInt(inputValue) ? inputValue : ""
		let prevAmount = data[type][index]["amount"]
		data[type][index]["amount"] = updatedAmount
		this.setState({ 
			prevValue: prevAmount,
			inputValue: updatedAmount,
			currentType: (type === "cashAndInvestments" || type === "longTermAssets") ? "assets" : "liability"
		}, async () => {
			await this.handleKeyUp()
		})
	}

	updateRowValue = (item, conversionRate) => {
		for (let i = 0; i < item.length; i++) {
			if (item[i].amount) {
				item[i].amount = parseInt(item[i].amount) * conversionRate
			}
		}
		return item;
	}

	updateAllRowValue = async (conversionRate) => {
		const {cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities} = data;
		this.updateRowValue(cashAndInvestments, conversionRate)
		this.updateRowValue(longTermAssets, conversionRate)
		this.updateRowValue(shortTermLiabilities, conversionRate)
		this.updateRowValue(longTermLiabilities, conversionRate)
		const response = await services.calculateConversionValue(data)
		this.updateStateValue(response);
	}

	handleDropdownChange = async (e) => {
		if (this.state.updatedCurrency !== "") {
			this.setState({ initialCurrency: this.state.updatedCurrency })
		}
		this.setState({ updatedCurrency: e.target.value }, async () => {
			const response = await services.getConversionRate(this.state.initialCurrency, this.state.updatedCurrency)
		})
	}

  render(){
    return(
			<div>
				<span>Tracking your Networth</span>
				<div className="custom-select">
					<select value={this.state.currency} onChange={this.handleDropdownChange}>
						{this.state.filteredList.map((option, index) => (
							<option key={index} value={option.value}>
								{option.value}
							</option>
						))}
					</select>
				</div>
				<hr/>
				<div className="headerContainer">
					<span className="category">Net Worth</span>
					<span className="amount">${this.state.netWorthValue}</span>
				</div>		
				<hr/>
				<span>Assets</span>
				<hr/>
				<AssetsTable 
					totalAssets={this.state.assets} 
					onInputValueChange={this.onInputChange}
				/>
				<hr/>
				<br/>
				<LiabilitiesTable 
					totalLiabilities={this.state.liabilities}
					onInputValueChange={this.onInputChange}
				/>
			</div>
		)
  }
}

export default LandingPage;
