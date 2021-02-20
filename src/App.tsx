import { createElement, useState } from 'react';
import ConcentricCircles from './ConcentricCircles';
import Task from './Task';
import TaskDetail from './TaskDetail';

const App: React.FC<{}> = (props) => {
    const [selectedTask, setSelectedTask] = useState<Task|null>(null);
    return (
        <div className="App">
            <TaskDetail task={selectedTask}/>
            <ConcentricCircles
                showTaskDetail={(task: Task) => () => {setSelectedTask(task)}}
                hideTaskDetail={() => setSelectedTask(null)}
            />
        </div>
    );
}
export default App;
