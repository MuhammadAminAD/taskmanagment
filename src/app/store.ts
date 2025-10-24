import { configureStore } from '@reduxjs/toolkit'
import { LoginServices } from '../services/Login.services'
import { TodoServices } from '../services/todo.services'
import { GroupServices } from '../services/groups.services'
import { IconServices } from '../services/icon.services'
import { NoteServices } from '../services/note.services'

export const store = configureStore({
    reducer: {
        [LoginServices.reducerPath]: LoginServices.reducer,
        [TodoServices.reducerPath]: TodoServices.reducer,
        [GroupServices.reducerPath]: GroupServices.reducer,
        [IconServices.reducerPath]: IconServices.reducer,
        [NoteServices.reducerPath]: NoteServices.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(LoginServices.middleware)
        .concat(TodoServices.middleware)
        .concat(GroupServices.middleware)
        .concat(IconServices.middleware)
        .concat(NoteServices.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch