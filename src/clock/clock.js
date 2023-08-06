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
import {faArrowDown, faArrowRotateLeft, faArrowUp, faPause, faPlay, faStop} from "@fortawesome/free-solid-svg-icons";
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

function StartStop () {
    const context = useContext(propsContext);
    const {dispatch,status,workTime,breakTime, defaultVal} = context;

    return (
        <div onClick={
            () => {
                if(TimerInstance.isRunning())
                    dispatch(start());
                else
                    dispatch(stop());
            }
        } id="start-stop">
            <FontAwesomeIcon id={"start"}  onClick={() => {

                document.getElementById('start').classList.add('invisible');
                const pause = document.getElementById('pause');
                if (pause != null) {
                    document.getElementById('start').classList.add('movePause');
                    pause.classList.remove('invisible');
                    pause.classList.add('movePause');

                }
                const stop = document.getElementById('stop');
                if(stop != null) {
                    stop.classList.remove('invisible');
                    stop.classList.add('moveStop');
                }
                dispatch(start());
            }} className="icons" icon={faPlay} />
            <FontAwesomeIcon id={"pause"}  onClick={() => {
                document.getElementById('pause').classList.add('invisible');
                const resume = document.getElementById('start');
                if (resume != null) {
                    document.getElementById('start').classList.remove('invisible');
                }
                dispatch(stop());
            }}  className="icons invisible" icon={faPause} />
            <FontAwesomeIcon id={"stop"} onClick={() => {
                document.getElementById('start').classList.remove('invisible');
                document.getElementById('start').classList.remove('movePause');
                document.getElementById('pause').classList.remove('movePause');
                document.getElementById('pause').classList.add('invisible');
                document.getElementById('stop').classList.add('invisible');
                document.getElementById('stop').classList.remove('moveStop');
                dispatch(reset());
            }} className="icons invisible" icon={faStop} />
        </div>
    );
}

function TimerBox() {
    const context = useContext(propsContext);
    const {dispatch,status,workTime,breakTime, defaultVal} = context;
    return (
        <div id="timer-box">
            <p id={"timer-left"}>{useConvertToMinutes( status == 'work' ? workTime:breakTime)}</p>
            <StartStop/>
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
               <div id={"box"}>
               <TimerBox/>
               <div onClick={
                   () => {
                       dispatch(reset())
                       dispatch(setDefault({work: 25 * 60, breakTime: 5 * 60}));
                   }
               } id={"reset"}><FontAwesomeIcon className="icons" icon={faArrowRotateLeft} /></div>
               </div>
               <p id="timer-label">{status.toUpperCase()}</p>
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