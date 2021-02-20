import {v4 as uuidv4} from 'uuid';
import faker from 'faker';

export default interface Task {
    readonly uuid: string
    readonly description: string
    readonly firstOccurrence: number
    readonly regularity: number
}

export const randomTask = (): Task => {
    const nowInMs = new Date().getTime()
    const upTo1MonthDurationInMs = faker.random.number(30*24*60*60*1000)
    const upToDuration = nowInMs + faker.random.number(upTo1MonthDurationInMs);

    return {
        uuid: uuidv4(),
        description: faker.random.arrayElement([..."🎫🧺🛶🎶💻🧭💃⚽"]),
        firstOccurrence: upToDuration,
        regularity: upTo1MonthDurationInMs,
    }
}

export const durationUntil = (task: Task): number => {
    return task.firstOccurrence - new Date().getTime();
}

export const percentageElapsedSincePreviousOccurrence = (task: Task): number => {
    const regularity = task.regularity;
    return (regularity - durationUntil(task)) / regularity * 100;
}
