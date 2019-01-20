import React from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom';


const Login = ({isLogin, loginOnchagehandler, loginSubmitHandler }) => {

    if (isLogin) {
      return <Redirect to="/home" />;
    }
    return (
      <div id="Login-Container">
        <h1 id="Login-h1">KakaoPay Chat</h1>
        <input onChange={loginOnchagehandler} id="Login-Input" placeholder="ID를 입력해주세요"/>
        <button onClick={loginSubmitHandler}>Login</button>
      </div>
    );
};

export default Login;
