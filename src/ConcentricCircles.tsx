import React  from 'react';
import PercentageCircleSVG from './PercentageCircleSVG';

interface ConcentricCirclesProps {
    percentage: number,
}

export default class ConcentricCircles extends
        React.PureComponent<ConcentricCirclesProps, {}> {

    private readonly viewBox = 101;

    private readonly renderCircle = (radius: number, strokeWidth: number): React.ReactElement => {
        return (
            <PercentageCircleSVG
                percentage={this.props.percentage}
                radius={radius}
                viewBox={this.viewBox}
                strokeWidth={strokeWidth}/>
        );
    };
    
    public render() {
        return (
            <svg viewBox={`0 0 ${this.viewBox} ${this.viewBox}`}>
                {this.renderCircle(48, 5)}
                {this.renderCircle(25, 2)}
                {this.renderCircle(10, 1)}
            </svg>
        );
    }
}