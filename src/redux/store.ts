import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import {save, load} from 'redux-localstorage-simple'

import rootReducer from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  middleware: [
    ...getDefaultMiddleware(),
    save({ namespace: "cycles" }),
  ],
  preloadedState: load({ namespace: "cycles" })
})

export type AppDispatch = typeof store.dispatch

export default store
