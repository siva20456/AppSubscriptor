import {useHistory} from 'react-router-dom'

import Cookies from 'js-cookie'

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
            <button className='logout-btn' onClick={Logout}>Logout</button>
        </div>
    )
}

export default Header