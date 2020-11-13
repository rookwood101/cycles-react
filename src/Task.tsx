import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import faker from 'faker';

export default class Task {
    public readonly description: string;
    public readonly regularity: moment.Duration;
    public readonly nextOccurence: moment.Moment;
    public readonly uuid: string;

    public constructor(description: string,
                       regularity: moment.Duration,
                       nextOccurence: moment.Moment) {
        this.description = description;
        this.regularity = regularity;
        this.nextOccurence = nextOccurence;
        this.uuid = uuidv4();
    }

    public readonly durationUntil = (): moment.Duration => {
        return moment.duration(this.nextOccurence.diff(moment.now()));
    }

    public readonly percentageElapsedSincePreviousOccurence = (): number => {
        const regularity = this.regularity.asMilliseconds();
        const durationUntil = this.durationUntil().asMilliseconds();
        return (regularity - durationUntil) / regularity * 100;
    }

    public static randomTask() {
        const upTo1MonthDuration = moment.duration(faker.random.number(30*24*60), "minutes");
        const upToDuration = moment(faker.date.between(moment().toDate(), moment().add(upTo1MonthDuration).toDate()));

        return new Task(
            faker.random.arrayElement([..."🎫🧺🛶🎶💻🧭💃⚽"]),
            upTo1MonthDuration,
            upToDuration,
        );
    }
}