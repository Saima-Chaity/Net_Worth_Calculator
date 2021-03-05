import React, { Component } from 'react';
import AssetsTable from './AssetsTable';
import LiabilitiesTable from './LiabilitiesTable';
import services from '../services/services';
import data from '../constants/data.json';

class LandingPage extends Component{
	constructor(props) {
		super(props)
		this.state = {
			netWorthValue: 0,
			assets: 0,
			liabilities: 0,
			inputValue: 0,
			prevValue: 0,
			currentType: ""
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

  render(){
    return(
			<div>
				<span>Tracking your Networth</span>
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
