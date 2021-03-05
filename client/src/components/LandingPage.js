import React, { Component } from 'react';
import AssetsTable from './AssetsTable';
import LiabilitiesTable from './LiabilitiesTable';
import services from '../services/services';

class LandingPage extends Component{
	constructor(props) {
		super(props)
		this.state = {
			netWorthValue: 0,
			assets: 0,
			liabilities: 0,
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
				/>
				<hr/>
				<br/>
				<LiabilitiesTable 
					totalLiabilities={this.state.liabilities}
				/>
			</div>
		)
  }
}

export default LandingPage;
