import React  from 'react';
import PercentageCircleSVG from './PercentageCircleSVG';
import Task from './Task';

interface ConcentricCirclesProps {
    percentage: number,
}

export default class ConcentricCircles extends
        React.PureComponent<ConcentricCirclesProps, {}> {

    private readonly tasks = Array.from({length: 10}, () => Task.randomTask());

    private readonly viewBox = 105;

    private readonly renderCircle = (task: Task): React.ReactElement => {
        return (
            <PercentageCircleSVG
                percentage={this.props.percentage}
                radius={task.regularity.asMinutes()}
                viewBox={this.viewBox}
                strokeWidth={task.durationUntil().asYears()}
                key={task.uuid}/>
        );
    };

    private readonly render10Circles = (): React.ReactElement[] => {

        let result = this.tasks.map((task, i) => {
            // Each should have an ID https://fb.me/react-warning-keys
            return this.renderCircle(task);
        });
        return result;
    }

    
    
    public render() {
        return (
            <svg viewBox={`0 0 ${this.viewBox} ${this.viewBox}`}>
                {this.render10Circles()}
            </svg>
        );
    }
}