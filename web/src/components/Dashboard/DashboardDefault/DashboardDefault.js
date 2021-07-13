import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import DashboardMenu from '../DashboardMenu/DashboardMenu';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';

import './DashboardDefault.css';

class DashboardDefault extends Component{
	constructor(props){
		super(props);
		this.state = {
			'userId' : this.props.userId !== undefined ? this.props.userId : null,
			'userLevel' : this.props.userLevel !== undefined ? this.props.userLevel : null
		};
	}

	componentDidMount(){}
	
	render(){
		return(
			<React.Fragment>
				<DashboardMenu userId={this.state.userId} userLevel={this.state.userLevel}/>

				{/* /section */}
				<section className="lottery-DashboardDefault">
					
					{/* /container */}
					<div className="container">
						{/* /row */}
						<div className="row">

							{/* /col */}
							<div className="col-md-12">
								<div className="container lottery-bg-color-white">
								
								</div>
							</div>{/* ./col */}

						</div>{/* ./row */}

					</div>{/* ./container */}

				</section>{/* ./section */}
			</React.Fragment>
		);
	}
}

export default DashboardDefault;