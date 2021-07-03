import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Header from "./components/Header";
import { ToastContainer } from 'react-toastify';

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <Switch>
          <Route exact path='/' component={Home}/>
        </Switch>
        <ToastContainer />
      </div>
    );
  }
}

export default App;
