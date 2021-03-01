import 'bootstrap/dist/css/bootstrap.min.css'
import { createElement, FunctionComponent, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Task, { randomTask } from "./domain/Task";

interface Props {
    isOpen: boolean
    handleClose: () => void
    handleSubmit: (task: Task) => void
}

const AddTaskModal: FunctionComponent<Props> = (props) => {
    const [description, setDescription] = useState("");

    return (
        <Modal show={props.isOpen} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group >
                    <Form.Label>Description:</Form.Label>
                    <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Laundry"/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => props.handleSubmit({...randomTask(), description: description})}>
                    Add Task 
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddTaskModal
