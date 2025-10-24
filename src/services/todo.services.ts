import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery.ts";

export const TodoServices = createApi({
    reducerPath: "todoApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Tasks"],
    endpoints: (builder) => ({
        getTodos: builder.query({
            query: (groupID) => ({
                url: `/tasks${groupID ? `?group=${groupID}` : ""}`,
            }),
            providesTags: ["Tasks"]
        }),
        createTodos: builder.mutation({
            query: (body) => ({
                method: "POST",
                url: `/tasks`,
                body
            }),
            invalidatesTags: ["Tasks"]
        }),
        updatedTodos: builder.mutation({
            query: (body) => ({
                method: "PUT",
                url: `/tasks`,
                body
            }),
            invalidatesTags: ["Tasks"]
        }),
        deleteTodos: builder.mutation({
            query: (id) => ({
                method: "DELETE",
                url: `/tasks/${id}`
            }),
            invalidatesTags: ["Tasks"]
        }),

    })
})

export const {
    useGetTodosQuery,
    useUpdatedTodosMutation,
    useDeleteTodosMutation,
    useCreateTodosMutation
} = TodoServices