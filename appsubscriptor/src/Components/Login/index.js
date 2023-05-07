import { Component } from "react";


import Cookies from 'js-cookie'


// import initJWTService from 'jwt-service';

import {AiOutlineArrowRight} from 'react-icons/ai'


import '../../OverAll.css'


class Login extends Component{

    constructor(props){
        super(props)
        console.log('Please SignIn / SignUp',props)
    }
    

    state = {currentState:'SignIn',username:'',password:'',RegistrationDetails:{user:'',password:'',age:'',mobile:''}}

   


    // componentDidMount = () => {
    //     this.getData()
    // }

    changeState = (newState) => {
        
        console.log(newState)
        this.setState({currentState:newState})
    }

    handleSubmit = e => {
        e.preventDefault()
    }

    handlePassword = e => {
        const {value} = e.target
        this.setState({password:value})
    }

    handleUsername = e => {
        const {value} = e.target
        this.setState({username:value})
    }

    handleSignIn = async(e) => {
        e.preventDefault()
        const {username,password,currentState} = this.state
        console.log(username,password,currentState)
        const options = {
            method:'POST',
            body:JSON.stringify({user:username,password:password}),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        }
        const res = await fetch(`http://localhost:3005/login/`,options)
        console.log(res)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            Cookies.set('jwt_token',data.jwt_token,{expires:30})
            const {history} = this.props
            history.replace('/')
        }else{
            console.log('User Not Found')
        }
    }

    handleRegAge = e => {
        const {value} = e.target
        const {RegistrationDetails} = this.state
        this.setState({RegistrationDetails:{...RegistrationDetails,age:value}})
    }

    handleRegMobile = e => {
        const {value} = e.target
        const {RegistrationDetails} = this.state
        this.setState({RegistrationDetails:{...RegistrationDetails,mobile:value}})
    }

    handleRegPass = e => {
        const {value} = e.target
        const {RegistrationDetails} = this.state
        this.setState({RegistrationDetails:{...RegistrationDetails,password:value}})
    }

    handleRegUser = e => {
        const {value} = e.target
        const {RegistrationDetails} = this.state
        this.setState({RegistrationDetails:{...RegistrationDetails,user:value}})
    }

    handleRegSubmit = async(e) => {
        e.preventDefault()
        const {RegistrationDetails} = this.state
        console.log(RegistrationDetails)
        const options = {
            method: "POST",
            body: JSON.stringify({...RegistrationDetails}),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
            
        }
        const res = await fetch(`http://localhost:3005/register/`,options)
        console.log(res)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            Cookies.set('jwt_token',data.jwt_token,{expires:30})
            const {history} = this.props
            history.replace('/')
        }else{
            const data = await res.json()
            console.log(data)
        }
    }



    renderSignIn = () => (
        <form className="form-cont" onSubmit={this.handleSignIn}>
            <div className="input-cont">
            <label htmlFor="username" className="form-label">USERNAME</label>
            <input type="text" id="username" className="form-input" placeholder="Username" value={this.state.username} onChange={this.handleUsername}  />
            </div>
            <div className="input-cont">
            <label htmlFor="password" className="form-label">PASSWORD</label>
            <input type="password" id='password' className="form-input" placeholder="Password" value={this.state.password} onChange={this.handlePassword}  />
            </div>
            <button className="submit-btn">Login</button>
        </form>
    )

    renderRegister = () => (
        <form className="form-cont" onSubmit={this.handleRegSubmit} >
            <div className="input-cont">
            <label htmlFor="username" className="form-label">USERNAME</label>
            <input type="text" id="username" className="form-input" placeholder="Username" onChange={this.handleRegUser}  />
            </div>
            <div className="input-cont">
            <label htmlFor="mobile" className="form-label">Mobile Number</label>
            <input type="text" id="mobile" className="form-input" placeholder="Number" onChange={this.handleRegMobile}  />
            </div>
            <div className="input-cont">
            <label htmlFor="age" className="form-label">AGE</label>
            <input type="number" id="age" className="form-input" placeholder="Age" onChange={this.handleRegAge}  />
            </div>
            <div className="input-cont">
            <label htmlFor="password" className="form-label">SET PASSWORD</label>
            <input type="password" id='password' className="form-input" placeholder="Password" onChange={this.handleRegPass}  />
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
        const jwt_token = Cookies.get('jwt_token')
        if(jwt_token !== undefined){
            const {history} = this.props
            history.replace('/')
        }
    
        return(
            <div className="mainCont">
                <img src="https://img.icons8.com/dotty/80/null/logo.png" alt='Brand Logo' className="logo" />

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