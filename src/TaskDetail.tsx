import React from 'react';
import Task from './Task';

interface TaskDetailProps {
    task: Task | null,
}

export default class TaskDetail extends
        React.PureComponent<TaskDetailProps, {}> {

    public constructor(props: TaskDetailProps) {
        super(props);
    }

    public render() {
        if (this.props.task !== null) {
            return (
                <div style={{position: "absolute", top:0, left:0}}>
                    <p>Selected Task</p>
                    <p>UUID: {this.props.task.uuid}</p>
                    <p>Description: {this.props.task.description}</p>
                    <p>Regularity: {this.props.task.regularity.humanize()}</p>
                    <p>Next occurence {this.props.task.nextOccurence.toISOString()}</p>
                    <p>Duration until: {this.props.task.durationUntil().humanize()}</p>
                </div>
            );
        } else {
            return null;
        }
    }
}