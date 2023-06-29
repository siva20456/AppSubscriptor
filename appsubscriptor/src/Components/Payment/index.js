import { Component} from "react";

import Header from "../Header";

import SideBar from "../SideBar";

import Popup from "reactjs-popup";

import LowerBar from "../LowerBar";

import {Triangle} from 'react-loader-spinner'

import {RiAddFill} from 'react-icons/ri'

// import {} from 'razorpay'
import Cookies from "js-cookie";


class Payments extends Component{

    constructor(props){
        super(props)
        this.state = {pending:[],raised:[],completed:[],pendingStatus:'Loading',raisedStatus:'Loading',platform:'',amount:'',count:'',plan:'',username:''}
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
            console.log(data)
            this.setState({pending:data.pending,raised:data.raised,pendingStatus:'Success',raisedStatus:'Success',completed:data.completed})
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

    deletePayment = async(id) => {
        const url = `http://localhost:${this.PORT}/delPayment`
        const options = {
            method:'DELETE',
            headers:{
                "Content-type": "application/json; charset=UTF-8",
            },
            body:JSON.stringify({id})
        }
        const deleteRes = await fetch(url,options)
        const data = await deleteRes.json()
        alert(data.data)
        this.getData()
    }

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

                const notificationData = {
                    platform:platform,
                    raised_for:username,
                    raised_by:Cookies.get('user'),
                    description:`Hey ${username}, you got a payment request from ${Cookies.get('user')} for ${platform} offer. Please complete the payment to avail the subscription. `,
                    type:'Payment'
                }

                const notificationOptions = {
                    method:'POST',
                    headers:{
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    body:JSON.stringify(notificationData),
                }

                const resRaise = await fetch(`http://localhost:${this.PORT}/raisePayment`,options)
                const responseData = await resRaise.json()
                if(resRaise.status === 200){
                    const note = await fetch(`http://localhost:${this.PORT}/addPaymentNotification`,notificationOptions)
                }
                alert(responseData.data)
                close()
                this.getData()
            }else{
                alert('Requesting User Not Found')
            }

        }else{
            alert('Enter Valid Inputs')
        }
    }

    pay = async(payment,getData) => {
        const keyRes = await fetch(`http://localhost:${this.PORT}/getRazorAPI`)
        const keyData = await keyRes.json()
        // console.log(keyData,payment)

        var options = {
            "key": keyData.api, // Enter the Key ID generated from the Dashboard
            "amount": payment.amount*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "ORENT Services",
            "description": "Rent Transaction",
            "image": "https://img.icons8.com/dotty/80/null/logo.png",
            "order_id": payment.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function (response){
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)
                const postOpt = {
                    method:'POST',
                    body: JSON.stringify({order_id:payment.order_id,razorpay_payment_id:response.razorpay_payment_id,razorpay_order_id:response.razorpay_order_id,razorpay_signature:response.razorpay_signature}),
                    headers: {
                    "Content-type": "application/json; charset=UTF-8"
                    }
                }
                const res = await fetch(`http://localhost:3005/paymentVerification`,postOpt)
                if(res.status === 200){
                    alert('Payment Success')
                    getData()
                }else{
                    alert('Payment Failed')
                }
            },
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9000090000"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        const rzrpay = new window.Razorpay(options)
        rzrpay.open()
        rzrpay.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
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
                        <p className="pending-card-text">A Tax of 10% is included</p>
                        <button onClick={() => this.pay(e,this.getData)} className="pay-btn">Pay</button>
                    </div>
                )}
            </div>
        )
    }

    renderCompletedPays = () => {
        const {completed} = this.state
        return(
            <div className="pending-pays-cont">
                {completed.map(e => 
                    <div key={e._id} className="pending-cont">
                        <h1 className="requested-user">{e.owner}</h1>
                        <p className="pending-card-text">Platform : <span className="pending-card-value">{e.platform}</span></p>
                        <p className="pending-card-text">Plan Type : <span className="pending-card-value">{e.time}</span></p>
                        <p className="pending-card-text">Amount : <span className="pending-card-value">{`${e.amount}`}</span></p>
                        <p className="pending-card-text">Payment Id : <span className="pending-card-value">{e.payment_id}</span></p>
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
                        {e.status === 'Successful'&&<p className="pending-card-text">Payment Id : <span className="pending-card-value">{e.payment_id}</span></p>}
                        <button onClick={() => this.deletePayment(e._id)} className="pay-btn">Delete</button>
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

    renderCompleted = () => {
        const {pendingStatus,completed} = this.state
        switch (pendingStatus) {
            case 'Success':
                if(completed.length === 0){
                    return this.renderEmpty()
                }
                return this.renderCompletedPays()
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
                        <h1 className="heading">Completed Bills</h1>
                        {this.renderCompleted()}
                    </div>
                </div>
                <LowerBar current='Payments' />

            </div>
        )
    }
}

export default Payments