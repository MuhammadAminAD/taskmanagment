import { TaskApi } from '@/services/baseApi'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    [TaskApi.reducerPath]:TaskApi.reducer
  },
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware().concat(TaskApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch