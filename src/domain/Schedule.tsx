import faker from "faker";
import { DateTime } from "luxon";
import { unreachableCase } from "ts-assert-unreachable";

export default interface Schedule {
    readonly startTime: string // 2016-05-25T09
    readonly repetitionRule: RepetitionRule
}

export const randomSchedule = (): Schedule => {
    const nowInMs = DateTime.now().toMillis()
    const upTo1MonthDurationInMs = faker.random.number(30*24*60*60*1000)
    const twoMonthWindow = nowInMs - upTo1MonthDurationInMs + faker.random.number(2 * upTo1MonthDurationInMs)
    return {
        startTime: DateTime.fromMillis(twoMonthWindow).toISODate(),
        repetitionRule: {
            periodicity: faker.random.arrayElement(["day", "week", "day of month", "week of month", "year"]),
            multiple: faker.random.number({min: 1, max: 12}),
        }
    }
}

type RepetitionRule = DayRepetition | WeekRepetition | DayOfMonthRepetition | WeekOfMonthRepetition | YearRepetition

interface Repetition {
    readonly periodicity: string
    readonly multiple: number
}

// type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
// type DayOfMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31

interface DayRepetition extends Repetition {
    periodicity: "day"
}

interface WeekRepetition extends Repetition {
    periodicity: "week"
}

interface DayOfMonthRepetition extends Repetition {
    periodicity: "day of month"
}

interface WeekOfMonthRepetition extends Repetition {
    periodicity: "week of month"
}

interface YearRepetition extends Repetition {
    periodicity: "year"
}

// TODO: USE rSchedule?

const repeatFunction = (schedule: Schedule, step: number = 1): ((dateTime: DateTime) => DateTime) => {
    const periodicity = schedule.repetitionRule.periodicity
    const multiple = schedule.repetitionRule.multiple * step

    switch (periodicity) {
        case "day":
            return (dateTime) => dateTime.plus({ days: multiple })
        case "week":
            return (dateTime) => dateTime.plus({ weeks: multiple })
        case "day of month":
            return (dateTime) => dateTime.plus({ months: multiple })
        case "week of month":
            return (dateTime) => {
                const weekLength = 7
                let weekOfMonth = Math.ceil(1.0 * dateTime.day / weekLength)
                const monday = dateTime.plus({ months: multiple }).startOf("month").startOf("week")
                return monday.plus({ days: (dateTime.weekday - monday.weekday) + weekLength * (weekOfMonth - 1) })
            }
        case "year":
            return (dateTime) => dateTime.plus({ years: multiple })
        default:
            return unreachableCase(periodicity)
    }
}

export const nextOccurrence = (afterTimestamp: number, schedule: Schedule): number => {
    const scheduleStart = DateTime.fromISO(schedule.startTime)
    const after = DateTime.fromMillis(afterTimestamp)
    let nextFn = repeatFunction(schedule)

    let occurrence = scheduleStart
    while (occurrence < after) {
        occurrence = nextFn(occurrence)
    }

    return occurrence.toMillis()
}

export const previousOccurrence = (beforeTimestamp: number, schedule: Schedule): number | null => {
    const scheduleStart = DateTime.fromISO(schedule.startTime)
    const before = DateTime.fromMillis(beforeTimestamp)
    const nextFn = repeatFunction(schedule)

    let previous = null
    let occurrence = scheduleStart
    while (occurrence < before) {
        previous = occurrence
        occurrence = nextFn(previous)
    }

    return previous?.toMillis() ?? null
}

export const previousOccurrenceIgnoreStart = (beforeTimestamp: number, schedule: Schedule): number => {
    const scheduleStart = DateTime.fromISO(schedule.startTime)
    const before = DateTime.fromMillis(beforeTimestamp)
    const nextFn = repeatFunction(schedule)

    let previous = null
    let occurrence = scheduleStart
    while (occurrence < before) {
        previous = occurrence
        occurrence = nextFn(previous)
    }

    const prevFn = repeatFunction(schedule, -1)

    return previous?.toMillis() ?? prevFn(scheduleStart).toMillis()
}

