import { Component} from "react";

import Header from "../Header";

import SideBar from "../SideBar";

import Popup from "reactjs-popup";

import {Triangle} from 'react-loader-spinner'

import {RiAddFill} from 'react-icons/ri'

import Cookies from "js-cookie";


class Payments extends Component{

    constructor(props){
        super(props)
        this.state = {pending:[1,2,3,4,5,6,7,8],raised:[1,2,3,4,5],pendingStatus:'Loading',raisedStatus:'Loading',platform:'',amount:'',count:'',plan:'',username:''}
    }

    componentDidMount(){
        this.getData()
    }

    getData = async() => {
        this.setState({pendingStatus:'Loading',raisedStatus:'Loading'})
        const jwt = Cookies.get('jwt_token')
        const options = {
            method:'GET',
            headers:{
                "Content-type": "application/json; charset=UTF-8",
                'Authorization':`Bearer ${jwt}`
            }
        }

        const url = `http://localhost:${this.PORT}/payments`
        const res = await fetch(url,options)
        if(res.status === 200){
            const data = await res.json()
            // console.log(data)
            this.setState({pending:data.pending,raised:data.raised,pendingStatus:'Success',raisedStatus:'Success'})
        }else{
            this.setState({pendingStatus:'Empty',raisedStatus:'Empty'})
        }
    }

    userHandler = (e) => {
        this.setState({username:e.target.value})
    }

    planHandler = (e) => {
        const {value} = e.target
        let plan = ''
        if(value === 'Day Wise'){
            plan = 'Day'
        }else if(value === 'Monthly'){
            plan = 'Month'
        }else{
            plan = 'Year'
        }
        this.setState({plan})
    }

    amountHandler = (e) => {
        const {value} = e.target
        this.setState({amount:parseInt(value)})
    }

    platformHandler =  (e) => {
        this.setState({platform:e.target.value})
    }

    numberHandler = e => {
        this.setState({count:parseInt(e.target.value)})
    }    

    PORT =  3005

    raisePayment = async(close) => {
        const {username,platform,plan,amount,count} = this.state
        if(username !== '' || platform !== '' || plan !== "" || amount !== '' || count !== ''){

            //checking for user

            const res = await fetch(`http://localhost:${this.PORT}/checkUser/${username}`)
            if(res.status === 200){
                const data = {
                    username,
                    plan,
                    platform,
                    amount,
                    count,
                    raisedUser:Cookies.get('user')
                }
                const options = {
                    method:'POST',
                    body: JSON.stringify(data),
                    headers: {
                    "Content-type": "application/json; charset=UTF-8"
                    }
                }
                const resRaise = await fetch(`http://localhost:${this.PORT}/raisePayment`,options)
                const responseData = await resRaise.json()
                alert(responseData.data)
                close()
            }else{
                alert('Requesting User Not Found')
            }

        }else{
            alert('Enter Valid Inputs')
        }
    }

    renderPendingPays = () => {
        const {pending} = this.state
        return(
            <div className="pending-pays-cont">
                {pending.map(e => 
                    <div key={e._id} className="pending-cont">
                        <h1 className="requested-user">{e.owner}</h1>
                        <p className="pending-card-text">Platform : <span className="pending-card-value">{e.platform}</span></p>
                        <p className="pending-card-text">Plan Type : <span className="pending-card-value">{e.time}</span></p>
                        <p className="pending-card-text">Amount : <span className="pending-card-value">{`${e.amount} (${e.count} X ${parseInt(e.amount/e.count)})`}</span></p>
                        <button className="pay-btn">Pay</button>
                    </div>
                )}
            </div>
        )
    }

    renderRaisedPays = () => {
        const {raised} = this.state
        return(
            <div className="pending-pays-cont">
                {raised.map(e => 
                    <div key={e._id} className="pending-cont">
                        <p className="pending-card-text">User : <span className="pending-card-value">{e.customer}</span></p>
                        <p className="pending-card-text">Amount : <span className="pending-card-value">{e.amount}</span></p>
                        <p className="pending-card-text">Platform : <span className="pending-card-value">{e.platform}</span></p>
                        <p className="pending-card-text">Plan Type : <span className="pending-card-value">{e.time}</span></p>
                        <p className="pending-card-text">Status : <span className="pending-card-value" style={{color:`${e.status === 'Requested'?'red':'green'}`}}>{e.status}</span></p>
                        <button className="pay-btn">Delete</button>
                    </div>
                )}
            </div>
        )
    }

