import { Component } from 'react';
import Login from './Components/Login'
import './App.css';

class App extends Component{
  render(){
    console.log('In Main Component')
    return(
      <Login />
    )
  }
}

export default App;
