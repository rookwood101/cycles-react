import React from 'react';

interface PercentageCircleProps {
    percentage: number,
    radius: number,
    viewBox: number,
    strokeWidth: number,
    text: string,
    onMouseEnter: (event: React.MouseEvent<Element, MouseEvent>) => void,
    onMouseLeave: (event: React.MouseEvent<Element, MouseEvent>) => void,
}

// animate to a percentage

export default class PercentageCircle extends
        React.PureComponent<PercentageCircleProps, {}> {

    public constructor(props: PercentageCircleProps) {
        super(props);
    }

    private readonly circumference = (): number => {
        return 2 * Math.PI * this.props.radius;
    }

    private readonly diameter = (): number => {
        return 2 * this.props.radius;
    }

    private readonly radius = (): number => {
        return this.props.radius;
    }

    private readonly viewBox = (): number => {
        return this.props.viewBox;
    }

    private readonly percentage = (): number => {
        return this.props.percentage;
    }

    private readonly percentageStrokeDashArray = (): string => {
        const fractionOfCircumference = this.props.percentage / 100 * this.circumference();
        return `${fractionOfCircumference}, ${this.circumference()}`;
    }

    private readonly strokeWidth = (): number => {
        return this.props.strokeWidth;
    }

    private readonly tipCoordinate = (): [number, number] => {
        const angle = this.percentage() / 100 * 2 * Math.PI;
        const radius = this.radius();
        const xOffset = this.viewBox() / 2;
        const yOffset = this.viewBox() / 2;
        return [radius * Math.sin(angle) + xOffset, -radius * Math.cos(angle) + yOffset];
    }

    public render() {
        const [tipX, tipY] = this.tipCoordinate();
        return (
            <g
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
            >
                <path
                    d={`M ${this.viewBox()/2} ${this.viewBox()/2 - this.radius()}
                        a ${this.radius()} ${this.radius()} 0 0 1 0 ${this.diameter()}
                        a ${this.radius()} ${this.radius()} 0 0 1 0 -${this.diameter()}`}
                    fill="none"
                    stroke="#444"
                    strokeWidth={this.strokeWidth()}
                    strokeDasharray={this.percentageStrokeDashArray()}
                    strokeLinecap="round"
                />
                <text
                    x={tipX}
                    y={tipY}
                    style={{fontSize: "1px"}}
                >
                    {this.props.text}
                </text>
            </g>
        );
    }
}