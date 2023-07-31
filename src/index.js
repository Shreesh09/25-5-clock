import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Clock from "./clock/clock";
import { Provider, connect } from 'react-redux';
import {passActionsToProps, passStateToProps, store} from "./redux/state_management";

const root = ReactDOM.createRoot(document.getElementById('root'));

const Container = connect(passStateToProps, passActionsToProps)(Clock);

root.render(
    <Provider store={store}>
        <Container/>
    </Provider>
);
