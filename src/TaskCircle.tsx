import { FunctionComponent, createElement } from 'react';
import { useDispatch } from 'react-redux';
import PercentageCircle from './PercentageCircle';
import { deleteTask } from './redux/tasksSlice';
import { CachedTask } from './domain/Task';

interface TaskCircleProps {
    task: CachedTask,

    radius: number,
    positionOffset: [number, number],
    thickness: number,

    onMouseEnter: () => void,
    onMouseLeave: () => void,
}

const TaskCircle: FunctionComponent<TaskCircleProps> = (props) => {
    const dispatch = useDispatch();

    return (
        <PercentageCircle
            percentage={props.task.fractionOfCycle*100}
            radius={props.radius}
            positionOffset={props.positionOffset}
            thickness={props.thickness}
            key={props.task.uuid}
            text={props.task.emoji}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
            onMouseDown={(e) => {
                if(e?.ctrlKey) {
                    dispatch(deleteTask(props.task.uuid))
                }
            }}
        />
    );
}

export default TaskCircle;
