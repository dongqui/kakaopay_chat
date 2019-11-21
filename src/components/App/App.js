import React, { Component } from 'react';
import Login from '../Login/Login';
import ChatRoom from '../ChatRoom/ChatRoom';
import Home from '../Home/Home';
import io from 'socket.io-client';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';

class App extends Component {

  state = {
    isLogin: false,
    socket: {},
    userId: ''
  };

  loginSubmitHandler = () => {
    const socket = io.connect('http://localhost:3001');
    socket.emit('login', this.state.userId);
    socket.on('login', this.loginCallback(socket));
  };

  loginCallback = (socket) => (isLogin) =>{
    this.setState({ isLogin, socket })
  };

  loginOnchangeHandler = (e) => {
    this.setState({userId: e.target.value})
  };


  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact={true} path="/" render={() => (this.state.isLogin ? <Redirect to="/home"/> : <Redirect to="/login"/>)}/>
          <Switch>
            <Route path="/home" render={({ history }) =>
              <Home
                history={history}
                isLogin={this.state.isLogin}
                socket={this.state.socket}
              />}
            />
            <Route path="/room/:id" render={({ location, history }) =>
              <ChatRoom
                location={location}
                history={history}
                userId={this.state.userId}
                socket={this.state.socket}
              />
            }/>
            <Route path="/login" render={() =>
              <Login
                loginSubmitHandler={this.loginSubmitHandler}
                loginOnchangeHandler={this.loginOnchangeHandler}
                isLogin={this.state.isLogin}
              />}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
