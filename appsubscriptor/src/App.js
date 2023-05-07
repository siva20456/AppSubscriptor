import { Component } from 'react';
import {Switch,BrowserRouter, Route} from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'
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
      </Switch>
      </BrowserRouter>
      // <Login />
    )
  }
}

export default App;
