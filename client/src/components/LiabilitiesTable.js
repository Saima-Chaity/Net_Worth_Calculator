import React, { Component } from 'react';
import data from '../constants/data.json';

class LiabilitiesTable extends Component{
  render() {
    const {shortTermLiabilities, longTermLiabilities} = data;
    return (
      <div>
        <span>Liabilities</span>
        <hr/>
        <ul className="liabilitiesLists">
          <li> 
						<span className="category">Short Term Liabilities</span>
						<span className="monthlyPayments">Monthly Payments</span>
						<span className="empty"></span>
					</li>
					<hr/>
					{shortTermLiabilities.map((item, index) => (
						<li key={index}>
							<span className="category">{item.category}</span>
							<span className="monthlyPayments">{item.monthlyPayment}</span>
							<span className="dollarSign">$</span>
							<input 
								type="number" 
								className="amount" 
								value={item.amount} 
								onKeyUp={(e) => null}
								onChange={(e) => null} 
							/>
						</li>
					))}
					<hr/>
					<li> 
						<span className="category">Long Term Debt</span>
						<span className="monthlyPayments"></span>
						<span className="amount"></span>
					</li>
					<hr/>
          {longTermLiabilities.map((item, index) => (
						<li key={index}>
							<span className="category">{item.category}</span>
							<span className="monthlyPayments">{item.monthlyPayment}</span>
							<span className="dollarSign">$</span>
							<input 
								type="number" 
								className="amount" 
								value={item.amount} 
								onKeyUp={(e) => null}
								onChange={(e) => null} 
							/>
						</li>
					))}			
        </ul>
        <hr/>
        <div className="headerContainer">
            <span className="category">Total Liabilities</span>
            <span className="amount">$ 123</span>
        </div>	
      </div>
    )
  }
} 
export default LiabilitiesTable;