import { Component } from "react";


import Header from "../Header";

import SideBar from "../SideBar";

import LowerBar from "../LowerBar";

import SellerTab from "../SellerTab";

import Cookies from "js-cookie";

import {ThreeCircles} from 'react-loader-spinner'

class MyContributions extends Component{

    state = {list:[],current:'Loading'}



    componentDidMount(){
        this.getData()
    }

    PORT = 3005

    getData = async() => {
        this.setState({current:'Loading'})
        const url = `https://orent.onrender.com`
        const res = await fetch(url)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            const user = Cookies.get('user')
            const finalData = data.filter(e => e.offered_user === user)
            if(finalData.length > 0){
                this.setState({list:finalData,current:'Success'})
            }else{
                this.setState({current:'Empty'})
            }
        }else{
            console.log(res)
            this.setState({current:'Empty'})
        }
    }

    contribute = () => {
        const {history} = this.props
        history.replace('/contribute')
    }

    renderContext = () => {
        const {current,list} = this.state
        switch (current) {
            case 'Success':
                return <ul className="list-container">
                            {list.map(e => 
                                <SellerTab details = {e} owe={true} key={e._id} />
                            )}
                       </ul>
        
            case 'Empty':
                return <div className="no-contributions-cont">
                            <iframe src="https://embed.lottiefiles.com/animation/144435" style={{border:'none'}}></iframe>
                            <p>You have'nt Contributed till now...</p>
                        </div>

            case 'Loading':
                return <div className="no-contributions-cont" style={{marginTop:200}}>
                            <ThreeCircles  color=" #3b82f6" height="50" width="50" />
                        </div>
        }
    }

    

    render(){
        const {list} = this.state
        return(
        
                <div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='MyConts' />
                    <div className="home-cont">
                        
                        
                        {this.renderContext()}
                    </div>
                </div>
                <LowerBar current='MyConts' />
            </div>
    )
    }

}

export default MyContributions