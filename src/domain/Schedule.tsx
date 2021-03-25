import { DateTime } from "luxon";
import { unreachableCase } from "ts-assert-unreachable";

export default interface Schedule {
    readonly startTime: string // 2016-05-25T09
    readonly repetitionRule: RepetitionRule
}

export const randomSchedule = (): Schedule => {
    const typicalRanges: Map<RepetitionRule["periodicity"], [number, number]> = new Map([
        ["day", [1, 14]],
        ["week", [1, 8]],
        ["day of month", [1, 18]],
        ["weekday of month", [1, 2]],
        ["year", [1, 4]],
    ])
    const periodicity = [...typicalRanges.keys()][Math.floor(Math.random() * typicalRanges.size)]
    const multipleRange = typicalRanges.get(periodicity)!
    const start = DateTime.now().minus({ months: 1 }).toMillis()
    const end = DateTime.now().plus({ months: 1 }).toMillis()
    return {
        startTime: DateTime.fromMillis(start + Math.random() * (end-start)).toISODate(),
        repetitionRule: {
            periodicity: periodicity,
            multiple: multipleRange[0] + Math.floor(Math.random() * (multipleRange[1] - multipleRange[0])),
        }
    }
}

export const periodicities = [
    "day",
    "week",
    "day of month",
    "weekday of month",
    "year",
] as const

export interface RepetitionRule {
    readonly periodicity: typeof periodicities[number]
    readonly multiple: number
}

const weekLength = 7
export const weekdayOfMonth = (dateTime: DateTime): number => {
    return Math.ceil(1.0 * dateTime.day / weekLength)
}

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
        case "weekday of month":
            return (dateTime) => {
                const monday = dateTime.plus({ months: multiple }).startOf("month").startOf("week")
                return monday.plus({ days: (dateTime.weekday - monday.weekday) + weekLength * (weekdayOfMonth(dateTime) - 1) })
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

export const appendOrdinal = (n: number): string => {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) {
        return n + "st";
    }
    if (j === 2 && k !== 12) {
        return n + "nd";
    }
    if (j === 3 && k !== 13) {
        return n + "rd";
    }
    return n + "th"; 
}

export const prettyPrintRepetitionRule = (schedule: Schedule): string => {
    const periodicity = schedule.repetitionRule.periodicity
    const start = DateTime.fromISO(schedule.startTime)
    const n = schedule.repetitionRule.multiple

    switch (periodicity) {
        case "day":
            return n === 1 ? `day` : `${n} days`
        case "week":
            return n === 1 ? start.weekdayLong : `${n} ${start.weekdayLong}s`
        case "day of month":
            return n === 1 ? `month` : `${n} months`
        case "weekday of month":
            return (n === 1 ? `month` : `${n} months`) + ` on the ${appendOrdinal(weekdayOfMonth(start))} ${start.weekdayLong}`
        case "year":
            return n === 1 ? `year` : `${n} years`
        default:
            return unreachableCase(periodicity)
    }
}
