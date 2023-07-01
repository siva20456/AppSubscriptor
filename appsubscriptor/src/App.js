import { Component } from 'react';
import {Switch,BrowserRouter, Route} from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'
import Contribute from './Components/Contribute';
import ProtectedRoute from './Components/ProtectedRoute';
import Notifications from './Components/Notifications';
import MyContributions from './Components/MyContributions';
import UserLayouts from './Components/UserLayouts';
import Payments from './Components/Payment';
import './App.css';

class App extends Component{

  

  constructor(props){
    super(props)
    console.log(props)
  }
 

  render(){
    console.log('In Main Component')
    return(
      
        
      <BrowserRouter>
      <Switch>
        <Route exact path='/login' component={Login} />
        <ProtectedRoute path='/' component={Home} />
        <ProtectedRoute exact path='/contribute' component={Contribute} />
        <ProtectedRoute exact path='/notifications' component={Notifications} />
        <ProtectedRoute exact path='/myOffers' component={MyContributions} />
        <ProtectedRoute exact path='/userChat' component={UserLayouts} />
        <ProtectedRoute exact path='/payments' component={Payments} />
      </Switch>
      </BrowserRouter>
    )
  }
}

export default App;
