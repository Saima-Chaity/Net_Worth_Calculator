import React, { Component } from 'react';
import AssetsTable from './AssetsTable';
import LiabilitiesTable from './LiabilitiesTable';

class LandingPage extends Component{
	constructor(props) {
		super(props)
		this.state = {}
	}

  render(){
    return(
			<div>
				<span>Tracking your Networth</span>
				<AssetsTable />
				<hr/>
				<br/>
				<LiabilitiesTable />
			</div>
		)
  }
}

export default LandingPage;
