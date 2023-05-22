import { Component } from "react";

import Header from "../Header";

import SideBar from "../SideBar";

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

    PORT  = 'LOCAL_PORT'

    getData = async() => {
        const jwt_token = Cookies.get('jwt_token')
        const options = {
            method:'GET',
            headers:{
                "Content-type": "application/json; charset=UTF-8",
                'Authorization':`Bearer ${jwt_token}`
            }
        }
        const res = await fetch(`http://localhost:${this.PORT}/notifications`,options)
        const data = await res.json()
        console.log(data)
        if(data.length === 0){
            this.setState({current:'empty'})
        }else{
            this.setState({data})
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
        const res = await fetch(`http://localhost:${this.PORT}/removeNote`,options)
        if(res.status === 200){
            console.log(res)
            this.getData()
            history.replace('/notifications')
        }
    }


    render(){

        const {data} = this.state

        return(
            <div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='Notifies' />
                    <div className="notify-cont">
                        <h1 className="heading">Notifications</h1>
                        {data.length !== 0?<ul className="list-note-container">
                            {data.map((e,i) => <li className="note-tab" key = {i}>
                                <h1 className="app-desc">{e.description}</h1>
                                <button type="button" className="chat-btn">Chat</button>
                                <button style={{border:'none',outline:'none',cursor:'pointer',backgroundColor:'transparent',alignSelf:'flex-start'}} onClick={() => this.deleteNote(e)}><RxCross2 style={{paddingRight:0,marginRight:0,alignSelf:"flex-start",minWidth:30}} /></button>
                            </li>)}
                        </ul>:<div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                        <iframe src="https://embed.lottiefiles.com/animation/121529" style={{border:'none',marginTop:30,}}></iframe>
                        <p>No Notifications Found</p>
                            </div>}
                    </div>
                </div>
            </div>
        )

    }
}

export default Notifications