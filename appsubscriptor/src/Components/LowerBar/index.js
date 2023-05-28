import {Link} from 'react-router-dom'

import { useState,useEffect } from 'react'

import Cookies from 'js-cookie'

import {AiFillHome,AiOutlinePlusCircle,AiOutlineMessage} from 'react-icons/ai'

import {BsBagCheckFill} from 'react-icons/bs'

import {MdNotificationsActive} from 'react-icons/md'

import Navbar from 'react-bootstrap/Navbar';


import '../../OverAll.css'

const PORT = 'LOCAL_PORT'

const LowerBar = ({current}) => {

    console.log('Implementing SideBar')
    console.log(current)

    const [Notes,setNotes] = useState(0)

    useEffect(()=> {
        const getData = async() => {
            const jwt_token = Cookies.get('jwt_token')
            const options = {
                method:'GET',
                headers:{
                    "Content-type": "application/json; charset=UTF-8",
                    'Authorization':`Bearer ${jwt_token}`
                }
            }
            const res = await fetch(`http://localhost:${PORT}/notifications`,options)
            const data = await res.json()
            console.log(data)
            if(data.length > 0){
                setNotes(data.length)
            }
        }
        getData()
    },[])


    return(
        <div  className='lower-cont'>
            <Link to='/' style={{textDecoration:'none',}}>
            <div className={`lowerbar-item ${current==='Home'?'low-selected':''}`}>
                <AiFillHome className='side-logo' />
            </div>
            </Link>
            <Link to='/myOffers' style={{textDecoration:'none',}}>

            <div className={`lowerbar-item ${current==='MyConts'?'low-selected':''}`}>
                <BsBagCheckFill className='side-logo' />
            </div>
            </Link>
            <Link to='/contribute' style={{textDecoration:'none',}}>

            <div className={`lowerbar-item ${current==='Contribute'?'low-selected':''}`}>
                <AiOutlinePlusCircle className='side-logo' />
            </div>
            </Link>
            <Link to='/notifications' style={{textDecoration:'none',}}>

            <div className={`lowerbar-item ${current==='Notifies'?'low-selected':''}`}>
                <MdNotificationsActive className='side-logo' />
                <span className='count-notes'>{Notes > 0 ? Notes:''}</span>
            </div>
            </Link>
            <Link to='/userChat' style={{textDecoration:'none',}}>

            <div className={`lowerbar-item ${current==='UserChat'?'low-selected':''}`}>
                <AiOutlineMessage className='side-logo' />
            </div>
            </Link>
        </div>
    )

}

export default LowerBar