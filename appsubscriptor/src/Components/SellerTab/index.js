import {BsFillArrowRightCircleFill} from 'react-icons/bs'


import '../../OverAll.css'


const SellerTab = ({props}) => {
    
    const {img_url,offered_user,price,plan_duration,app_name} = props

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
                <button className='grab-btn'>
                    Grab 
                <BsFillArrowRightCircleFill />
                </button>
            </div>
        </div>
    )
}


export default SellerTab