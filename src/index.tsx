import { render } from 'react-dom'
import { createElement, StrictMode } from 'react'
import { Provider } from 'react-redux'

import './index.css';
import App from './App';
import store from './redux/store';

render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
    document.getElementById('root')!
);
