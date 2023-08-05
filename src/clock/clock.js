import React, {useContext, useDebugValue, useRef} from "react";
import {TimerInstance} from "../redux/timer_control";
import {useSelector, useDispatch} from "react-redux";
import {
    setDefault,
    start,
    stop,
    reset, getDefault,
} from "../redux/state_management";
import {
    selectWork,
    selectBreak,
    selectStatus,
} from "../redux/state_management";
import './clock_style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowDown, faArrowUp, faPause, faPlay, faStop} from "@fortawesome/free-solid-svg-icons";
import { createContext } from 'react';
const propsContext = createContext({});
function useConvertToMinutes(time)
{
    let m = Math.trunc(time / 60);
    let minutes = m < 10 ? `0${m}` : `${m}`;
    let s = time - (60 * m);
    let seconds = s < 10 ? `0${s}` : `${s}`;
    useDebugValue("useConvertToMinutes");
    return `${minutes}:${seconds}`;
}

function Body ({children}) {
    const context = useContext(propsContext);
    const {dispatch, status, workTime, breakTime, defaultVal} = context;

    const body = useRef(null);

    if (body != null) {
        let r = document.querySelector(':root');
        switch (status) {
            case 'work':
                r.style.setProperty('--op', 0);
                break;
            case 'break':
                r.style.setProperty('--op', 1);
                break;
            default:
        }
    }

    return (
        <div ref={body} id="body">
            {children}
        </div>
    );
}

function TimerBox() {
    const context = useContext(propsContext);
    const {dispatch,status,workTime,breakTime, defaultVal} = context;
    return (
        <div id="timer-box">
            <p id="timer-label">{useSelector(selectStatus)}</p>
            <p id={"timer-left"}>{useConvertToMinutes( status == 'work' ? workTime:breakTime)}</p>
            <div onClick={
                () => {
                    if(!TimerInstance.isRunning())
                        dispatch(start());
                    else
                        dispatch(stop());
                }
            } id="start-stop"><FontAwesomeIcon className="icons" icon={faPlay} /><FontAwesomeIcon  className="icons" icon={faPause} /></div>
            <div onClick={
                () => {
                    dispatch(reset())
                    dispatch(setDefault({work: 25 * 60, breakTime: 5 * 60}));
                }
            } id={"reset"}><FontAwesomeIcon className="icons" icon={faStop} /></div>
        </div>
    );
}

function Label ({type, dispatchInc, dispatchDec}) {
    const title = type.split("").map((char, i) => {
        if(i === 0)
            return char.toUpperCase();
        return char
    }).join("");
    const defaultVal = getDefault;
    return (
    <div className="label" id={`${type}-box`}>
        <p className="label-name" id={`${type}-label`}>{`${title} Length`}</p>
        <div onClick={dispatchDec} id={`${type}-decrement`}><FontAwesomeIcon className="icons" icon={faArrowDown} />
        </div>
        <p className="default-values" id="session-length">{useConvertToMinutes(type == 'session'?defaultVal().work:defaultVal().break)}</p>
        <div onClick={dispatchInc} id={`${type}-increment`}><FontAwesomeIcon className="icons" icon={faArrowUp} /></div>
    </div>);
}

export function Clock () {

    const context = useContext(propsContext);
    context.dispatch = useDispatch();
    context.status = useSelector(selectStatus);
    context.workTime = useSelector(selectWork);
    context.breakTime = useSelector(selectBreak);
    context.defaultVal = getDefault;
    const {dispatch,status,workTime,breakTime, defaultVal} = context;

    return(
           <propsContext.Provider value={context}>
           <div id="background">
           <Body>
               <TimerBox/>
               <Label type={"session"}
                      dispatchInc={()=>{dispatch(setDefault({work: defaultVal().work+60, breakTime: defaultVal().break}))}}
                      dispatchDec={()=>{dispatch(setDefault({work: defaultVal().work-60, breakTime: defaultVal().break}))}}
               />
               <Label type={"break"}
                      dispatchInc={()=>{dispatch(setDefault({work: defaultVal().work, breakTime: defaultVal().break + 60}))}}
                      dispatchDec={()=>{dispatch(setDefault({work: defaultVal().work, breakTime: defaultVal().break - 60}))}}
               />
           </Body>
           </div>
           </propsContext.Provider>
       )
}

export default Clock;