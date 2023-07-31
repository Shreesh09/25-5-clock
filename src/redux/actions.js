import {SET, RESET, STOP, SET_DEFAULT, START, STATUS} from "./action_constants";

const setTimer = (work, breakTime) => ({
    type: SET,
    work: work,
    break: breakTime,
});

const startTimer = () => ({
    type: START,
})

const stopTimer = () => ({
    type: STOP,
});

const resetTimer = () => ({
    type: RESET,
});

const setDefaultValue = (work, breakTime) => ({
    type: SET_DEFAULT,
    work: work,
    break: breakTime,
});

const changeStatus = (status) => ({
    type: STATUS,
    status: status
});

export {setTimer, startTimer, stopTimer, resetTimer, setDefaultValue, changeStatus};