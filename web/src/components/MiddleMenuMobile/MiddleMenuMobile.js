import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import './MiddleMenuMobile.css';
import logo from './images/logo.png';

class MiddleMenuMobile extends Component {
	constructor(){
		super();
		this.state = {};
	}

	render(){
		return(
			<React.Fragment>
				{/* <!-- /section --> */}
		        <section className="lottery-MiddleMenuMobile">
		            {/* <!-- /container --> */}
		            <div className="container">
		                {/* <!-- /row --> */}
		                <div className="row">
		                    <div className="col-8">
		                        <img src={logo} alt=""/>
		                    </div>

		                    <div className="col-4 text-right">
		                        <button id="primaryMenuMobile"><i className="fas fa-bars"></i></button>
		                    </div>
		                </div>{/* <!-- ./row --> */}
		            </div>{/* <!-- ./container --> */}

		            <div className="lottery-MiddleMenuMobile-dropdown">
		                {/* <!-- /container --> */}
		                <div className="container">
		                    {/* <!-- /row --> */}
		                    <div className="row">
		                        <div className="col-md-12">
		                            <ul>
		                                <li><Link to="#">Início</Link></li>
		                                <li><Link to="#">Resultados</Link></li>
		                                <li><Link to="#">Loterias</Link></li>
		                                <li><Link to="#">Dúvidas</Link></li>
		                                <li><Link to="#">Contato</Link></li>
		                                <li><Link to="#">Junte-se a nós</Link></li>
		                            </ul>
		                        </div>
		                    </div>{/* <!-- ./row --> */}
		                </div>{/* <!-- ./container --> */}
		            </div>
		        </section>{/* <!-- ./section --> */}
			</React.Fragment>
		);
	}
}

export default MiddleMenuMobile;