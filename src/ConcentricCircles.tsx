import React  from 'react';
import PercentageCircle from './PercentageCircle';
import Task from './Task';

interface ConcentricCirclesProps {
    showTaskDetail: (task: Task) => ((event: React.MouseEvent<Element, MouseEvent>) => void),
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
        // TODO: move task deconstruction into new class TaskCircle
        // TODO: implement click and drag to move circles
        <PercentageCircle
            percentage={task.percentageElapsedSincePreviousOccurence()}
            radius={distributeAlongCurve(
                0,
                tasks.length - 1,
                1,
                maxRadius,
                tasks.indexOf(task),
            )}
            viewBox={viewBox}
            strokeWidth={distributeAlongCurve(
                0,
                1,
                0.5,
                maxStrokeWidth,
                (task.regularity.asSeconds() - task.durationUntil().asSeconds()) / task.regularity.asSeconds(),
            )}
            key={task.uuid}
            text={task.description}
            onMouseEnter={props.showTaskDetail(task)}
            onMouseLeave={props.hideTaskDetail}
        />
    );
};

const render10Circles = (props: ConcentricCirclesProps, tasks: Task[]): React.ReactElement[] => {
    return tasks.map((task, i) => {
        return renderCircle(props, task, tasks);
    });
}

const ConcentricCircles: React.FC<ConcentricCirclesProps> = (props) => {
    const [tasks] = React.useState(
        Array.from(
            {length: 10},
            () => Task.randomTask()
        ).sort(
            (a, b) => a.regularity.asSeconds() - b.regularity.asSeconds()
        )
    );

    return (
        <svg
            viewBox={`0 0 ${viewBox} ${viewBox}`}
        >
            {render10Circles(props, tasks)}
        </svg>
    );
};
export default ConcentricCircles;
