import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import {RiSendPlane2Fill} from 'react-icons/ri'
import '../../OverAll.css'
import Cookies from 'js-cookie'

const PORT = 'LOCAL_PORT'
const socket = io.connect(`http://localhost:${PORT}`)

const Chat = ({room,user}) => {

    // const {room,user} = props
    console.log(room,user)
    const thisSideUser = Cookies.get('user')

    const [currentMsg,setMsg] = useState('')
    const [messagesList,setMsgList] = useState([])

    useEffect(() => {
        socket.emit('join_room',room)
        getChatData()
    },[user])

    const getChatData = async() => {
        const res = await fetch(`http://localhost:${PORT}/chat/${room}`)
        const data = await res.json()
        console.log(data,'DataGiven')
        setMsgList(data.chatArray)
    }

    

    const sendMsg = async() => {
        if(currentMsg !== ''){
            const msgData = {
                room,
                message:currentMsg,
                time: new Date(Date.now()).getHours() +":"+ new Date(Date.now()).getMinutes(),
                user:thisSideUser,
            }

            await socket.emit("send_message",msgData)
            setMsgList([...messagesList,{text:currentMsg,user:thisSideUser}])
            setMsg('')
        }
    }

    useEffect(() => {
        socket.on('recieve_msg',(data) => {
            console.log(data,'dataGiven')
            setMsgList(data)
        })
    },[socket])


    return(
        <div className='chat-cont'>
            <div className='chat-header'>
                <h1 className='chat-user-name'>{user}</h1>
            </div>
            <div id='chatBody' className='chat-body'>
                {messagesList.map((obj,i) => <div className={obj.user===thisSideUser?'msg-item user-side':'msg-item'} key={i}>
                    <p className='msg-content'>{obj.text}</p>
                    <p className='user-content'>{obj.user===thisSideUser?'You':obj.user}</p>
                </div>)}
            </div>
            <div className='chat-footer'>
                <input className='chat-input' type='text' placeholder='Hey..' value={currentMsg} onChange={(e) => setMsg(e.target.value)} />
                <button className='chat-send-btn' onClick={sendMsg}><RiSendPlane2Fill /></button>
            </div>
        </div>
    )
}

export default Chat