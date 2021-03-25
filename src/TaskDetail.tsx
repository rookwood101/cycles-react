import { FunctionComponent, createElement } from 'react';
import { CachedTask } from './domain/Task';
import humanizeDuration from 'humanize-duration';
import { DateTime } from 'luxon';
import { prettyPrintRepetitionRule } from './domain/Schedule';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Card, ListGroup } from 'react-bootstrap';

interface TaskDetailProps {
    task: CachedTask | null,
}

const TaskDetail: FunctionComponent<TaskDetailProps> = (props) => {
    if (props.task !== null) {
        const now = DateTime.now().toMillis()
        const nextOccurrenceFormatted = DateTime.fromMillis(now + props.task.durationUntil).toLocaleString({
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
        return (
            <Card style={{position: "absolute", top:0, left:0}}>
                <Card.Header>{props.task.emoji} {props.task.description}</Card.Header>
                <ListGroup>
                    <ListGroup.Item>Every {prettyPrintRepetitionRule(props.task.schedule)}</ListGroup.Item>
                    <ListGroup.Item>Next occurrence in {humanizeDuration(props.task.durationUntil, { largest: 2 })} on {nextOccurrenceFormatted}</ListGroup.Item>
                    <ListGroup.Item>{props.task.uuid}</ListGroup.Item>
                </ListGroup>
            </Card>
        );
    } else {
        return null;
    }
}

export default TaskDetail;
