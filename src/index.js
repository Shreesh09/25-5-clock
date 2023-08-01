import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import Clock from "./clock/clock";
import { Provider, connect } from 'react-redux';
import {passActionsToProps, passStateToProps, store} from "./redux/state_management";

const root = ReactDOM.createRoot(document.getElementById('root'));

const Container = connect(passStateToProps, passActionsToProps)(Clock);

root.render(
    <StrictMode>
    <Provider store={store}>
        <Container/>
    </Provider>
    </StrictMode>
);
