import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import faker from 'faker';

export default class Task {
    public readonly description: string;
    public readonly regularity: moment.Duration;
    private readonly nextOccurence: moment.Moment;
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

    public static randomTask() {
        return new Task(
            faker.random.arrayElement([..."🎫🧺🛶🎶💻🧭💃⚽"]),
            moment.duration(faker.random.number(24*60), "minutes"), // up to 1 day
            moment(faker.date.future(1)), // up to 1 year in the future
        );
    }
}