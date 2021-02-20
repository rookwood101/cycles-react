import { combineReducers } from '@reduxjs/toolkit'
import tasksSlice from './tasksSlice'

const rootReducer = combineReducers({
    tasks: tasksSlice
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
