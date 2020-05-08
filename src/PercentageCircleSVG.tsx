import React from 'react';

interface PercentageCircleProps {
    percent: number,
    radius: number,
}

export default class PercentageCircle extends
        React.PureComponent<PercentageCircleProps, {}> {

    public constructor(props: PercentageCircleProps) {
        super(props);
    }

    readonly #circumference = (): number => {
        return 2 * Math.PI * this.props.radius;
    }

    readonly #diameter = (): number => {
        return 2 * this.props.radius;
    }

    readonly #radius = (): number => {
        return this.props.radius;
    }

    readonly #viewBox = (): number => {
        return this.#diameter() + 1;
    }

    readonly #percentageStrokeDashArray = (): string => {
        const fractionOfCircumference = this.props.percent / 100 * this.#circumference();
        return `${fractionOfCircumference}, ${this.#circumference()}`;
    }

    public render() {
        return (
            <svg viewBox={`0 0 ${this.#viewBox()} ${this.#viewBox()}`}>
                <path
                    d={`M ${this.#viewBox()/2} 0.5
                        a ${this.#radius()} ${this.#radius()} 0 0 1 0 ${this.#diameter()}
                        a ${this.#radius()} ${this.#radius()} 0 0 1 0 -${this.#diameter()}`}
                    fill="none"
                    stroke="#444"
                    strokeWidth="1"
                    strokeDasharray={this.#percentageStrokeDashArray()}
                />
            </svg>
        );
    }
}