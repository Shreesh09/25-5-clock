import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import Clock from "./clock/clock";
import { Provider} from 'react-redux';
import {store} from "./redux/state_management";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
    <Provider store={store}>
        <Clock />
    </Provider>
    </StrictMode>
);
