import { FunctionalComponent, h } from 'preact';
import PercentageCircle from './PercentageCircle';
import Task from './Task';

interface TaskCircleProps {
    task: Task,

    radius: number,
    positionOffset: [number, number],
    thickness: number,

    onMouseEnter: () => void,
    onMouseLeave: () => void,
}

const TaskCircle: FunctionalComponent<TaskCircleProps> = (props) => {
    return (
        <PercentageCircle
            percentage={props.task.percentageElapsedSincePreviousOccurence()}
            radius={props.radius}
            positionOffset={props.positionOffset}
            thickness={props.thickness}
            key={props.task.uuid}
            text={props.task.description}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    );
}

export default TaskCircle;
