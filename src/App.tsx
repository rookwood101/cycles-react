import { createElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import AddTaskModal from './AddTaskModal';
import ConcentricCircles from './ConcentricCircles';
import { addTask } from './redux/tasksSlice';
import Task, { randomTask } from './domain/Task';
import TaskDetail from './TaskDetail';

const App: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedTask, setSelectedTask] = useState<Task|null>(null);
    return (
        <div className="App">
            <button onClick={() => setModalOpen(true)}>Add Task</button>
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
                showTaskDetail={(task: Task) => () => {setSelectedTask(task)}}
                hideTaskDetail={() => setSelectedTask(null)}
            />
        </div>
    );
}
export default App;
