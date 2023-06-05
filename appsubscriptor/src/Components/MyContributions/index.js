import { Component } from "react";


import Header from "../Header";

import SideBar from "../SideBar";

import LowerBar from "../LowerBar";

import SellerTab from "../SellerTab";

import Cookies from "js-cookie";

class MyContributions extends Component{

    state = {list:[]}



    componentDidMount(){
        this.getData()
    }

    PORT = 3005

    getData = async() => {
        const url = `http://localhost:${this.PORT}`
        const res = await fetch(url)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
            this.setState({list:data})
        }else{
            console.log(res)
        }
    }

    contribute = () => {
        const {history} = this.props
        history.replace('/contribute')
    }

    render(){
        const {list} = this.state
        const user = Cookies.get('user')
        const newList = list.filter(e => e.offered_user === user)
        console.log(newList)
        return(
        
                <div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='MyConts' />
                    <div className="home-cont">
                        
                        {newList.length === 0?
                        <div className="no-contributions-cont">
                            <iframe src="https://embed.lottiefiles.com/animation/144435" style={{border:'none'}}></iframe>
                            <p>You have'nt Contributed till now...</p>
                        </div>
                        :<ul className="list-container">
                            {newList.map(e => 
                                <SellerTab details = {e} owe={true} key={e._id} />
                            )}
                        </ul>}
                    </div>
                </div>
                <LowerBar current='MyConts' />
            </div>
    )
    }

}

export default MyContributions