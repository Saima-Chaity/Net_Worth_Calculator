import React, { Component } from 'react';
import data from '../constants/data.json';

class AssetsTable extends Component{
  render() {
		const {totalAssets, onInputValueChange} = this.props;
    const {cashAndInvestments, longTermAssets} = data;
    return (
      <div>
        <span>Cash and Investments</span>
				<hr/>
				<ul className="lists">
					{cashAndInvestments.map((item, index) => (
						<li key={index}>
							<span className="category">{item.category}</span>
							<span className="dollarSign">$</span>
							<input 
								type="number" 
								className="amount" 
								value={item.amount} 
								onChange={(e) => onInputValueChange(e, index, 'cashAndInvestments')} 
							/>
						</li>
					))}
				</ul>
				<span>Long Term Assets</span>
				<hr/>
				<ul className="lists">
					{longTermAssets.map((item, index) => (
						<li key={index}>
							<span className="category">{item.category}</span>
							<span className="dollarSign">$</span>
							<input 
								type="number" 
								className="amount" 
								value={item.amount} 
								onChange={(e) => onInputValueChange(e, index, 'longTermAssets')} 
							/>
						</li>
					))}			
				</ul>
				<hr/>
				<div className="headerContainer">
					<span className="category">Total Assets</span>
					<span className="amount">$ {totalAssets}</span>
				</div>	
      </div>
    )
  }
} 
export default AssetsTable;