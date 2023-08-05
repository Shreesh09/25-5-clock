import React from "react";
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

function convertToMinutes(time)
{
    let m = Math.trunc(time / 60);
    let minutes = m < 10 ? `0${m}` : `${m}`;
    let s = time - (60 * m);
    let seconds = s < 10 ? `0${s}` : `${s}`;
    return `${minutes}:${seconds}`;
}

const switchState = (status) => {
    const body = document.getElementById('body');
    if(body != null) {
        let r  = document.querySelector(':root');
        switch(status)
        {
            case 'work':
                r.style.setProperty('--op', 0);
                break;
            case 'break':
                r.style.setProperty('--op', 1);
                break;
            default:
        }
    }
}

export function Clock () {
    const dispatch = useDispatch();
    const status = useSelector(selectStatus);
    const workTime = useSelector(selectWork);
    const breakTime = useSelector(selectBreak);
    const defaultVal = getDefault;
    switchState(status);
       return(
           <div id="background">
           <div id="body">
               <div id="timer-box">
                   <p id="timer-label">{useSelector(selectStatus)}</p>
                   <p id={"timer-left"}>{convertToMinutes( status == 'work' ? workTime:breakTime)}</p>
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
               <div className="label" id={"session-box"}>
                   <p className="label-name" id="session-label">Session Length</p>
                   <div onClick={
                       () => {
                           dispatch(setDefault({work: defaultVal().work - 60, breakTime: defaultVal().break}))}
                   } id="session-decrement"><FontAwesomeIcon className="icons" icon={faArrowDown} /></div>
                   <p className="default-values" id="session-length">{convertToMinutes(defaultVal().work)}</p>
                   <div onClick={
                       () => {dispatch(setDefault({work: defaultVal().work + 60, breakTime: defaultVal().break}))}
                   } id="session-increment"><FontAwesomeIcon className="icons" icon={faArrowUp} /></div>
               </div>
               <div className="label"  id={"break-box"}>
                   <p className="label-name" id="break-label">Break Length</p>
                   <div onClick={
                       ()=>{dispatch(setDefault({work: defaultVal().work, breakTime: defaultVal().break-60}))}
                   } id="break-decrement"><FontAwesomeIcon className="icons" icon={faArrowDown} /></div>
                   <p className="default-values" id="break-length">{convertToMinutes(defaultVal().break)}</p>
                   <div onClick={
                       ()=>{dispatch(setDefault({work: defaultVal().work, breakTime: defaultVal().break+60}))}
                   } id="break-increment"><FontAwesomeIcon className="icons" icon={faArrowUp} /></div>
               </div>
           </div>
           </div>
       )
}

export default Clock;