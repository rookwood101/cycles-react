import React from 'react';
import Task from './Task';

interface TaskDetailProps {
    task: Task | null,
}

const TaskDetail: React.FC<TaskDetailProps> = (props) => {
    if (props.task !== null) {
        return (
            <div style={{position: "absolute", top:0, left:0}}>
                <p>Selected Task</p>
                <p>UUID: {props.task.uuid}</p>
                <p>Description: {props.task.description}</p>
                <p>Regularity: {props.task.regularity.humanize()}</p>
                <p>Next occurence {props.task.nextOccurence.toISOString()}</p>
                <p>Duration until: {props.task.durationUntil().humanize()}</p>
            </div>
        );
    } else {
        return null;
    }
}

export default TaskDetail;
