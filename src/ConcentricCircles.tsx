import React  from 'react';
import PercentageCircleSVG from './PercentageCircleSVG';
import Task from './Task';

interface ConcentricCirclesProps {
    percentage: number,
    showTaskDetail: (task: Task) => ((event: React.MouseEvent<Element, MouseEvent>) => void),
    hideTaskDetail: () => void,
}

export default class ConcentricCircles extends
        React.PureComponent<ConcentricCirclesProps, {}> {
    
    // TODO: this class should manage one circle and animate it to it's current %
    private readonly viewBox = 105;
    private readonly maxRadius = this.viewBox / 2.0;
    private readonly maxStrokeWidth = 3;

    private readonly tasks = Array.from({length: 10}, () => Task.randomTask());

    private readonly distributeAlongCurve = (inputMin: number, inputMax: number, outputMin: number, outputMax: number, input: number): number => {
        return (input - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
    }

    private readonly renderCircle = (task: Task): React.ReactElement => {
        return (
            // TODO: move task deconstruction into new class TaskCircle
            <PercentageCircleSVG 
                percentage={this.props.percentage}
                radius={this.distributeAlongCurve(0, 24*60*60, 1, this.maxRadius, task.regularity.asSeconds())}
                viewBox={this.viewBox}
                strokeWidth={this.distributeAlongCurve(0, 365*24*60*60, 0.5, this.maxStrokeWidth, task.durationUntil().asSeconds())}
                key={task.uuid}
                text={task.description}
                onMouseEnter={this.props.showTaskDetail(task)}
                onMouseLeave={this.props.hideTaskDetail}
            />
        );
    };

    private readonly render10Circles = (): React.ReactElement[] => {

        return this.tasks.map((task, i) => {
            return this.renderCircle(task);
        });
    }

    
    
    public render() {
        return (
            <svg viewBox={`0 0 ${this.viewBox} ${this.viewBox}`}>
                {this.render10Circles()}
            </svg>
        );
    }
}