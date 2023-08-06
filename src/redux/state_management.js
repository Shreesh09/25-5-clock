import {createTimerInstance} from "./timer_control";
import {configureStore, createSlice} from '@reduxjs/toolkit'

const defaultState = {
    work: 25*60,
    break: 5*60,
};

const initialState = {
    work: 10,
    break: 5*60,
    status: 'work',
};


const timeSlice = createSlice({
    name: 'time',
    initialState: initialState,
    reducers: {
        setDefault: (state, action) => {
            const {work, breakTime} = action.payload;
            console.log(action.payload);
            if(!timer.isRunning())
            {
                if (work < 0 || breakTime < 0) {
                    console.log("Timer can't be less than 0");
                    return;
                } else if (work > 3600 || breakTime > 3600) {
                    console.log("Timer can't be more than 60");
                    return;
                }

                let st = {};
                st.work = defaultState.work === work ? state.work : work;
                st.break = defaultState.break === breakTime ? state.break : breakTime;

                console.log(work);
                console.log(breakTime);
                defaultState.work = work;
                defaultState.break = breakTime;
                state.work = st.work;
                state.break = st.break;
            }
        },
        set: (state, action) => {
            const {work, breakTime} = action.payload;
            if (work < 0 || breakTime < 0) {
                console.log("Timer can't be less than 0");
                return;
            } else if (work > 3600 || breakTime > 3600) {
                console.log("Timer can't be more than 60");
                return;
            }
            state.work = work;
            state.break = breakTime;
        },
        stop: () => {
            try {
                timer.stop();
            } catch (e) {
                console.log(e);
            }
        },
        reset: (state) => {
            try {
                timer.stop();
            } catch (e) {
                console.log(e);
            }
            state.work = defaultState.work;
            state.break = defaultState.break;
            state.status = 'work';
        },
        start: (state)=> {
            try {
                timer.start(state.work, state.break, state.status, () => (defaultState));
            } catch (e) {
                console.log(e);
            }
        },
        status: (state, action) => {
            const {status} = action.payload;
            state.status = status;
        }
    }
});

export const store = configureStore({
        reducer: {
            time: timeSlice.reducer,
        },
    });

const timer = createTimerInstance(store.dispatch);
export const {setDefault, set, stop, reset, start, status} = timeSlice.actions;


export const selectWork = state => state.time.work;
export const selectBreak = state => state.time.break;
export const selectStatus = state => state.time.status;
export const getDefault = () => (defaultState);

