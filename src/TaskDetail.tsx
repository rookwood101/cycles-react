import { FunctionComponent, createElement } from 'react';
import Task, { durationUntil, intervalBetweenOccurrences } from './domain/Task';
import humanizeDuration from 'humanize-duration';
import { DateTime } from 'luxon';
import { nextOccurrence } from './domain/Schedule';

interface TaskDetailProps {
    task: Task | null,
}

const TaskDetail: FunctionComponent<TaskDetailProps> = (props) => {
    if (props.task !== null) {
        const now = DateTime.now().toMillis()
        const nextOccurrenceFormatted = DateTime.fromMillis(nextOccurrence(now, props.task.schedule)).toLocaleString({
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        return (
            <div style={{position: "absolute", top:0, left:0}}>
                <p>Selected Task</p>
                <p>UUID: {props.task.uuid}</p>
                <p>Description: {props.task.description}</p>
                <p>Occurs every {humanizeDuration(intervalBetweenOccurrences(props.task), { largest: 2 })}</p>
                <p>Next occurrence in {humanizeDuration(durationUntil(props.task), { largest: 2 })} on {nextOccurrenceFormatted}</p>
            </div>
        );
    } else {
        return null;
    }
}

export default TaskDetail;
