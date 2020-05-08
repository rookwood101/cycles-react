import React from 'react';
import './PercentageCircle.css';

interface PercentageCircleProps {
    percent: number
}

export default class PercentageCircle extends
        React.PureComponent<PercentageCircleProps, {}> {

    readonly #transformStyle = (): React.CSSProperties => {
        return {
            transform: `rotate(${this.props.percent / 100 * 180}deg)`
        };
    };
    
    public render() {
        return (
            <div>
                <div className="circle-wrap">
                    <div className="circle">
                        <div className="mask full" style={this.#transformStyle()}>
                            <div className="fill" style={this.#transformStyle()}></div>
                        </div>

                        <div className="mask half">
                            <div className="fill" style={this.#transformStyle()}></div>
                        </div>

                        <div className="inside-circle">
                            {this.props.percent}%
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}