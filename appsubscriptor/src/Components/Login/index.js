import { Component } from "react";


import Cookies from 'js-cookie'



// import initJWTService from 'jwt-service';

import {AiOutlineArrowRight} from 'react-icons/ai'

import {TiTick} from 'react-icons/ti'


import '../../OverAll.css'


class Login extends Component{


    PORT = 'LOCAL_PORT'

    constructor(props){
        super(props)
        console.log('Please SignIn / SignUp',props)
    }
    

    state = {currentState:'SignIn',username:'',password:'',otp:'',inputOTP:'',vermail:'',newPass:'',cnfNewPass:'',RegistrationDetails:{user:'',password:'',age:'',mobile:'',mail:'',isMailVerified:false,showVerifyingEles:'none'}}

   


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

    requestSignIn = async() => {
        const {username,password,currentState} = this.state
        console.log(username,password,currentState)
        const options = {
            method:'POST',
            body:JSON.stringify({user:username,password:password}),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        }
        const res = await fetch(`http://localhost:${this.PORT}/login/`,options)
        console.log(res)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            Cookies.set('jwt_token',data.jwt_token,{expires:30})
            Cookies.set('user',username,{expires:30})
            const {history} = this.props
            history.replace('/')
        }else{
            console.log('User Not Found')
            const data = await res.json()
            alert(data.data)
        }
    }

    handleSignIn = (e) => {
        e.preventDefault()
        const {username,password} = this.state
        if(username === "" | password === ""){
            alert('Please give valid inputs')
        }else{

            this.requestSignIn()
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

    handleRegMail = e => {
        const {value} = e.target
        const {RegistrationDetails} = this.state
        this.setState({RegistrationDetails:{...RegistrationDetails,mail:value}})
    }

    handleOTP = e => {
        const {value} = e.target
        this.setState({inputOTP:value})
    }

    verifyOtp = () => {
        const {otp,inputOTP,RegistrationDetails} = this.state
        if(otp === parseInt(inputOTP)){
            console.log('OK')
            this.setState({RegistrationDetails:{...RegistrationDetails,isMailVerified:true}})
        }else{
            alert('Invalid OTP, try again by sending it.')
        }
    }

    verifyPassChangeOTP = (e) => {
        e.preventDefault()
        const {otp,inputOTP} = this.state
        if(otp === parseInt(inputOTP)){
            console.log('OK')
            this.setState({currentState:'ChangePass'})
        }else{
            alert('Invalid OTP, try again by sending it.')
        }
    }

    changePassword = async(e) => {
        e.preventDefault()
        const {username,newPass,cnfNewPass} = this.state

        const data = {
            user:username,
            password:cnfNewPass
        }

        const options = {
            method:'POST',
            headers:{
                "Content-type": "application/json; charset=UTF-8"
              },
              body:JSON.stringify(data)
        }

        if(newPass === cnfNewPass){
            const res = await fetch(`http://localhost:${this.PORT}/changePassword`,options)
            if(res.status === 200){
                const {history} = this.props
                alert('Successfully Changed Password')
                this.setState({currentState:'SignIn'})
                history.replace('/login')
            }else{
                alert('Someting Went Wrong...')
            }
        }else{
            alert('Given different passwords')
        }
    }

    forgetPassword = (e) => {
        e.preventDefault()
        this.setState({currentState:'VerifyMail'})
    }

    sendMailOtp = async() => {
        const {RegistrationDetails} = this.state
        const url = `http://localhost:${this.PORT}/verifyMail`
        const data = {mail:RegistrationDetails.mail}
        const options = {
            method:'POST',
            headers:{
              "Content-type": "application/json; charset=UTF-8"
            },
            body:JSON.stringify(data)
        }
        const res = await fetch(url,options)
        // console.log(res)
        if(res.ok){
            const data = await res.json()
            // console.log(data)
            this.setState({RegistrationDetails:{...RegistrationDetails,showVerifyingEles:'flex'},otp:parseInt(data.otp)})
        }
    }

    sendPassChangeMail = async(e) => {
        e.preventDefault()
        const url = `http://localhost:${this.PORT}/verifyMail`
        const data = {mail:this.state.vermail}
        const options = {
            method:'POST',
            headers:{
              "Content-type": "application/json; charset=UTF-8"
            },
            body:JSON.stringify(data)
        }
        const res = await fetch(url,options)
        // console.log(res)
        if(res.ok){
            const data = await res.json()
            // console.log(data)
            this.setState({otp:parseInt(data.otp)})
        }
    }
 
    requestRegister = async() => {
        const {RegistrationDetails} = this.state
        console.log(RegistrationDetails)
        const options = {
            method: "POST",
            body: JSON.stringify({...RegistrationDetails}),
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
            
        }
        const res = await fetch(`http://localhost:${this.PORT}/register/`,options)
        console.log(res)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            Cookies.set('jwt_token',data.jwt_token,{expires:30})
            Cookies.set('user',RegistrationDetails.user,{expires:30})
            const {history} = this.props
            history.replace('/')
        }else{
            const data = await res.json()
            console.log(data)
            alert(data.error)
        }
    }

    handleRegSubmit = async(e) => {
        e.preventDefault()
        const {RegistrationDetails} = this.state
        if(RegistrationDetails.mobile === "" | RegistrationDetails.user==="" | RegistrationDetails.password==="" | RegistrationDetails.mail===""){
            alert("Please provide valid inputs")
        }
        else if(RegistrationDetails.isMailVerified===false){
            alert('Please Verify the mail')
        }
        else{
            this.requestRegister()
        }
    }


    renderForgetPass = () => (
        <form className="form-cont">
            <div className="input-cont">
            <label htmlFor="vermail" className="form-label">Email</label>
            <input type="text" id="vermail" className="form-input" placeholder="Email" value={this.state.vermail} onChange={(e) => this.setState({vermail:e.target.value})}  />
            <button onClick={this.sendPassChangeMail} style={{width:'fit-content'}}>send OTP</button>
            </div>
            <div className="input-cont">
            <label htmlFor="verotp" className="form-label">OTP</label>
            <input type="text" id='verotp' className="form-input" onChange={this.handleOTP}  />
            <button onClick={this.verifyPassChangeOTP} style={{width:'fit-content'}}>Verify</button>
            </div>
        </form>
    )

    renderSetNewPass = () => (
        <form className="form-cont">
            <div className="input-cont">
            <label htmlFor="username" className="form-label">USERNAME</label>
            <input type="text" id="username" className="form-input" placeholder="Username" value={this.state.username} onChange={this.handleUsername}  />
            </div>
            <div className="input-cont">
            <label htmlFor="newpass" className="form-label">New Password</label>
            <input type="text" id="newpass" className="form-input" value={this.state.newPass} onChange={(e) => this.setState({newPass:e.target.value})}  />
            </div>
            <div className="input-cont">
            <label htmlFor="cnfpass" className="form-label">Confirm New Password</label>
            <input type="text" id='cnfpass' className="form-input" value={this.state.cnfNewPass} onChange={(e) => this.setState({cnfNewPass:e.target.value})}  />
            </div>
            <button onClick={this.changePassword} className="submit-btn">Change Password</button>
        </form> 
    )

    renderSignIn = () => (
        <form className="form-cont" onSubmit={this.handleSignIn}>
            <div className="input-cont">
            <label htmlFor="username" className="form-label">USERNAME</label>
            <input type="text" id="username" className="form-input" placeholder="Username" value={this.state.username} onChange={this.handleUsername}  />
            </div>
            <div className="input-cont">
            <label htmlFor="password" className="form-label">PASSWORD</label>
            <input type="password" id='password' className="form-input" placeholder="Password" value={this.state.password} onChange={this.handlePassword}  />
            <button type='button' onClick={this.forgetPassword} className="forget-pass-btn">forget password</button>
            </div>
            <button type="submit" className="submit-btn">Login</button>
        </form>
    )

    renderRegister = () => (
        <form className="form-cont" onSubmit={this.handleRegSubmit} >
            <div className="input-cont">
            <label htmlFor="username" className="form-label">USERNAME <span style={{color:'red'}}>*</span></label>
            <input type="text" id="username" className="form-input" placeholder="Username" onChange={this.handleRegUser}  />
            </div>
            <div className="input-cont">
            <label htmlFor="mobile" className="form-label">Mobile Number <span style={{color:'red'}}>*</span></label>
            <input type="text" id="mobile" className="form-input" placeholder="Number" onChange={this.handleRegMobile}  />
            </div>
            <div className="input-cont">
            <label htmlFor="email" className="form-label">E-Mail <span style={{color:'red'}}>*</span>{this.state.RegistrationDetails.isMailVerified?<TiTick style={{color:"green",fontSize:20,border:'solid 1px green',borderRadius:10,marginLeft:5}} />:''}</label>
            <input type="text" id="email" className="form-input" placeholder="e-mail" onChange={this.handleRegMail}  />
            <br/>
            <button type="button" style={{alignSelf:"flex-start",cursor:"pointer"}} onClick={this.sendMailOtp}>Send OTP</button>
            <br/>
            <div style={{display:"flex"}}>
            <input type="text" placeholder="Enter otp" onChange={this.handleOTP} style={{display:this.state.RegistrationDetails.showVerifyingEles}} className="form-label" />{this.state.RegistrationDetails.isMailVerified?<TiTick style={{color:"green",fontSize:20,border:'solid 1px green',borderRadius:10,marginLeft:5}} />:''}
            </div>
            <button type='button'  onClick={this.verifyOtp} style={{display:this.state.RegistrationDetails.showVerifyingEles,alignSelf:'flex-start',cursor:"pointer"}} >Verify</button>
            </div>
            <div className="input-cont">
            <label htmlFor="age" className="form-label">AGE</label>
            <input type="number" id="age" className="form-input" placeholder="Age" onChange={this.handleRegAge}  />
            </div>
            <div className="input-cont">
            <label htmlFor="password" className="form-label">SET PASSWORD <span style={{color:'red'}}>*</span></label>
            <input type="password" id='password' className="form-input" placeholder="Password" onChange={this.handleRegPass}  />
            </div>
            <button type="submit" className="submit-btn">Register Now</button>
        </form>
    )

    renderContext = () => {
        const {currentState} = this.state
        switch (currentState) {
            case 'SignIn':
                return this.renderSignIn()
            case 'Register':
                return this.renderRegister()
            case 'VerifyMail':
                return this.renderForgetPass()
            case 'ChangePass':
                console.log(currentState)
                return this.renderSetNewPass()
        
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