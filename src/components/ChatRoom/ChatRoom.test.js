import React from 'react';
import { mount } from 'enzyme';
import ChatRoom, { getRoomLocation, getSelectedUser } from './ChatRoom';

describe('ChatRoom', () => {

  let chatRoom;

  beforeEach(() => {
    chatRoom = mount(<ChatRoom location={{pathname: '/room/test'}} socket={{emit: function(){}, on: function(){}}} />);
  });

  it('getRoomLocation should return room name', () => {
    const location = '/room/test';
    expect(getRoomLocation(location)).toBe('test');
  });

  it('getSelectedUser should return checked user name', () => {
    const selectedCheckBoxObj = {
      a: true,
      b: false,
      c: true,
      d: true,
      e: false
    };
    expect(getSelectedUser(selectedCheckBoxObj)).toEqual(['a', 'c', 'd']);
  });

  it('add message when get message', () => {
    expect(chatRoom.find('.log')).toHaveLength(0);
    chatRoom.setState({chatlog:[{userId:'a', content:'a'}, {userId:'b', content:'b'}, {userId:'c', content:'c'}]},
      () => {
        chatRoom.update();
        expect(chatRoom.find('.log')).toHaveLength(3);
      });
  });

  it('onChangeHandler should set content state', () => {
    chatRoom.instance().onChageHandler({target: {value: 'a'}});
    expect(chatRoom.state().content).toBe('a');
  });

  it('chatCallback should set chatlog state and call scrollToBottom method', () => {
    const spy = jest.spyOn(chatRoom.instance(), 'scrollToBottom');

    chatRoom.instance().chatCallback('a');
    chatRoom.instance().chatCallback('b');
    chatRoom.instance().chatCallback('c');
    expect(chatRoom.state().chatlog).toEqual(['a', 'b', 'c']);
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it('getUserOnlineCallBack should set onLineUsers, showModal states', () => {
    chatRoom.instance().getUserOnlineCallBack(['a', 'b', 'c']);
    expect(chatRoom.state().onLineUsers).toEqual(['a', 'b', 'c']);
    expect(chatRoom.state().showModal).toBeTruthy();
  });

  it('initializeMessageState should initialize content, imgMessage states', () => {
    chatRoom.setState({content: 'b', imgMessage: 'a'});
    expect(chatRoom.state().content).toBe('b');
    expect(chatRoom.state().imgMessage).toBe('a');
    chatRoom.instance().initializeMessageState();
    expect(chatRoom.state().content).toBe('');
    expect(chatRoom.state().imgMessage).toBe('');
  });

  it('modalToggleHandle should set showModal state', () => {
    expect(chatRoom.state().showModal).toBeFalsy();
    chatRoom.instance().modalToggleHandle();
    expect(chatRoom.state().showModal).toBeTruthy();
  });

  it('toggleCheckbox should set selectedCheckBox state', () => {
    const event = {target: {name: 'a'}};
    expect(chatRoom.state().selectedCheckBox['a']).toBeFalsy();
    chatRoom.instance().toggleCheckbox(event);
    expect(chatRoom.state().selectedCheckBox['a']).toBeTruthy();
    chatRoom.instance().toggleCheckbox(event);
    expect(chatRoom.state().selectedCheckBox['a']).toBeFalsy();
  });

  it('initializeInviteState should initialize inviteMessage, showModal, selectedCheckBox states', () => {
    chatRoom.setState({inviteMessage: 'b', showModal: 'a', selectedCheckBox: {a: true}});
    expect(chatRoom.state().inviteMessage).toBe('b');
    expect(chatRoom.state().showModal).toBeTruthy();
    expect(chatRoom.state().selectedCheckBox).toEqual({a: true});
    chatRoom.instance().initializeInviteState();
    expect(chatRoom.state().inviteMessage).toBe('');
    expect(chatRoom.state().showModal).toBeFalsy();
    expect(chatRoom.state().selectedCheckBox).toEqual({});
  });

  it('onChangeInviteInput should set inviteMessage state', () => {
    const event = {target: {value: 'a'}};
    chatRoom.instance().onChangeInviteInput(event);
    expect(chatRoom.state().inviteMessage).toBe('a');
  });

  it('getImage should make FileReader instance and encoding file', () => {
    const event = {target: {files: ['a']}};
    let dummyFileReader = { readAsDataURL: jest.fn((file) => file)};
    window.FileReader = jest.fn(() => dummyFileReader);
    const spyOnReadAsDataURL = jest.spyOn(dummyFileReader, 'readAsDataURL');
    chatRoom.instance().getImage(event);
    expect(spyOnReadAsDataURL).toHaveBeenCalled();
  });

  it('fileReaderOnload should set imgMessage state', () => {
    const reader = {result: 'a'};
    chatRoom.instance().fileReaderOnload(reader)();
    expect(chatRoom.state().imgMessage).toBe('a');
  });

});