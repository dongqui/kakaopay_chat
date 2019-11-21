import React from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom';


const Login = ({isLogin, loginOnchangeHandler, loginSubmitHandler }) => {

    if (isLogin) {
      return <Redirect to="/home" />;
    }
    return (
      <div id="Login-Container">
        <h1 id="Login-h1">Kakao Chat</h1>
        <input onChange={loginOnchangeHandler} id="Login-Input" placeholder="ID를 입력해주세요"/>
        <button onClick={loginSubmitHandler}>Login</button>
      </div>
    );
};

export default Login;
