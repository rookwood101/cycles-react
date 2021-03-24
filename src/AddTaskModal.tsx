import 'bootstrap/dist/css/bootstrap.min.css'
import { DateTime } from 'luxon';
import { createElement, FormEvent, FunctionComponent, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {v4 as uuidV4} from 'uuid';
import produce from 'immer'

import Task, { randomTask } from "./domain/Task";
import { appendOrdinal, periodicities, RepetitionRule, weekdayOfMonth } from './domain/Schedule';

interface Props {
    isOpen: boolean
    handleClose: () => void
    handleSubmit: (task: Task) => void
}

interface FormState {
    description: string
    emoji: string
    startDate: string
    startTime: string
    multiple: string
    periodicity: string
}

interface ParsedFormState {
    description: string | null
    emoji: string | null
    startDateTime: DateTime | null
    multiple: number | null
    periodicity: RepetitionRule["periodicity"] | null
}

const initialFormState: FormState = {
    description: "",
    emoji: "",
    startDate: DateTime.now().toISODate(),
    startTime: "12:00",
    multiple: "1",
    periodicity: "day",
}

const parseFormState = (state: FormState): ParsedFormState => {
    const startDateTime = DateTime.fromISO(state.startDate + "T" + state.startTime)
    return {
        description: state.description !== "" ? state.description : null,
        emoji: state.emoji !== "" ? state.emoji : null,
        startDateTime: startDateTime.isValid ? startDateTime : null,
        multiple: /^[1-9]\d*$/.test(state.multiple) ? Number(state.multiple) : null,
        periodicity: periodicities.includes(state.periodicity) ? state.periodicity as RepetitionRule["periodicity"] : null,
    }
}

const AddTaskModal: FunctionComponent<Props> = (props) => {
    const [formState, setFormState] = useState<FormState>(initialFormState)
    const [validated, setValidated] = useState(false)
    const parsedFormState = parseFormState(formState)
    const startDateTime = parsedFormState.startDateTime

    // day -> days if multiple !== 1
    const pluralise = (s: string): string => parsedFormState.multiple === 1 ? s : s + "s"

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget
        if (form.checkValidity() === false || Object.values(parsedFormState).some(v => v === null)) {
            setValidated(true)
            return
        }

        props.handleSubmit({
            uuid: uuidV4(),
            description: parsedFormState.description!,
            emoji: parsedFormState.emoji!,
            schedule: {
                startTime: parsedFormState.startDateTime!.toISO({
                    includeOffset: false,
                    suppressMilliseconds: true,
                    suppressSeconds: true,
                }),
                repetitionRule: {
                    multiple: parsedFormState.multiple!,
                    periodicity: parsedFormState.periodicity!,
                }
            }
            // schedule: {}
        })
        setFormState(initialFormState)
        setValidated(false)
    }

    const updateFormState = <K extends keyof FormState, V extends FormState[K]>(key: K, newValue: V) => {
        setFormState((oldFormState) => {
            return produce(oldFormState, (draftFormState) => {
                draftFormState[key] = newValue
            })
        })
    }

    return (
        <Modal show={props.isOpen} onHide={props.handleClose}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <Form.Group>
                            <Form.Label>Emoji</Form.Label>
                            <Form.Control type="text" value={formState.emoji} onChange={(e) => updateFormState("emoji", e.target.value)} required htmlSize={1}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" value={formState.description} onChange={(e) => updateFormState("description", e.target.value)} placeholder="Aa" required />
                        </Form.Group>
                        <Form.Row>
                            <Form.Group>
                                <Form.Label>Start date</Form.Label>
                                <Form.Control type="date" value={formState.startDate} onChange={(e) => updateFormState("startDate", e.target.value)} placeholder="YYYY-MM-DD"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Start time</Form.Label>
                                <Form.Control type="time" value={formState.startTime} onChange={(e) => updateFormState("startTime", e.target.value)} placeholder="HH:mm" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Label>Repeat every</Form.Label>
                        <Form.Row>
                            <Form.Group>
                                <Form.Control type="number" value={formState.multiple} onChange={(e) => updateFormState("multiple", e.target.value)} min={1} placeholder="n"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Control as="select" value={formState.periodicity} onChange={(e) => updateFormState("periodicity", e.target.value)} disabled={startDateTime === null}>
                                    <option value="day">{pluralise("day")}</option>
                                    <option value="week">{pluralise("week")} on the {startDateTime?.weekdayLong ?? "Monday"}</option>
                                    <option value="day of month">{pluralise("month")} on the {appendOrdinal(startDateTime?.day ?? 1)}</option>
                                    <option value="weekday of month">{pluralise("month")} on the {appendOrdinal(startDateTime !== null ? weekdayOfMonth(startDateTime) : 1)} {startDateTime?.weekdayLong ?? "Monday"}</option>
                                    <option value="year">{pluralise("year")} on the {appendOrdinal(startDateTime?.day ?? 1)} {startDateTime?.monthLong ?? "January"}</option>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        Add Task
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default AddTaskModal
