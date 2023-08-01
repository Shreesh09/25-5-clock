import {SET, START, RESET, SET_DEFAULT, STOP, WORK, STATUS} from "./action_constants";
import {createStore} from "redux";
import {createTimerInstance} from "./timer_control";
import {resetTimer, setDefaultValue, startTimer, stopTimer} from "./actions";

const defaultState = {
    work: 25*60,
    break: 5*60,
    status: WORK,
    default: () => defaultState,
};

const timeReducer = (state = defaultState, action) => {
    switch (action.type)
    {
        case SET_DEFAULT:
            if(timer.isRunning())
                return state;
            else {
                if (action.work < 0 || action.break < 0) {
                    console.log("Timer can't be less than 0");
                    return state;
                } else if (action.work > 3600 || action.break > 3600) {
                    console.log("Timer can't be more than 60");
                    return state;
                }

                let st = {};
                st.work = defaultState.work === action.work ? state.work : action.work;
                st.break = defaultState.break === action.break ? state.break : action.break;

                defaultState.work = action.work;
                defaultState.break = action.break;
                return {
                    work: st.work,
                    break: st.break,
                    status: state.status,
                    default: state.default,
                };
            }


        case SET:
            if(action.work < 0 || action.break < 0)
            {
                console.log("Timer can't be less than 0");
                return state;
            }
            else if(action.work > 3600 || action.break > 3600)
            {
                console.log("Timer can't be more than 60");
                return state;
            }
            return ({
                    work: action.work,
                    break: action.break,
                    status: state.status,
                    default: state.default,
                });

        case STOP:
            try{
                timer.stop();
            }catch (e) {
                console.log(e);
            }
            return state;

        case RESET:
            try{
                timer.stop();
            }catch (e) {
                console.log(e);
            }
            return {
            work: 25*60,
            break: 5*60,
            status: WORK,
            default: state.default,
        };

        case START:
            try{
                timer.start(state.work, state.break, state.status, state.default);
            }catch (e) {
                console.log(e);
            }
            return state;

        case STATUS:
                return {
                    work: state.work,
                    break: state.work,
                    status: action.status,
                    default: state.default,
                }

        default: return state;
    }
}

const store = createStore(timeReducer);
const timer = createTimerInstance(store.dispatch);

const passStateToProps = (state) => ({
   work: state.work,
   break: state.break,
    status: state.status,
    default: state.default,
});

const passActionsToProps = (dispatch) => ({
   startTimer(){
       dispatch(startTimer())
   },
    stopTimer() {
        dispatch(stopTimer())
    },
    resetTimer() {
        dispatch(resetTimer())
    },
    setDefaultValues(work, breakTime) {
        dispatch(setDefaultValue(work, breakTime))
    },
});

export {store, passStateToProps, passActionsToProps};