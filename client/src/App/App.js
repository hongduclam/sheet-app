import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Header from "./components/Header";

class App extends Component {
  render() {
    return (
      <div>
        <Header/>
        <Switch>
          <Route exact path='/' component={Home}/>
        </Switch>
      </div>
    );
  }
}

export default App;
