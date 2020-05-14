import React from 'react';

interface PercentageCircleProps {
    percentage: number,
    radius: number,
    viewBox: number,
    strokeWidth: number,
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
        return this.props.viewBox;
    }

    readonly #percentageStrokeDashArray = (): string => {
        const fractionOfCircumference = this.props.percentage / 100 * this.#circumference();
        return `${fractionOfCircumference}, ${this.#circumference()}`;
    }

    readonly #strokeWidth = (): number => {
        return this.props.strokeWidth;
    }

    public render() {
        return (
                <path
                    d={`M ${this.#viewBox()/2} ${this.#viewBox()/2 - this.#radius()}
                        a ${this.#radius()} ${this.#radius()} 0 0 1 0 ${this.#diameter()}
                        a ${this.#radius()} ${this.#radius()} 0 0 1 0 -${this.#diameter()}`}
                    fill="none"
                    stroke="#444"
                    strokeWidth={this.#strokeWidth()}
                    strokeDasharray={this.#percentageStrokeDashArray()}
                />
        );
    }
}