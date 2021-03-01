import {v4 as uuidv4} from 'uuid';
import faker from 'faker';
import Schedule, { nextOccurrence , previousOccurrenceIgnoreStart, randomSchedule } from './Schedule';
import { DateTime } from 'luxon';

export default interface Task {
    readonly uuid: string
    readonly description: string
    readonly schedule: Schedule
}

export const randomTask = (): Task => {
    return {
        uuid: uuidv4(),
        description: faker.random.arrayElement([..."🎫🧺🛶🎶💻🧭💃⚽"]),
        schedule: randomSchedule()
    }
}

export const durationUntil = (task: Task): number => {
    const now = DateTime.now().toMillis()
    return nextOccurrence(now, task.schedule) - now
}

export const intervalBetweenOccurrences = (task: Task): number => {
    const now = DateTime.now().toMillis()
    const next = nextOccurrence(now, task.schedule)
    const previous = previousOccurrenceIgnoreStart(next, task.schedule)
    return next - previous;
} 

export const percentageElapsedSincePreviousOccurrence = (task: Task): number => {
    const interval = intervalBetweenOccurrences(task)

    return (interval - durationUntil(task)) / interval * 100;
}
