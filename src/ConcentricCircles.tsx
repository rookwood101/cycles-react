import React  from 'react';
import PercentageCircle from './PercentageCircle';
import Task from './Task';
import TaskCircle from './TaskCircle';

interface ConcentricCirclesProps {
    showTaskDetail: (task: Task) => (() => void),
    hideTaskDetail: () => void,
}

const viewBox = 105;
const maxRadius = viewBox / 2.0;
const maxStrokeWidth = 3;

const distributeAlongCurve = (inputMin: number, inputMax: number, outputMin: number, outputMax: number, input: number): number => {
    return (input - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin;
}

const renderCircle = (props: ConcentricCirclesProps, task: Task, tasks: Task[]): React.ReactElement => {
    return (
        // TODO: implement click and drag to move circles
        <TaskCircle
            key={task.uuid}
            task={task}
            radius={distributeAlongCurve(
                0,
                tasks.length - 1,
                1,
                maxRadius,
                tasks.indexOf(task),
            )}
            positionOffset={[viewBox/2, viewBox/2]}
            thickness={distributeAlongCurve(
                0,
                1,
                0.5,
                maxStrokeWidth,
                (task.regularity.asSeconds() - task.durationUntil().asSeconds()) / task.regularity.asSeconds(),
            )}
            onMouseEnter={props.showTaskDetail(task)}
            onMouseLeave={props.hideTaskDetail}
        />
    );
};

const ConcentricCircles: React.FC<ConcentricCirclesProps> = (props) => {
    const [tasks] = React.useState(
        Array.from(
            {length: 10},
            () => Task.randomTask()
        ).sort(
            (a, b) => a.regularity.asSeconds() - b.regularity.asSeconds()
        )
    );

    const circles = tasks.map((task) => {
        return renderCircle(props, task, tasks);
    });

    return (
        <svg
            viewBox={`0 0 ${viewBox} ${viewBox}`}
        >
            {circles}
        </svg>
    );
};
export default ConcentricCircles;
