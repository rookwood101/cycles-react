import moment from 'moment';
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

    private readonly tasks = Array.from(
        {length: 10},
        () => Task.randomTask()
    ).sort(
        (a, b) => a.regularity.asSeconds() - b.regularity.asSeconds()
    );

    private readonly distributeAlongCurve = (inputMin: number, inputMax: number, outputMin: number, outputMax: number, input: number): number => {
        return (input - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
    }

    private readonly renderCircle = (task: Task): React.ReactElement => {
        return (
            // TODO: move task deconstruction into new class TaskCircle
            <PercentageCircleSVG 
                percentage={task.percentageElapsedSincePreviousOccurence()}
                radius={this.distributeAlongCurve(
                    0,
                    this.tasks.length - 1,
                    1,
                    this.maxRadius,
                    this.tasks.indexOf(task),
                )}
                viewBox={this.viewBox}
                strokeWidth={this.distributeAlongCurve(
                    0,
                    1,
                    0.5,
                    this.maxStrokeWidth,
                    (task.regularity.asSeconds() - task.durationUntil().asSeconds()) / task.regularity.asSeconds(),
                )}
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
            <svg
                viewBox={`0 0 ${this.viewBox} ${this.viewBox}`}
            >
                {this.render10Circles()}
            </svg>
        );
    }
}