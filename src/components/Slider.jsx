import React from "react";
import { useEffect, Component } from "react"
import PropTypes from 'prop-types';

export default class Slider extends Component {

    firingEvent = false
    handleChange = (event) => {
        this.setState({ level: this.cap(event.target.value) }, this.fireChange)
    }

    handleWheel = (event) => {
        if (this.props.scrolling === false) return false;
        this.setState({ level: this.cap((this.state.level * 1) + Math.round(event.deltaY * -1 * 0.01)) }, this.fireChange)
    }

    fireChange = () => {
        if (this.firingEvent === false && this.props.onChange && typeof this.props.onChange == "function") {
            this.firingEvent = true
            this.props.onChange(this.cap(this.state.level) * 1, this)
            this.firingEvent = false
        }
    }

    toggleMonitor = () => {
        console.log('id', this.props.id);
        window.toggleMonitor(this.props.id);
    }

    getName = () => {
        if (this.props.name) {
            return (
                <div className="name-row">
                    <div className="icon">{(this.props.monitortype == "wmi" ? <span>&#xE770;</span> : <span>&#xE7F4;</span>)}</div>
                    <div className="title">{this.props.name}</div>
                    { this.props.monitortype == "ddcci" ? <div className="right-icon" onClick={this.toggleMonitor}><span>&#xE711;</span></div> : <span /> } 
                </div>
            )
        }
    }

    cap = (level) => {
        const min = (this.props.min || 0) * 1
        const max = (this.props.max || 100) * 1
        let capped = level * 1
        if (level < min) {
            capped = min
        } else if (level > max) {
            capped = max
        }
        return capped
    }

    progressStyle = () => {
        const min = (this.props.min || 0) * 1
        const max = (this.props.max || 100) * 1
        const level = this.cap((this.props.level || 0) * 1)
        return { width: (0 + (((level - min) * (100 / (max - min))))) + "%" }
    }

    constructor(props) {
        super(props);
        this.state = {
            level: this.cap((this.props.level === undefined ? 50 : this.props.level)),
        }
        this.fireChange()
    }

    componentDidUpdate(oldProps) {
        if (oldProps.max != this.props.max || oldProps.min != this.props.min) {
            this.setState({
                level: this.cap(this.props.level)
            }, this.fireChange())
        }
    }

    render() {
        const min = (this.props.min || 0) * 1
        const max = (this.props.max || 100) * 1
        const level = this.cap(this.props.level)
        return (
            <div className="monitor-item">
                {this.getName()}
                <div className="input--range">
                    <div className="rangeGroup">
                        <input type="range" min={min} max={max} value={level} data-percent={level + "%"} onChange={this.handleChange} onWheel={this.handleWheel} className="range" />
                        <div className="progress" style={this.progressStyle()}></div>
                    </div>
                    <input type="number" min={min} max={max} value={Math.floor(level)} onChange={this.handleChange} onWheel={this.handleWheel} className="val" />
                </div>
            </div>
        );
    }

};