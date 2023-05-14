import { Component } from 'react';
import {Switch,BrowserRouter, Route} from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'
import Contribute from './Components/Contribute';
import ProtectedRoute from './Components/ProtectedRoute';
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
        <ProtectedRoute exact path='/' component={Home} />
        <ProtectedRoute exact path='/contribute' component={Contribute} />
      </Switch>
      </BrowserRouter>
      // <Login />
    )
  }
}

export default App;
