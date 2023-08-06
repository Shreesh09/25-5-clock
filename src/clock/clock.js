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
import { CircularProgressbarWithChildren} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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

function useProgress(status, workTime, breakTime, defaultVal)
{
    switch (status) {
        case 'work':
            return workTime/defaultVal().work*100;
        case 'break':
            return breakTime/defaultVal().break*100;
    }
}

function TimerBox() {
    const context = useContext(propsContext);
    const {dispatch,status,workTime,breakTime, defaultVal} = context;
    const progress = useProgress(status, workTime, breakTime, defaultVal);
    const playSound = useRef(null);
    if(progress === 0) {
        playSound.current.currentTime=0;
        playSound.current.play();
    }
    return (
        <div id="timer-box">
            <audio ref={playSound}  preload="auto" id="beep" src={"https://drive.google.com/uc?export=view&id=1wj3P8_oVrvuV7Q9Y7_16iMxqaVi-35nS"}></audio>
            <CircularProgressbarWithChildren value={progress}>
            <p id={"timer-left"}>{useConvertToMinutes( status == 'work' ? workTime:breakTime)}</p>
            </CircularProgressbarWithChildren>
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
    let name =<p className="label-name" id={`${type}-label`}>{`${title} Length`}</p>;
    if(type == 'break')
        name = <p className="label-name" id={`${type}-label`}>&nbsp;&nbsp;&nbsp;&nbsp;{`${title} Length`}</p>;
    return (
    <div className="label" id={`${type}-box`}>
        {name}
        <div id="def">
            <div onClick={dispatchDec} id={`${type}-decrement`}><FontAwesomeIcon className="icons" icon={faArrowDown} />
            </div>
            <p className="default-values" id="session-length">{useConvertToMinutes(type == 'session'?defaultVal().work:defaultVal().break)}</p>
            <div onClick={dispatchInc} id={`${type}-increment`}><FontAwesomeIcon className="icons" icon={faArrowUp} /></div>
        </div>
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
                       document.getElementById('start').classList.remove('invisible');
                       document.getElementById('start').classList.remove('movePause');
                       document.getElementById('pause').classList.remove('movePause');
                       document.getElementById('pause').classList.add('invisible');
                       document.getElementById('stop').classList.add('invisible');
                       document.getElementById('stop').classList.remove('moveStop');
                       document.getElementById('beep').currentTime = 0;
                       document.getElementById('beep').pause();
                       dispatch(reset())
                       dispatch(setDefault({work: 25 * 60, breakTime: 5 * 60}));
                   }
               } id={"reset"}><FontAwesomeIcon id={"reset-icon"} className="icons" icon={faArrowRotateLeft} /></div>
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