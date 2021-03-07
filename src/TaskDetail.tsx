import { FunctionComponent, createElement } from 'react';
import { CachedTask } from './domain/Task';
import humanizeDuration from 'humanize-duration';
import { DateTime } from 'luxon';

interface TaskDetailProps {
    task: CachedTask | null,
}

const TaskDetail: FunctionComponent<TaskDetailProps> = (props) => {
    if (props.task !== null) {
        const now = DateTime.now().toMillis()
        const nextOccurrenceFormatted = DateTime.fromMillis(now + props.task.durationUntil).toLocaleString({
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        const repetitionRule = props.task.schedule.repetitionRule
        return (
            <div style={{position: "absolute", top:0, left:0}}>
                <p>Selected Task</p>
                <p>UUID: {props.task.uuid}</p>
                <p>Description: {props.task.description}</p>
                <p>Occurs every {`${repetitionRule.multiple} ${repetitionRule.periodicity}`}</p>
                <p>Next occurrence in {humanizeDuration(props.task.durationUntil, { largest: 2 })} on {nextOccurrenceFormatted}</p>
            </div>
        );
    } else {
        return null;
    }
}

export default TaskDetail;
