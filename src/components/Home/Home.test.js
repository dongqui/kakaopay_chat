import React from 'react';
import { mount } from 'enzyme';
import Home from './Home'
import InviteWindow from '../InviteWindow/InviteWindow';

describe('Home', () => {

  let home;

  beforeEach(() => {
    home = mount(<Home isLogin={true} socket={{emit: jest.fn(), on: jest.fn()}}/>);
  });

  it('should render room list', () => {
    home.setState({roomList: ['a', 'b', 'c']}, () => {
      home.update();
      expect(home.find('.Home-list')).toHaveLength(3);
    });
  });

  it('pop up invite window when invited', () => {
    home.setState({showModal: true}, () => {
      home.update();
      expect(home.find(InviteWindow)).toHaveLength(1);
    });
  });

  it('modalToggleHandle function should toggle showModal state', () => {
    expect(home.state().showModal).toBeFalsy();
    home.instance().modalToggleHandle();
    expect(home.state().showModal).toBeTruthy();
    home.instance().modalToggleHandle();
    expect(home.state().showModal).toBeFalsy();
  });

  it('getRoomListCallBack should set roomList state', () => {
    expect(home.state().roomList).toEqual([]);
    home.instance().getRoomListCallback(['a', 'b', 'c']);
    expect(home.state().roomList).toEqual(['a', 'b', 'c']);
  });

  it('inviteCallBack should set showModal, inviteObj states', () => {
    const inviteObj = {
      a: 'a'
    };
    expect(home.state().showModal).toBeFalsy();
    expect(home.state().inviteObj).toEqual({});
    home.instance().inviteCallback(inviteObj);
    expect(home.state().showModal).toBeTruthy();
    expect(home.state().inviteObj).toEqual({a: 'a'});
  })

});