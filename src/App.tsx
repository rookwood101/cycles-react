import { createElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import AddTaskModal from './AddTaskModal';
import ConcentricCircles from './ConcentricCircles';
import { addTask } from './redux/tasksSlice';
import { CachedTask } from './domain/Task';
import TaskDetail from './TaskDetail';
import { Button } from 'react-bootstrap';

const App: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<CachedTask|null>(null);
    return (
        <div className="App">
            <Button onClick={() => setModalOpen(true)} variant="primary">Add Task</Button>
            <AddTaskModal 
                isOpen={isModalOpen}
                handleClose={() => setModalOpen(false)}
                handleSubmit={(task) => {
                    dispatch(addTask(task))
                    setModalOpen(false)
                }}
            />
            <TaskDetail task={selectedTask}/>
            <ConcentricCircles
                showTaskDetail={(task: CachedTask) => () => {setSelectedTask(task)}}
                hideTaskDetail={() => setSelectedTask(null)}
            />
        </div>
    );
}
export default App;
