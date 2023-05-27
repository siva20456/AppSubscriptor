import {useHistory} from 'react-router-dom'

import Cookies from 'js-cookie'

import Popup from 'reactjs-popup'

import '../../OverAll.css'

const Header = () => {
    console.log('Header Included')
    const history = useHistory()

    const Logout = () => {
        Cookies.remove('jwt_token')
        history.replace('/login') 
    }


    return(
        <div className='Header-row-cont'>
            <img src='https://img.icons8.com/dotty/80/null/logo.png' alt='logo' className='header-logo' />
            <div style={{display:'flex',flexDirection:'row'}}>
            <Popup
                trigger={
                    <button type='button' className='trouble-text'>Having Issues..?</button>
                }
                position="bottom right"
            >
                <div className='trouble-popup'>
                    <h1 className='popup-tr-text'>Contact Our Admin - <span style={{color:'green',fontWeight:'bold'}}>Siva Shankar Marella</span></h1>
                    <h1 className='popup-tr-text'>Mail - <span style={{color:'green'}}>siva2002ismart2002@gmail.com</span></h1>
                    <a href='https://www.linkedin.com/in/siva-shankar-marella-3941b8210/' style={{color:'blue',fontWeight:'bolder',alignSelf:'flex-end'}}>Linkdin</a>
                </div>
            </Popup>
            <button className='logout-btn' onClick={Logout}>Logout</button>
            </div>
        </div>
    )
}

export default Header