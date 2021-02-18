import { FunctionalComponent, h } from 'preact';
import Task from './Task';

interface TaskDetailProps {
    task: Task | null,
}

const TaskDetail: FunctionalComponent<TaskDetailProps> = (props) => {
    if (props.task !== null) {
        return (
            <div style={{position: "absolute", top:0, left:0}}>
                <p>Selected Task</p>
                <p>UUID: {props.task.uuid}</p>
                <p>Description: {props.task.description}</p>
                <p>Occurs every {props.task.regularity.humanize()}</p>
                <p>Next occurence in {props.task.durationUntil().humanize()} on {props.task.nextOccurence.toLocaleString()}</p>
            </div>
        );
    } else {
        return null;
    }
}

export default TaskDetail;