    renderLoading = () => (
        <div style={{alignSelf:'center'}}>
            <Triangle  color=" #3b82f6" height="50" width="50" />
        </div>
    )

    renderEmpty = () => (
        <div style={{alignSelf:'center',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <iframe src="https://embed.lottiefiles.com/animation/106964" style={{border:'none',outline:'none'}}></iframe>
            <p>No Payments Found..!</p>
        </div>
    )

    renderPays = () => {
        const {pendingStatus,pending} = this.state
        switch (pendingStatus) {
            case 'Success':
                if(pending.length === 0){
                    return this.renderEmpty()
                }
                return this.renderPendingPays()
            case 'Loading':
                return this.renderLoading()
            case 'Empty':
                return this.renderEmpty()
        }
    }

    renderRaise = () => {
        const {raisedStatus,raised} = this.state
        switch (raisedStatus) {
            case 'Success':
                if(raised.length === 0){
                    return this.renderEmpty()
                }
                return this.renderRaisedPays()
            case 'Loading':
                return this.renderLoading()
            case 'Empty':
                return this.renderEmpty()
        }
    }


    render(){
        const {username,platform,plan,amount,count} = this.state
        return(
            <div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='Payments' />
                    <div className="payment-cont">
                        
                        <Popup
                            modal
                            trigger={
                                <button className="raise-pay-btn"><RiAddFill style={{fontSize:15,fontWeight:'bold',marginRight:5}} /> Raise Payment</button>
                            }
                        >
                            {close => (
                            <>
                                <div className='popupCont'>
                                <div style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'center',marginTop:30,flexWrap:'wrap'}}>
                                    <div className="input-cont-contribute">
                                        <label htmlFor="user" className="form-label">Requesting to</label>
                                        <input type="text" id="user" className="form-input contribute-input" placeholder="UserName"  onChange={this.userHandler} value={username}  />
                                    </div>
                                    <div className="input-cont-contribute">
                                        <label htmlFor="platform" className="form-label">Platform Providing</label>
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
                                        <select type="dropdown" id="plan" className="form-input contribute-input" placeholder="Select the Platform" onChange={this.planHandler}  style={{height:30}} >
                                            <option selected value=''>Select the Plan</option>
                                            <option id='DayWise' value='Day Wise'>Day Wise</option>
                                            <option id='Monthly' value='Monthly'>Monthly</option>
                                            <option id='Yearly' value='Yearly+'>Yearly</option>
                                        </select>
                                    </div>
                                    <div className="input-cont-contribute">
                                        <label htmlFor="amount" className="form-label">Amount Per {plan}</label>
                                        <input type="text" id="amount" className="form-input contribute-input" placeholder="Amount" onChange={this.amountHandler} value={amount}  />
                                    </div> 
                                    <div className="input-cont-contribute">
                                        <label htmlFor="number" className="form-label">No of {plan}</label> 
                                        <input type="number" id="number" className="form-input contribute-input" placeholder={`x * amount per ${plan}`} onChange={this.numberHandler} value={count}   />
                                    </div>
                                    
                                    
                                </div>
                                
                                <p className='app-desc'>You're trying to raise a payment to {username} regarding {platform} offer of an amount {count*amount}..!</p>
                                
                                <div>
                                <button
                                type="button"
                                className="trigger-button"
                                style={{cursor:'pointer'}}
                                onClick={() => close()}
                                >
                                Close
                                </button>
                                <button
                                type="button"
                                className="trigger-button"
                                style={{cursor:'pointer'}}
                                onClick={() => this.raisePayment(close)}
                                >
                                Raise 
                                </button>
                                </div>
                                </div>
                            </>
                            )}
                        </Popup>
                        <h1 className="heading">Pending Bills</h1>
                        {this.renderPays()}
                        <h1 className="heading">Raised Bills</h1>
                        {this.renderRaise()}
                    </div>
                </div>
            </div>
        )
    }
}

export default Payments