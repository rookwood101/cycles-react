import {v4 as uuidV4} from 'uuid';
import faker from 'faker';
import Schedule, { nextOccurrence , previousOccurrenceIgnoreStart, randomSchedule } from './Schedule';
import { DateTime } from 'luxon';

export default interface Task {
    readonly uuid: string
    readonly emoji: string
    readonly description: string
    readonly schedule: Schedule
}

export interface CachedTask extends Task {
    readonly durationUntil: number,
    readonly intervalBetween: number
    readonly fractionOfCycle: number
}

export const cacheTask = (task: Task): CachedTask => {
    return {
        ...task,
        durationUntil: durationUntil(task),
        intervalBetween: intervalBetween(task),
        fractionOfCycle: fractionOfCycle(task),
    }
}

export const randomTask = (): Task => {
    return {
        uuid: uuidV4(),
        emoji: faker.random.arrayElement([..."🎫🧺🛶🎶💻🧭💃⚽"]),
        description: faker.random.words(3),
        schedule: randomSchedule()
    }
}

const durationUntil = (task: Task): number => {
    const now = DateTime.now().toMillis()
    return nextOccurrence(now, task.schedule) - now
}

const intervalBetween = (task: Task): number => {
    const now = DateTime.now().toMillis()
    const next = nextOccurrence(now, task.schedule)
    const previous = previousOccurrenceIgnoreStart(next, task.schedule)
    return next - previous;
} 

const fractionOfCycle = (task: Task): number => {
    const interval = intervalBetween(task)

    return Math.max(0, (interval - durationUntil(task)) / interval);
}
