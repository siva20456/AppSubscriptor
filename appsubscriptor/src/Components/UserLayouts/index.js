import { Component } from "react";

import Header from "../Header";

import SideBar from "../SideBar";

import Cookies from "js-cookie";

import {BsFillArrowRightCircleFill} from 'react-icons/bs'

import Chat from '../Chat'

class UserLayouts extends Component{

    state = {usersList:[],showChat:false,room:'',user:''}

    componentDidMount(){
        this.getData()
    }

    getData = async() => {
        const options = {
            method:'GET',
            headers:{
                "Content-type": "application/json; charset=UTF-8"
            },
        } 
        const username = Cookies.get('user')
        const res = await fetch(`http://localhost:3005/connectedUsers/${username}`,options)
        console.log(res)
        const data = await res.json()
        console.log(data)
        let connectedUsersList = []
        for(var each of data.chats){
            let usersList = each.split(":")
            let reqUser = usersList[0] === username? usersList[1] : usersList[0]
            connectedUsersList.push(reqUser)
        }
        this.setState({usersList:connectedUsersList})
    }

    chatWithUser = (e) => {
        const user = Cookies.get('user')
        const arr = [user,e].sort()
        const roomId = `${arr[0]}:${arr[1]}`
        this.setState({showChat:true,room:roomId,user:e})
    }

    render(){

        const {usersList,showChat,room,user} = this.state

        return(
            <div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='UserChat' />
                    <div className="user-layout-cont">
                        <h1 className="heading" >Users Connected</h1>
                        <ul className="layout-cont">
                        {usersList.map(e => <li className="user-tab" key={e}>
                            <h1 className="user-dec">{e}</h1>
                            <button className="start-btn" onClick={() => this.chatWithUser(e)} ><BsFillArrowRightCircleFill /></button>
                        </li>)}
                        </ul>
                        {showChat? <Chat room={room} user={user}  /> : '' }
                    </div>
                </div>
            </div>
                
        )
    }
}

export default UserLayouts