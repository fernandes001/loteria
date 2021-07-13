import React, { Component } from 'react';

import './Alert.css';

class Alert extends Component{
	constructor(props){
		super(props);
		this.alert = React.createRef();
	}

	componentDidMount(){
		setTimeout(() => {
			if(this.alert.current !== null){
				this.alert.current.click();
			}
		}, 3000);
	}

	render(){
		let alertClass = 'alert alert-'+this.props.type+' alert-dismissible fade show';

		return(
			<div className="lottery-Alert">
				<div className={alertClass} role="alert">
					{this.props.msg}
					<button type="button" className="close" data-dismiss="alert" ref={this.alert} aria-label="Close">
						<span aria-hidden="false">&times;</span>
					</button>
				</div>
			</div>
		);
	}
}

export default Alert;