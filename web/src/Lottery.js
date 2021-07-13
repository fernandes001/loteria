import React, { Component } from 'react';

import { BrowserRouter, Route } from 'react-router-dom';

import TopMenu from './components/TopMenu/TopMenu';
import MiddleMenuDesktop from './components/MiddleMenuDesktop/MiddleMenuDesktop';
import MiddleMenuMobile from './components/MiddleMenuMobile/MiddleMenuMobile';
import Footer from './components/Footer/Footer';

import Home from './components/Home/Home';
import Lotteries from './components/Lotteries/Lotteries';
import Contact from './components/Contact/Contact';
import Results from './components/Results/Results';
import NotFound from './components/NotFound/NotFound';
import AccountCreate from './components/Account/AccountCreate/AccountCreate';
import AccountLogin from './components/Account/AccountLogin/AccountLogin';
import AccountForgot from './components/Account/AccountForgot/AccountForgot';
import Dashboard from './components/Dashboard/Dashboard/Dashboard';

import {LanguageContext, languages} from './locales/context';

import './Lottery.css';


class Lottery extends Component {
    constructor(props){
        super(props);
        let lang = localStorage.getItem('language_selected') !== null ? localStorage.getItem('language_selected') : 'PT';
        this.state = {
            language: languages[lang],
        };
    }

    componentDidMount(){
    }

    componentDidUpdate(){
        
    }

    changeLanguage = (language) => {
        this.setState({
            language: languages[language],  
        });
    }

    render() {
        return (
           
            <BrowserRouter>

                <div className="lottery">
                    <LanguageContext.Provider value={this.state.language}>      
                        
                        <TopMenu back={(language) => {this.changeLanguage(language)}}/>
                        
                    	<MiddleMenuDesktop />
                        
                        <MiddleMenuMobile />
                        
                        <Route path='/' exact component={Home} />
                        <Route path='/404' component={NotFound} />
                        <Route path='/contact' component={Contact} />
                        <Route path='/results' component={Results} />
                        <Route path='/lotteries' component={Lotteries} />

                        <Route path='/account/create' component={AccountCreate} />
                        <Route path='/account/login' component={AccountLogin} />
                        <Route path='/account/forgotpassword' component={AccountForgot} />
                        
                        <Route path={'/dashboard/:page?/:action?/:id?'} component={Dashboard}/> 
                        
                        <Footer />
                    </LanguageContext.Provider>
                </div>
               
            </BrowserRouter>
           
        );
    }
}

export default Lottery;
