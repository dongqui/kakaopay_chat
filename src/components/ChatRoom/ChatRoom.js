import React, { Component } from 'react';
import './ChatRoom.css';
import InviteWindow from '../InviteWindow/InviteWindow';

export const getRoomLocation = (location) => (location.split('/')[2]);
export const getSelectedUser = (selectedCheckBox) => Object.keys(selectedCheckBox).filter(user => selectedCheckBox[user]);

class ChatRoom extends Component {

  state = {
    chatlog: [],
    content: '',
    room: getRoomLocation(this.props.location.pathname),
    isJoined: false,
    onLineUsers: [],
    showModal: false,
    inviteMessage: '',
    imgMessage: '',
    selectedCheckBox: {}
  };
  socket = this.props.socket;

  componentDidMount() {
    this.socket.on('chat', this.chatCallback);
    this.socket.on('getUserOnline', this.getUserOnlineCallBack);
  };

  chatCallback = (message) => {
    this.setState(prevState =>
      ({ chatlog: [...prevState.chatlog, message] }), this.scrollToBottom)
  };

  getUserOnlineCallBack = (onLineUsers) => {
    this.setState(prevState => (
      {
        onLineUsers,
        showModal: !prevState.showModal
      })
    )
  };

  onChageHandler = (e) => {
    this.setState({content: e.target.value});
  };

  sendMessage = () => {
    const { imgMessage, content} = this.state;
    this.socket.emit('chat', {imgMessage, content});
    this.initializeFileInput();
    this.initializeMessageState();
  };

  initializeFileInput = () => {
    this.fileInput.type ='';
    this.fileInput.type = 'file';
  };

  initializeMessageState = () => {
    this.setState({content: '', imgMessage: ''});
  };

  getUserOnline = () => {
    this.socket.emit('getUserOnline', this.state.content);
  };

  modalToggleHandle = () => {
    this.setState((prevState) => ({showModal: !prevState.showModal}));
  };

  toggleCheckbox = (e) => {
    let name = e.target.name;
    this.setState(prevState => {
      let isChecked = !!prevState.selectedCheckBox[name];
      return {
        selectedCheckBox: {
          ...prevState.selectedCheckBox,
          [name]: !isChecked
        }
      }
    });
  };

  sendInvite = () => {
    const {selectedCheckBox, inviteMessage} = this.state;
    let selectedUsers = getSelectedUser(selectedCheckBox);
    this.socket.emit('invite', {selectedUsers, inviteMessage});
    this.initializeInviteState();
  };

  initializeInviteState() {
    this.setState({inviteMessage: '', showModal: false, selectedCheckBox: {}});
  }

  onChangeInviteInput = (e) => {
    this.setState({inviteMessage: e.target.value});
  };

  getImage = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = this.fileReaderOnload(reader);
  };

  fileReaderOnload = (reader) => () => {
    this.setState({imgMessage: reader.result});
  };

  leaveRoom = () => {
    this.socket.emit('leaveRoom', this.state.room);
    this.props.history.goBack();
  };

  scrollToBottom = () => {
    if (this.messagesEnd.scrollIntoView) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  };

  render() {
    const { room, chatlog, content, showModal, onLineUsers, inviteMessage, selectedCheckBox } = this.state;

    return (
      <div id="chat-container">
        <div id="chat-head">
          <h3 className="cheat-head-item" onClick={this.leaveRoom}> 나가기 </h3>
          <h3 className="cheat-head-item" id="chat-head-center"> {room} </h3>
          <h3 className="cheat-head-item" onClick={this.getUserOnline}> 초대하기</h3>
        </div>
        <div id="chat-window">
         <ul>
          {chatlog.map((chat, idx) => (
            <li className="clearfix" key={idx}>
              <div className={chat.userId === this.props.userId ? "log me" : "log other"} >
                <strong>{chat.userId} </strong>
                <p className={chat.userId === this.props.userId ? "" : "float-right"}>
                  {chat.content}
                  {chat.imgMessage ? <img src={chat.imgMessage}/> : ""}
                </p>
              </div>
            </li>))}
          </ul>
          <div ref={(el) => { this.messagesEnd = el; }}/>
        </div>
        <textarea onChange={this.onChageHandler} value={content} id="message"  placeholder="Message" />
        <input onChange={this.getImage} ref={(el) => { this.fileInput = el; }} type="file" id="FileBox"/>
        <button onClick={this.sendMessage} id="submit-btn">Send</button>



        <InviteWindow showModal={showModal}>
          { onLineUsers.length ?
            (<ul id="userList">
              {onLineUsers.map((userId, idx) => (
                <li key={idx}>
                  <input onChange={this.toggleCheckbox} name={userId} className="userList-CheckBox" type="checkbox"
                         checked={!!selectedCheckBox[userId]} value={userId} />
                  {userId}
                </li>
              ))}
            </ul>) :
            (
              <h2 id="noti-h3">대기중인 사용자가 없습니다.</h2>
            )
          }
          <input id="inviteMessage-input" value={inviteMessage} onChange={this.onChangeInviteInput} placeholder="초대 메세지"/>
          <button className="modal-button" onClick={this.sendInvite}>초대하기</button>
          <button className="modal-button" onClick={this.modalToggleHandle}>취소</button>
        </InviteWindow>
      </div>
    );
  }
}

export default ChatRoom;
