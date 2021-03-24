import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Task, { randomTask } from '../domain/Task';



type TasksState = {
    tasks: Task[]
}

let initialState: TasksState = {
    tasks: Array.from(
        {length: 2},
        () => randomTask()
    )
}


const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask(state, action: PayloadAction<Task>) {
            state.tasks.push(action.payload)
        },
        deleteTask(state, action: PayloadAction<string>) {
           state.tasks = state.tasks.filter((task) => task.uuid !== action.payload)
        }
    }
})

export const {
    addTask,
    deleteTask,
} = tasksSlice.actions

export default tasksSlice.reducer
