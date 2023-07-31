import React from "react";

class Clock extends React.Component {
    constructor(props) {
        super(props);

    }
    handleClick = () => {
        this.props.startTimer();
    }

    handleClick2 = () => {
        this.props.stopTimer();
    }

    handleClick3 = () => {
        this.props.setDefaultValues((this.props.default().work - 10), this.props.default().break);
    }

    handleClick4 = () => {
        this.props.setDefaultValues((this.props.default().work + 10), this.props.default().break);

    }

    render() {
       return(
           <div>
        <h1>{this.props.work}</h1>
        <h2>{this.props.break}</h2>
               <h3>{this.props.status}</h3>
               <button onClick={this.handleClick} >start</button>
               <button onClick={this.handleClick2}>stop</button>
               <button onClick={this.handleClick3}>increment</button>
               <button onClick={this.handleClick4}>decrement</button>
           </div>
       );
    }
}

export default Clock;