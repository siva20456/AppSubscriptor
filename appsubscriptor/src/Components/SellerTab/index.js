import {BsFillArrowRightCircleFill} from 'react-icons/bs'

import io from 'socket.io-client'

import Popup from 'reactjs-popup'

import { formatDistance } from 'date-fns'

import Cookies from 'js-cookie'



import '../../OverAll.css'

const PORT = 'LOCAL_PORT'

const socket = io.connect(`http://localhost:${PORT}`)

const SellerTab = ({props,owe}) => {
    
    const {img_url,offered_user,price,plan_duration,app_name,expiry_date,devicesIncluded,devicesLookingFor} = props


    const durationRemained = formatDistance(new Date(Date.now()),new Date(expiry_date))

    const netflix = 'Netflix is a leading subscription-based streaming service that has revolutionized the way people consume visual media. Launched in 1997 as a DVD-by-mail rental service, it has since evolved to offer a vast library of TV shows, movies, and documentaries that can be streamed on-demand across devices such as smartphones, tablets, smart TVs, and gaming consoles. '
    const hbo = 'HBO is a streaming service known for producing high-quality original programming such as Game of Thrones, The Sopranos, and Westworld. It was launched in 1972, making it one of the oldest pay television services in the United States.'
    const amazon = 'Prime Video is a popular streaming service owned by Amazon that offers a diverse range of movies, TV shows, and original content to its subscribers. Launched in 2006 as Amazon Unbox, the service has since rebranded and expanded globally.'
    const disney = 'Disney+ Hotstar is India’s largest premium streaming platform with more than 100,000 hours of drama and movies in 17 languages, and coverage of every major global sporting..'

    let desc = ''
    if(app_name === 'Netflix'){
        desc = netflix
    }else if(app_name === 'HBO'){
        desc = hbo
    }else if(app_name === 'Amazon Prime'){
        desc = amazon
    }else{
        desc = disney
    }


    const connectTheUser = async(close) => {
        console.log('connecting')
        const user = Cookies.get('user')
        const data = {
            platform:app_name,
            raised_for:offered_user,
            raised_by:user,
            description:`Hey ${offered_user}, you have a chat request from ${user} regarding the ${app_name} offer you raised...`
        }
        const options = {
            method:'POST',
            headers:{
                "Content-type": "application/json; charset=UTF-8",
            },
            body:JSON.stringify(data),
        }
        const res = await fetch(`http://localhost:${PORT}/addNotification`,options)
        console.log(res)
        if(res.status === 200){
            const data = await res.json()
            alert('Chat Request raised..!')
            close()
        }else{
            alert('Failed to connect.. Try Agian')
        }
    }

    return(
        <div className='seller-cont'>
            <img src={img_url} alt='platform' className='app-logo'/>
            <div className='decription-cont'>
                <h1 className='app-desc'>{desc}</h1>
                <p className='user-desc'>This Offer is providing by {offered_user}</p>
            </div>
            <div className='last-det'>
                <div className='price-cont'>
                    <p className='price-text'><span className='price'>{`${price}/- `}</span>{plan_duration}</p>
                </div>
                
                {owe === true ? '':<div className="popup-container">
                <Popup
                    modal
                    trigger={
                    <button  className='grab-btn'>
                        Grab 
                        <BsFillArrowRightCircleFill />
                    </button>
                    }
                >
                    {close => (
                    <>
                        <div className='popupCont'>
                        <div className='offer-details-cont'>
                            <div className='ind-item'>
                                <h1 className='property'>Application -</h1>
                                <p className='value'>{app_name}</p>
                            </div>
                            <div className='ind-item'>
                                <h1 className='property'>providing by -</h1>
                                <p className='value'>{offered_user}</p>
                            </div>
                            <div className='ind-item'>
                                <h1 className='property'>Amount -</h1>
                                <p className='value'>{price}</p>
                            </div>
                            <div className='ind-item'>
                                <h1 className='property'>Expire At -</h1>
                                <p className='value'>{expiry_date}</p>
                            </div>
                            <div className='ind-item'>
                                <h1 className='property'>Devices included till now in this plan -</h1>
                                <p className='value'>{devicesIncluded}</p>
                            </div>
                            <div className='ind-item'>
                                <h1 className='property'>Looking for -</h1>
                                <p className='value'>{devicesLookingFor} More devices</p>
                            </div>
                            <div className='ind-item'>
                                <h1 className='property'>Duration remained in expiration of plan -</h1>
                                <p className='value'>{durationRemained}</p>
                            </div>
                        </div>
                        
                        <p className='app-desc'>Are you sure..? Do you want to connect with {offered_user} regarding this offer.</p>
                        
                        <div>
                        <button
                        type="button"
                        className="trigger-button"
                        onClick={() => close()}
                        >
                        Close
                        </button>
                        <button
                        type="button"
                        className="trigger-button"
                        onClick={() => connectTheUser(close)}
                        >
                        Connect
                        </button>
                        </div>
                        </div>
                    </>
                    )}
                </Popup>
                </div>}
            </div>
        </div>
    )
}


export default SellerTab