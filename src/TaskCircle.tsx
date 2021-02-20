import { FunctionalComponent, h } from 'preact';
import { useDispatch } from 'react-redux';
import PercentageCircle from './PercentageCircle';
import { addTask, deleteTask } from './redux/tasksSlice';
import Task, { percentageElapsedSincePreviousOccurrence, randomTask } from './Task';

interface TaskCircleProps {
    task: Task,

    radius: number,
    positionOffset: [number, number],
    thickness: number,

    onMouseEnter: () => void,
    onMouseLeave: () => void,
}

const TaskCircle: FunctionalComponent<TaskCircleProps> = (props) => {
    const dispatch = useDispatch();

    return (
        <PercentageCircle
            percentage={percentageElapsedSincePreviousOccurrence(props.task)}
            radius={props.radius}
            positionOffset={props.positionOffset}
            thickness={props.thickness}
            key={props.task.uuid}
            text={props.task.description}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            onMouseDown={() => dispatch(addTask(randomTask()))}
        />
    );
}

export default TaskCircle;
