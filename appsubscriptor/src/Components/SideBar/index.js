import {Link} from 'react-router-dom'

import { useState,useEffect } from 'react'

import Cookies from 'js-cookie'

import {AiFillHome,AiOutlinePlusCircle,AiOutlineMessage} from 'react-icons/ai'

import {BsBagCheckFill} from 'react-icons/bs'

import {MdNotificationsActive} from 'react-icons/md'

import {TbCoinRupee} from 'react-icons/tb'


import '../../OverAll.css'

const PORT = 3005

const SideBar = ({current}) => {

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
            const res = await fetch(`https://orent.onrender.com/notifications`,options)
            const data = await res.json()
            console.log(data)
            if(data.length > 0){
                setNotes(data.length)
            }
        }
        getData()
    },[])


    return(
        <div className='sidebar-cont'>
            <Link to='/' style={{textDecoration:'none',width:'92%'}}>
            <div className={`sidebar-item ${current==='Home'?'selected':''}`}>
                <AiFillHome className='side-logo' />
                <h1 className='item-name'>Home</h1>
            </div>
            </Link>
            <Link to='/contribute' style={{textDecoration:'none',width:'92%'}}>

            <div className={`sidebar-item ${current==='Contribute'?'selected':''}`}>
                <AiOutlinePlusCircle className='side-logo' />
                <h1 className='item-name'>Contribute</h1>
            </div>
            </Link>
            <Link to='/myOffers' style={{textDecoration:'none',width:'92%'}}>

            <div className={`sidebar-item ${current==='MyConts'?'selected':''}`}>
                <BsBagCheckFill className='side-logo' />
                <h1 className='item-name'>My Contributions</h1>
            </div>
            </Link>
            <Link to='/notifications' style={{textDecoration:'none',width:'92%'}}>

            <div className={`sidebar-item ${current==='Notifies'?'selected':''}`}>
                <MdNotificationsActive className='side-logo' />
                <h1 className='item-name'>Notifications</h1>
                <span className='count-notes'>{Notes > 0 ? Notes:''}</span>
            </div>
            </Link>
            <Link to='/userChat' style={{textDecoration:'none',width:'92%'}}>

            <div className={`sidebar-item ${current==='UserChat'?'selected':''}`}>
                <AiOutlineMessage className='side-logo' />
                <h1 className='item-name'>Connected Users</h1>
            </div>
            </Link>
            <Link to='/payments' style={{textDecoration:'none',width:'92%'}}>

            <div className={`sidebar-item ${current==='Payments'?'selected':''}`}>
                <TbCoinRupee className='side-logo' />
                <h1 className='item-name'>Payment Section</h1>
            </div>
            </Link>
        </div>
    )

}

export default SideBar