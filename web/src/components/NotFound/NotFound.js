import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import BreadCrumbs from '../BreadCrumbs/BreadCrumbs';

import './NotFound.css';
import notfoundimage from './images/404.png';

class NotFound extends Component{
	constructor(){
		super();
		this.state = {};
	}

	render(){
		return(
			<React.Fragment>
				<BreadCrumbs titulo="404"/>

				{/* <!-- /section --> */}
				<section className="lottery-NotFound" home="/">
					{/* <!-- /container --> */}
					<div className="container">
			            {/* <!-- /row --> */}
			            <div className="row">
			                <div className="col-md-12">
			                    <div className="col-md-12 text-center">
			                        <img className="img-fluid" src={notfoundimage} alt=""/>
			                    </div>

			                    <div className="col-md-12 text-center mt-4">
			                        <h4>Oops... Página não encontrada!</h4>
			                    </div>

			                    <div className="col-md-12 text-center mt-4">
			                        <Link to="#" className="lottery-bt-rounded lottery-bg-blue">Voltar</Link>
			                    </div>
			                </div>
			            </div>{/* <!-- ./row --> */}
			        </div>{/* <!-- ./container --> */}
		        </section>{/* <!-- ./section --> */}
			</React.Fragment>
		);
	}
}

export default NotFound;