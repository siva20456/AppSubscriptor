import { Component } from "react";

import Header from "../Header";

import SideBar from "../SideBar";

import LowerBar from "../LowerBar";

import {RxCross2} from 'react-icons/rx'

import '../../OverAll.css'
import Cookies from "js-cookie";


class Notifications extends Component{

    constructor(props){
        super(props)
        console.log(props)
    }

    state = {data:[],current:'Loading'}

    componentDidMount(){
        this.getData()
    }

    PORT  = 3005

    getData = async() => {
        const {history} = this.props
        const jwt_token = Cookies.get('jwt_token')
        const options = {
            method:'GET',
            headers:{
                "Content-type": "application/json; charset=UTF-8",
                'Authorization':`Bearer ${jwt_token}`
            }
        }
        const res = await fetch(`https://orent.onrender.com/notifications`,options)
        const data = await res.json()
        console.log(data)
        if(data.length === 0){
            this.setState({current:'empty'})
        }else{
            this.setState({data,current:'Succ'},history.replace('/notifications'))
        }
    }

    deleteNote = async(note) => {
        const {history} = this.props
        const options = {
            method:'DELETE',
            headers:{
                "Content-type": "application/json; charset=UTF-8",
            },
            body:JSON.stringify({id:note._id})
        }
        const res = await fetch(`https://orent.onrender.com/removeNote`,options)
        if(res.status === 200){
            console.log(res)
            this.getData()
        }
        const {data} = this.state
        if(data.length === 0){
            history.replace('/')
        }
    }

    handleChat = () => {
        const {history} = this.props
        history.replace('/userChat')
    }

    handlePayment = () => {
        const {history} = this.props
        history.replace('/payments')
    }


    render(){

        const {data,current} = this.state

        return(
            <div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='Notifies' />
                    <div className="notify-cont">
                        <h1 className="heading">Notifications</h1>
                        {current === 'Succ'?<ul className="list-note-container">
                            {data.map((e,i) => <li className="note-tab" key = {i}>
                                <h1 className="note-desc">{e.description}</h1>
                                {e.type==='Connection'?<button type="button" onClick={this.handleChat} className="chat-btn">Chat</button>:<button type="button" onClick={this.handlePayment} className="chat-btn">{e.type==='Payment'?'Pay':'Raise'}</button>}
                                <button style={{border:'none',outline:'none',cursor:'pointer',backgroundColor:'transparent',alignSelf:'flex-start'}} onClick={() => this.deleteNote(e)}><RxCross2 style={{paddingRight:0,marginRight:0,alignSelf:"flex-start",minWidth:30}} /></button>
                            </li>)}
                        </ul>:<div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <iframe src="https://embed.lottiefiles.com/animation/121529" style={{border:'none',marginTop:30,}}></iframe>
                        <p>No Notifications Found</p>
                            </div>}
                    </div>
                </div>
                <LowerBar current='Notifies' />
            </div>
        )

    }
}

export default Notifications