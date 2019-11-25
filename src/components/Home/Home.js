import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';
import InviteWindow from '../InviteWindow/InviteWindow';

class Home extends Component {

  state = {
    showModal: false,
    inviteObj: {},
    roomList: []
  };

  componentDidMount() {
    const { socket } = this.props;
    this.getRoomList();
    socket.on('invite', this.inviteCallback);
  }

  inviteCallback = (inviteObj) => {
    this.setState({showModal: true, inviteObj});
  };

  getRoomList = () => {
    const { socket } = this.props;
    socket.emit('getRooms');
    socket.on('getRooms', this.getRoomListCallback);
  };


  getRoomListCallback = (roomList) => {
    this.setState({ roomList });
  };

  modalToggleHandle = () => {
    this.setState((prevState) => ({showModal: !prevState.showModal}));
  };

  joinRoom = (room) => () => {
    const { socket, history } = this.props;
    socket.emit('joinRoom', room);
    socket.on('joinSuccess', () => {history.push('/room/' + room);});
  };

  render() {
    if (!this.props.isLogin) {
      return <Redirect to="/login" />;
    }
    const { userId, inviteMessage, room} = this.state.inviteObj;
    const { roomList, showModal } = this.state;
    return (
      <div id="Home-container">
        <h1 id="Home-h1">방 목록</h1>
        <hr/>
        {
          roomList.map((room, idx) => (<p className="Home-list" onClick={this.joinRoom(room)} key={idx}>{room}</p>))
        }


        <InviteWindow showModal={showModal}>
          <p id="inviteMessage-info">{userId}님이 {room} 방으로 초대합니다.</p>
          {inviteMessage ? <h1 id="inviteMessage-content">{inviteMessage}</h1> : ""}
          <button className="modal-button" onClick={this.joinRoom(room)}>승인</button>
          <button className="modal-button" onClick={this.modalToggleHandle}>취소</button>
        </InviteWindow>
      </div>
    );
  }
}

export default Home;
