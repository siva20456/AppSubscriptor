import { Component } from "react";
import {AiOutlineArrowRight} from 'react-icons/ai'

import '../../OverAll.css'


class Login extends Component{

    

    state = {currentState:'SignIn'}

    changeState = (newState) => {
        
        console.log(newState)
        this.setState({currentState:newState})
    }

    handleSubmit = e => {
        e.preventDefault()
    }


    renderSignIn = () => (
        <form className="form-cont" onSubmit={this.handleSubmit}>
            <div className="input-cont">
            <label htmlFor="username" className="form-label">USERNAME</label>
            <input type="text" id="username" className="form-input" placeholder="Username"  />
            </div>
            <div className="input-cont">
            <label htmlFor="password" className="form-label">PASSWORD</label>
            <input type="password" id='password' className="form-input" placeholder="Password"  />
            </div>
            <button className="submit-btn">Login</button>
        </form>
    )

    renderRegister = () => (
        <form className="form-cont" onSubmit={this.handleSubmit}>
            <div className="input-cont">
            <label htmlFor="username" className="form-label">USERNAME</label>
            <input type="text" id="username" className="form-input" placeholder="Username"  />
            </div>
            <div className="input-cont">
            <label htmlFor="mobile" className="form-label">Mobile Number</label>
            <input type="text" id="mobile" className="form-input" placeholder="Number"  />
            </div>
            <div className="input-cont">
            <label htmlFor="age" className="form-label">AGE</label>
            <input type="number" id="age" className="form-input" placeholder="Age"  />
            </div>
            <div className="input-cont">
            <label htmlFor="password" className="form-label">SET PASSWORD</label>
            <input type="password" id='password' className="form-input" placeholder="Password"  />
            </div>
            <button className="submit-btn">Register Now</button>
        </form>
    )

    renderContext = () => {
        const {currentState} = this.state
        switch (currentState) {
            case 'SignIn':
                return this.renderSignIn()
            case 'Register':
                return this.renderRegister()
        
            default:
                return null;
        }
    }


    render(){
        console.log('In Login Page')
        const {currentState} = this.state
        const signInColor = currentState === 'SignIn'? 'blue':'grey'
        const RegisterColor = currentState !== 'SignIn'? 'blue':'grey'
    
        return(
            <div className="mainCont">
                <div className="rowCont">
                    <button className="state-btn" onClick={() => this.changeState('SignIn')}><span  className="states" style={{color:signInColor,textDecoration:'none'}}>Sign In <AiOutlineArrowRight fontSize={10} /></span></button>
                    <button className="state-btn" onClick={() => this.changeState('Register')}><span  className="states" style={{color:RegisterColor,textDecoration:'none'}}>Register <AiOutlineArrowRight fontSize={10} /></span></button>

                </div>
                {this.renderContext()}
            </div>
        )
    }
}


export default Login