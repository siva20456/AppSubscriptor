import {BsFillArrowRightCircleFill} from 'react-icons/bs'

import logo from '../../disneyLogo.png'

import '../../OverAll.css'


const SellerTab = ({props}) => {
    
    return(
        <div className='seller-cont'>
            <img src={props.img} alt='platform' className='app-logo'/>
            <div className='decription-cont'>
                <h1 className='app-desc'>Disney+ Hotstar is India’s largest premium streaming platform with more than 100,000 hours of drama and movies in 17 languages, and coverage of every major global sporting..</h1>
                <p className='user-desc'>This Offer is providing by user__00</p>
            </div>
            <div className='last-det'>
                <div className='price-cont'>
                    <p className='price-text'><span className='price'>{`130/- `}</span>yearly</p>
                </div>
                <button className='grab-btn'>
                    Grab 
                <BsFillArrowRightCircleFill />
                </button>
            </div>
        </div>
    )
}


export default SellerTab