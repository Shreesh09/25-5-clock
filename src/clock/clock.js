import React from "react";
import {TimerInstance} from "../redux/timer_control";
import './clock_style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPause, faPlay, faStop} from "@fortawesome/free-solid-svg-icons";

function convertToMinutes(time)
{
    let m = Math.trunc(time / 60);
    let minutes = m < 10 ? `0${m}` : `${m}`;
    let s = time - (60 * m);
    let seconds = s < 10 ? `0${s}` : `${s}`;
    return `${minutes}: ${seconds}`;
}

class Clock extends React.Component {
    constructor(props) {
        super(props);

    }
    handleStart = () => {
        if(TimerInstance.isRunning())
            this.props.stopTimer();
        else
            this.props.startTimer();
    }

    handleReset = () => {
        this.props.resetTimer();
        this.props.setDefaultValues(25*60, 5*60);
    }

    handleDecrement = (property) => {
        switch (property) {
            case 'work':
                return () => {this.props.setDefaultValues((this.props.default().work - 10), this.props.default().break)};
            case 'break':
                return ()=>{this.props.setDefaultValues((this.props.default().work), this.props.default().break - 10)};
            default:
        }
        }

    handleIncrement = (property) => {
        switch (property) {
            case 'work':
                return () => {this.props.setDefaultValues((this.props.default().work + 10), this.props.default().break)};
            case 'break':
            return () => {this.props.setDefaultValues((this.props.default().work), this.props.default().break + 10)};
            default:
        }
    }

    render() {
       return(
           <div id="background">
           <div id="body">
               <div id="timer-box">
                   <p id="timer-label">{this.props.status}</p>
                   <p id={"timer-left"}>{convertToMinutes(this.props[this.props.status])}</p>
                   <div onClick={this.handleStart} id="start-stop"><FontAwesomeIcon icon={faPlay} /><FontAwesomeIcon icon={faPause} /></div>
                   <div onClick={this.handleReset} id={"reset"}><FontAwesomeIcon icon={faStop} /></div>
               </div>
               <div className="label" id={"session-box"}>
                   <p id="session-label">Session Length</p>
                   <div onClick={this.handleDecrement('work')} id="session-decrement">work -</div>
                   <p id="session-length">{convertToMinutes(this.props.default().work)}</p>
                   <div onClick={this.handleIncrement('work')} id="session-increment">work +</div>
               </div>
               <div className="label"  id={"break-box"}>
                   <p id="break-label">Break Length</p>
                   <div onClick={this.handleDecrement('break')} id="break-decrement">break -</div>
                   <p id="break-length">{convertToMinutes(this.props.default().break)}</p>
                   <div onClick={this.handleIncrement('break')} id="break-increment">break +</div>
               </div>
           </div>
           </div>
       );
    }
}

export default Clock;