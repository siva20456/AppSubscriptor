import {Link} from 'react-router-dom'

import {AiFillHome,AiOutlinePlusCircle} from 'react-icons/ai'

import {BsBagCheckFill} from 'react-icons/bs'

import {MdNotificationsActive} from 'react-icons/md'

import '../../OverAll.css'

const SideBar = ({current}) => {

    console.log('Implementing SideBar')
    console.log(current)



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
                <h1 className='item-name'>Contirbute</h1>
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
            </div>
            </Link>
        </div>
    )

}

export default SideBar