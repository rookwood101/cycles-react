import {v4 as uuidV4} from 'uuid';
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

const emojis = [..."😂❤️😍🤣😊🙏💕😭😘👍"]

export const randomTask = (): Task => {
    return {
        uuid: uuidV4(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        description: "Lorem ipsum",
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
