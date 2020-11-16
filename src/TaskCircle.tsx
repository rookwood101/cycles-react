import React from 'react';
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

const TaskCircle: React.FC<TaskCircleProps> = (props) => {
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
