import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from "enzyme/build/index";

describe('app', () => {

  let app;

  beforeEach(() => {
    app = shallow(<App />);
  });
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('loginCallback should set isLogin, socket states', () => {
    const socket = {a: 'a'};
    app.instance().loginCallback(socket)(true);
    expect(app.state().isLogin).toBeTruthy();
    expect(app.state().socket).toEqual({a: 'a'});
  });

  it('loginOnchangeHandler should set userId state', () => {
    const event = {target: {value: 'a'}};
    app.instance().loginOnchangeHandler(event);
    expect(app.state().userId).toBe('a');
  });

});