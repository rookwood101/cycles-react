import React from 'react';
import ConcentricCircles from './ConcentricCircles';
import Task from './Task';
import TaskDetail from './TaskDetail';

interface AppState {
  selectedTask: Task | null,
}

export default class App extends React.PureComponent<{}, AppState>{
  public constructor(props: {}) {
    super(props);
    this.state = {
      selectedTask: null,
    };
  }

  public render() {
    return (
      <div className="App">
        <TaskDetail task={this.state.selectedTask}/>
        <ConcentricCircles
          showTaskDetail={(task) => () => {this.setState({selectedTask: task})}}
          hideTaskDetail={() => this.setState({selectedTask: null})}
        />
      </div>
    );
  }
}