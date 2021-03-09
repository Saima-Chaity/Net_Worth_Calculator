import React, { Component } from 'react';
import data from '../constants/data.json';

class LiabilitiesTable extends Component{
  render() {
		const {totalLiabilities, currencySymbol, handleOnFocus, handleRemoveFocus, blockInvalidInput, onInputValueChange} = this.props;
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
							<span className="dollarSign">{currencySymbol}</span>
							<input 
								type="text" 
								className="amount" 
								value={item.amount} 
								onFocus={(e) => handleOnFocus(e, index, 'shortTermLiabilities')}
								onBlur={(e) => handleRemoveFocus(e, index, 'shortTermLiabilities')}
								onKeyDown={blockInvalidInput}
								onChange={(e) => onInputValueChange(e, index, 'shortTermLiabilities')} 
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
							<span className="dollarSign">{currencySymbol}</span>
							<input 
								type="text" 
								className="amount" 
								value={item.amount} 
								onFocus={(e) => handleOnFocus(e, index, 'longTermLiabilities')}
								onBlur={(e) => handleRemoveFocus(e, index, 'longTermLiabilities')}
								onKeyDown={blockInvalidInput}
								onChange={(e) => onInputValueChange(e, index, 'longTermLiabilities')}  
							/>
						</li>
					))}			
        </ul>
        <hr/>
        <div className="headerContainer">
            <span className="category">Total Liabilities</span>
            <span className="amount">{currencySymbol} {totalLiabilities}</span>
        </div>	
      </div>
    )
  }
} 
export default LiabilitiesTable;