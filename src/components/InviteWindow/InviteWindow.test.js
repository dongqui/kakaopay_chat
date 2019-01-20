import React from 'react';
import { shallow } from 'enzyme';
import InviteWindow from './InviteWindow';

describe('InviteWindow', () => {

  it('className should be "modal display-block" when InviteWindow displayed', () => {
    let inviteWindow = shallow(<InviteWindow showModal={true}/>);
    expect(inviteWindow.find('.display-block')).toHaveLength(1);
  });

  it('className should be "modal display-none" when InviteWindow not displayed', () => {
    let inviteWindow = shallow(<InviteWindow showModal={false}/>);
    expect(inviteWindow.find('.display-none')).toHaveLength(1);
  });
});