import { Component} from "react";

import Header from "../Header";

import SideBar from "../SideBar";

import SellerTab from "../SellerTab";

import {BsSearch} from 'react-icons/bs'

import '../../OverAll.css'

class Home extends Component{

    state = {search:'',list:[{img:'https://img.icons8.com/fluency/48/null/amazon-prime-video.png'},{img:'https://img.icons8.com/nolan/64/disney-plus.png'},{img:'https://img.icons8.com/nolan/64/amazon-prime-video.png'},{img:'https://img.icons8.com/nolan/64/hbo.png'},{img:'https://img.icons8.com/color/48/null/netflix.png'}]}

    handleSearch = (e) => {
        const {value} = e.target
        this.setState({search:value})
    }


    componentDidMount(){
        this.getData()
    }

    PORT = 'YOUR_LOCAL_PORT'

    getData = async() => {
        const url = `http://localhost:${this.PORT}`
        const res = await fetch(url)
        if(res.status === 200){
            const data = await res.json()
            console.log(data)
        }else{
            console.log(res)
        }
    }
    

    render(){
        console.log('In Home Page')
        const {search,list} = this.state

        return(
            <div className="home-page">
                <Header />
                <div className="diver">
                    <SideBar current='Home' />
                    <div className="home-cont">
                        <div className="search-container">
                            <input type="search" className="search-input" placeholder="Enter the platform" onChange={this.handleSearch} value={search} />
                            <BsSearch className="search-logo" />
                        </div>
                        <ul className="list-container">
                            {list.map(e => 
                                <SellerTab props = {e} />
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home