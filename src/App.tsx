import { createElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import ConcentricCircles from './ConcentricCircles';
import { addTask } from './redux/tasksSlice';
import Task, { randomTask } from './Task';
import TaskDetail from './TaskDetail';

const App: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const [selectedTask, setSelectedTask] = useState<Task|null>(null);
    return (
        <div className="App">
            <button onClick={() => dispatch(addTask(randomTask()))}>Add Task</button>
            <TaskDetail task={selectedTask}/>
            <ConcentricCircles
                showTaskDetail={(task: Task) => () => {setSelectedTask(task)}}
                hideTaskDetail={() => setSelectedTask(null)}
            />
        </div>
    );
}
export default App;
