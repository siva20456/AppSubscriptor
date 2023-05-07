import { Component} from "react";

import Cookies from 'js-cookie'

import '../../OverAll.css'

class Home extends Component{

    Logout = () => {
        Cookies.remove('jwt_token')
        this.props.history.replace('/login')
    }

    render(){
        console.log('In Home Page')

        return(
            <div className="mainCont">
                <h1>Home Page</h1>
                <button onClick={this.Logout}>Logout</button>
            </div>
        )
    }
}

export default Home