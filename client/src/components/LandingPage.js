import React, { Component } from 'react';
import getSymbolFromCurrency from 'currency-symbol-map'
import AssetsTable from './AssetsTable';
import LiabilitiesTable from './LiabilitiesTable';
import services from '../services/services';
import data from '../constants/data.json';
import { currency_options } from '../constants/CurrencyOptions';
import validator from '../utils/validator';
import formatter from '../utils/formatter';
import './LandingPage.css'

const IsNumberType = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
const AllowedKeycode = [190, 8, 37, 39, 46]

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
			currencySymbol: "$",
			errorMessage: "",
			inputChanged: false,
		}
	}

	async componentDidMount () {
		const response = await services.getTotalPrices();
		if (response) {
			this.updateStateValue(response);
		} else {
			this.throwError();
		}
	}

	updateStateValue = ({ data }) => {
		this.setState({ 
			errorMessage: "",
			inputChanged: false,
			assets: formatter.formatInput(data.assets),
			liabilities: formatter.formatInput(data.liabilities),
			netWorthValue: formatter.formatInput(data.netWorth)
		})
	}

	// Generic error
	throwError = () => {
		this.setState({ errorMessage: "Something went wrong!" })
	}

	// This is needed to get the value before edit
	handleOnFocus = (e, index, type) => {
		let prevAmount = data[type][index]["amount"]
		prevAmount = formatter.removeCommas(prevAmount)
		this.setState({ 
			prevValue: (validator.validateInput(prevAmount) == 0) ? 0 : prevAmount
		})
	}

	// This is used to format the number and make an API request with updated value
	handleKeyUp = async (e, index, type) => {
		let currentValue = data[type][index]["amount"]
		if (this.state.inputChanged) {
			currentValue = formatter.removeCommas(currentValue)
			data[type][index]["amount"] = formatter.formatInput(parseFloat(currentValue))
			let prevValue = formatter.removeCommas(this.state.prevValue)
			let inputValue = formatter.removeCommas(this.state.inputValue)
			const response = await services.calculateUpdatedValue(inputValue, prevValue, this.state.currentType)
			if (response) {
				this.updateStateValue(response);
			} else {
				this.throwError();
			}
		}
	}

	// Handles invalid input and allow only dot, backspace, delete, left, right arrow and numbers
	handleInvalidInput = (e) => {
		const keyCode = (e.which) ? e.which : e.keyCode;
		if (!AllowedKeycode.includes(keyCode) && !IsNumberType.includes(e.key)) {
			e.preventDefault()
		}
	}

	// Handles input change event and check dot count before any changes
	onInputChange = (e, index, type) => {
		let inputValue = e.target.value
		console.log(inputValue)
		let dotCount = 	(inputValue.toString().match(/\./g) || []).length
		if (dotCount <= 1) {
			let updatedAmount = 0
			if (inputValue == "") {
				data[type][index]["amount"] = ""
			} else {
				updatedAmount = (inputValue != "") ? inputValue : "0"  
				data[type][index]["amount"] = inputValue
			}
			this.setState({ 
				inputChanged: true,
				inputValue: updatedAmount,
				currentType: (type === "cashAndInvestments" || type === "longTermAssets") ? "assets" : "liability"
			})
		}
	}

	// Format each editable row value
	updateRowValue = (item, type) => {
		for (let i = 0; i < item.length; i++) {
			if (validator.validateInput(item[i].amount) == 0) {
				continue
			}
			data[type][i].amount = formatter.formatInput(parseFloat(item[i].amount))
		}
		return item;
	}

	// Update all row values with the response from API
	updateAllRowValue = ({ data }) => {
		let {cashAndInvestments, longTermAssets, shortTermLiabilities, longTermLiabilities} = data.updatedRows;
		this.updateRowValue(cashAndInvestments, "cashAndInvestments")
		this.updateRowValue(longTermAssets, "longTermAssets")
		this.updateRowValue(shortTermLiabilities, "shortTermLiabilities")
		this.updateRowValue(longTermLiabilities, "longTermLiabilities")
	}

	// Handles dropdown select event
	handleDropdownChange = async (e) => {
		if (this.state.updatedCurrency !== "") {
			this.setState({ initialCurrency: this.state.updatedCurrency })
		}
		this.setState({ 
			updatedCurrency: e.target.value,
			currencySymbol: getSymbolFromCurrency(e.target.value),
		 }, async () => {
			const response = await services.calculateConversionValue(this.state.initialCurrency, this.state.updatedCurrency, data)
			if (response) {
				this.updateAllRowValue(response);
				this.updateStateValue(response);
			}
		})
	}

  render(){
    return(
			<div className="body_wrapper">
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
				<div className="error">{this.state.errorMessage}</div>
				<hr/>
				<div className="headerContainer">
					<span className="category">Net Worth</span>
					<span className="amount">{this.state.currencySymbol} {this.state.netWorthValue}</span>
				</div>		
				<hr/>
				<span>Assets</span>
				<hr/>
				<AssetsTable 
					totalAssets={this.state.assets} 
					currencySymbol={this.state.currencySymbol}
					onInputValueChange={this.onInputChange}
					handleRemoveFocus={this.handleKeyUp}
					handleOnFocus={this.handleOnFocus}
					blockInvalidInput={this.handleInvalidInput}
				/>
				<hr/>
				<br/>
				<LiabilitiesTable 
					totalLiabilities={this.state.liabilities}
					currencySymbol={this.state.currencySymbol}
					onInputValueChange={this.onInputChange}
					handleRemoveFocus={this.handleKeyUp}
					handleOnFocus={this.handleOnFocus}
					blockInvalidInput={this.handleInvalidInput}
				/>
				<hr/>	
			</div>
		)
  }
}

export default LandingPage;
