import {changeStatus, setTimer} from "./actions";
import {BREAK, WORK} from "./action_constants";

let instance;
let globalState = {
    dispatch: null,
    id: 0,
    isRunning: false,
}

class Timer {
    constructor(dispatch) {
        if(instance) {
            throw new Error("New Instance cannot be created");
        }

        instance = this;
        this.setPropertyValue('dispatch', dispatch);
    }

    getPropertyValue(propertyName)
    {
        return globalState[propertyName];
    }

    setPropertyValue(propertyName, propertyValue)
    {
        globalState[propertyName] = propertyValue;
    }
    start = (workTime, breakTime, status, reset) => {
        if(this.getPropertyValue("isRunning"))
            throw new Error("Timer already running!");

        this.setPropertyValue('isRunning', true);
        this.setPropertyValue("id",window.setInterval(() => {
             switch(status)
             {
                 case WORK:
                    if(workTime == '0') {
                        this.getPropertyValue('dispatch')(changeStatus(BREAK));
                        status = BREAK;
                    }
                    else
                        workTime--;
                    break;
                 case BREAK:
                     if(breakTime == '0')
                     {
                         let st = reset();
                         workTime = st.work;
                         breakTime = st.break;
                         this.getPropertyValue('dispatch')(changeStatus(WORK))
                         status = WORK;
                     }
                     else
                         breakTime--;
                     break;
                 default:
             }
             console.log(workTime, breakTime);
             this.getPropertyValue('dispatch')(setTimer(workTime, breakTime));
         }, 1000));
    }

    stop = () => {
        if(this.getPropertyValue("isRunning")) {
            clearInterval(this.getPropertyValue("id"));
            this.setPropertyValue('isRunning', false);
        }
        else
            throw new Error("Timer not running");
    }

    isRunning = () => this.getPropertyValue('isRunning');
}

let TimerInstance;
let createTimerInstance = (dispatch) => {
    TimerInstance = Object.freeze(new Timer(dispatch));
    return TimerInstance;
}

export {createTimerInstance, TimerInstance};
