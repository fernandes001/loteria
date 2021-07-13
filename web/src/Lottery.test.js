import React from 'react';
import ReactDOM from 'react-dom';
import Lottery from './Lottery';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Lottery />, div);
  ReactDOM.unmountComponentAtNode(div);
});
