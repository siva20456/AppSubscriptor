import { Component } from "react";

import Cookies from "js-cookie";

import Header from "../Header";

import SideBar from "../SideBar";

import LowerBar from "../LowerBar";

class Contribute extends Component{

    constructor(props){
        super(props)
        console.log(props)
        this.state = {platform:'',amount:'',plan:'',expiry:'',devicesIncluded:'',devicesLookingFor:''}
    }

    platformHandler = (e) => {
        const {value} = e.target
        this.setState({platform:value})
    }

    planHandler = (e) => {
        const {value} = e.target
        this.setState({plan:value})
    }

    dateHandler = (e) => {
        const {value} = e.target
        this.setState({expiry:value})
    }

    devicesHandler = (e) => {
        const {value} = e.target
        this.setState({devicesIncluded:value})
    }

    devicesLookingForHandler = (e) => {
        const {value} = e.target
        this.setState({devicesLookingFor:value})
    }

    amountHandler = (e) => {
        const {value} = e.target
        this.setState({amount:value})
    }

    PORT = 3005

    addOffer = async(options) => {
        const url = `http://localhost:${this.PORT}/addOffer`
        const res = await fetch(url,options)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            alert(data.data)
            const {history} = this.props
            history.replace('/')
        }else{
            const data = await res.json()
            console.log(data)
            alert(data.data)
        }
    }
    

    handleSubmit = (e) => {
        e.preventDefault()
        const {amount,plan,expiry,devicesIncluded,devicesLookingFor,platform} = this.state
        let imgUrl = ''
        if(platform === 'Netflix'){
            imgUrl = 'https://img.icons8.com/3d-fluency/94/netflix-desktop-app.png'
        }else if(platform === 'Disney+'){
            imgUrl = 'https://img.icons8.com/nolan/64/disney-plus.png'
        }else if(platform === 'Amazon Prime'){
            imgUrl = "https://img.icons8.com/color/96/amazon-prime.png"
        }else if(platform === 'HBO'){
            imgUrl = 'https://img.icons8.com/nolan/64/hbo.png'
        }
        if((amount !== '') && (plan!=='') && (expiry!=='') && (devicesIncluded!=='') && (devicesLookingFor!=='') && (platform!=='')){
            const data = {amount,plan,expiry,devicesIncluded,devicesLookingFor,platform,imgUrl}
            const jwt_token = Cookies.get('jwt_token')
            const options = {
                method:'POST',
                body:JSON.stringify(data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization':`Bearer ${jwt_token}`
                  }
            }
            this.addOffer(options)
        }else{
            alert('Provide Valid Inputs')
        }
    }

    render(){
        console.log('Placing a new bid')
        const {amount,plan,expiry,devicesIncluded,devicesLookingFor} = this.state
        return(
            <div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='Contribute' />
                    <div className="contribute-cont">
                        <form className="adder-form" onSubmit={this.handleSubmit}>
                            <h1 className="heading">Contribution</h1>
                            <div style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'center',marginTop:30,flexWrap:'wrap'}}>
                            <div className="input-cont-contribute">
                                <label htmlFor="platform" className="form-label">Platform</label>
                                <select type="dropdown" id="platform" className="form-input contribute-input" placeholder="Select the Platform" onChange={this.platformHandler}  style={{height:30}} >
                                    <option selected value=''>Select the Platform</option>
                                    <option id='netflix' value='Netflix'>Netfilx</option>
                                    <option id='amazonPrime' value='Amazon Prime'>Amazon Prime</option>
                                    <option id='disney' value='Disney+'>Disney+</option>
                                    <option id='hbo' value='HBO'>HBO</option>
                                </select>
                            </div>
                            <div className="input-cont-contribute">
                                <label htmlFor="plan" className="form-label">Plan Type</label>
                                <input type="text" id="plan" className="form-input contribute-input" placeholder="Type of subscription"  onChange={this.planHandler} value={plan}  />
                            </div>
                            <div className="input-cont-contribute">
                                <label htmlFor="expiry" className="form-label">Expiry Date</label> 
                                <input type="date" id="expriy" className="form-input contribute-input" placeholder="Select the Platform" onChange={this.dateHandler} value={expiry}   />
                            </div>
                            <div className="input-cont-contribute">
                                <label htmlFor="devices" className="form-label">No of devices included till now</label>
                                <input type="number" id="devices" className="form-input contribute-input" placeholder="Number" onChange={this.devicesHandler} value={devicesIncluded}  />
                            </div> 
                            <div className="input-cont-contribute">
                                <label htmlFor="price" className="form-label">Amount Expecting per device</label>
                                <input type="text" id="price" className="form-input contribute-input" placeholder="Amount" onChange={this.amountHandler}  value={amount} />
                            </div>
                            <div className="input-cont-contribute">
                                <label htmlFor="looking" className="form-label">No of devices looking for</label>
                                <input type="number" id="looking" className="form-input contribute-input" placeholder="Number" onChange={this.devicesLookingForHandler}  value={devicesLookingFor} />
                            </div>
                            </div>
                            <button type="submit" className="add-btn" style={{alignSelf:'flex-end'}}>Add</button>
                        </form>
                    </div>
                </div>
                <LowerBar current='Contribute' />
            </div>
        )
    }

}

export default Contribute
