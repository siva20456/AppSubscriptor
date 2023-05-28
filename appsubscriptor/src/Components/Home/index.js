import { Component} from "react";

import Header from "../Header";


import SideBar from "../SideBar";

import LowerBar from "../LowerBar";

import SellerTab from "../SellerTab";

import {BsSearch} from 'react-icons/bs'

import '../../OverAll.css'
import Cookies from "js-cookie";

     

class Home extends Component{


    state = {search:'',list:[],current:'Loading'}
    handleSearch = (e) => {
        const {value} = e.target
        this.setState({search:value})
    }
  

    componentDidMount(){
        this.getData()
    }

    PORT = 'LOCAL_PORT'

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
        const {current,list,search} = this.state
        const newList = list.filter(e => e.app_name.toLowerCase().includes(search))
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
        const {search,current} = this.state

        const user = Cookies.get('user')

        return(
            <div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='Home' />
                    <div className="home-cont">
                        <h1 style={{color:'green',fontSize:18,alignSelf:'flex-end',fontWeight:'bold'}}>Hey, {user} welcome..!</h1>
                        <div className="search-container">
                            <input type="search" className="search-input" placeholder="Enter the platform" onChange={this.handleSearch} value={search} />
                            <button style={{border:'none',outline:'none',cursor:'pointer'}} ><BsSearch className="search-logo" /></button>
                        </div>
                        {this.renderContext()}
                        {current === 'Success'?this.renderLoading():''}
                    </div>
                </div>
                <LowerBar current='Home' />
            </div>
        )
    }
}

export default Home