import { Component} from "react";

import Header from "../Header";


import SideBar from "../SideBar";

import LowerBar from "../LowerBar";

import SellerTab from "../SellerTab";

import {BsSearch} from 'react-icons/bs'

import LoadingLogoView from '../LoadingLogoView'

import '../../OverAll.css'
import Cookies from "js-cookie";

     

class Home extends Component{

    constructor(props){
        super()
        console.log(props)
        const {state} = props.location
        this.state = {search:'',list:[],current:'Loading',offerType:'Daily',loader:state!== undefined?'Execute':'Done'}
    }

    

    handleOfferType = (offer) => {
        this.setState({offerType:offer})
    }

    handleSearch = (e) => {
        const {value} = e.target
        this.setState({search:value})
    }

    timer = () => {
        
        this.setState({loader:'Done'})
        // clearTimeout(this.interval)
    }
  

    componentDidMount(){
        this.interval = setInterval(this.timer,5000)

        this.getData()
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    PORT = 3005

    getData = async() => {
        this.setState({current:'Loading'})
        const url = `http://localhost:${this.PORT}`
        const res = await fetch(url)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            if(data.length === 0){
                this.setStae({list:[],current:'Empty'})
            }else{
                this.setState({list:data,current:'Success'})
            }
        }else{
            console.log(res)
        }
    }
    

    renderLoading = () => (
        <div className="loading-cont">
            <iframe src="https://embed.lottiefiles.com/animation/87459" style={{outline:'none',border:'none'}}></iframe>
            <h1 className="heading">Hold on..! We're coming with the offers.</h1>
        </div>
    )


    emptyOffers = () => (
        <div className="loading-cont">
            <iframe src="https://embed.lottiefiles.com/animation/104901" style={{border:'none',outline:'none'}}></iframe>
            <h1 className="heading" style={{fontSize:18}}>We are lack of offers to pitch here... Come back after sometime.</h1>
        </div>
    )

    

    renderContext = () => {
        const {current,list,search,offerType} = this.state
        const offerList = list.filter(e => e.plan_type === offerType)
        const newList = offerList.filter(e => e.app_name.toLowerCase().includes(search))
        switch (current) {
            case 'Success':
                return <ul className="list-container">
                {newList.map(e => 
                    <SellerTab details = {e} key={e._id} />
                )}
            </ul>
        
            case 'Loading':
                return this.renderLoading()
            case 'Empty':
                return this.emptyOffers()
        }
    }

    render(){
        console.log('In Home Page')
        const {search,current,offerType,loader} = this.state

        const user = Cookies.get('user')  
        console.log(loader)    


        return(
            loader === 'Done' ?<div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='Home' />
                    <div className="home-cont">
                        <h1 style={{color:'green',fontSize:18,alignSelf:'flex-end',fontWeight:'bold'}}>Hey, {user} welcome..!</h1>
                        <div className="offer-type-container">
                            <button className={`offer-type ${offerType === 'Daily'?'selected-offer':''}`} onClick={() => this.handleOfferType('Daily')}>Day Wise Rentals</button>
                            <button className={`offer-type ${offerType === 'Monthly'?'selected-offer':''}`} onClick={() => this.handleOfferType('Monthly')}>Monthly Rentals</button>
                            <button className={`offer-type ${offerType === 'Yearly'?'selected-offer':''}`} onClick={() => this.handleOfferType('Yearly')}>Yearly Rentals</button>
                        </div>
                        <div className="search-container">
                            <input type="search" className="search-input" placeholder="Enter the platform" onChange={this.handleSearch} value={search} />
                            <button style={{border:'none',outline:'none',cursor:'pointer'}} ><BsSearch className="search-logo" /></button>
                        </div>
                        {this.renderContext()}
                        {current === 'Success'?this.renderLoading():''}
                    </div>
                </div>
                <LowerBar current='Home' />
            </div>:<LoadingLogoView />
        )
    }
}

export default Home