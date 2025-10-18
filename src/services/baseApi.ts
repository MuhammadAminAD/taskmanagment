import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './baseQuery'

export const TaskApi = createApi({
  reducerPath: 'TaskApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Tasks', 'Group'],
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (filter) => `tasks${filter ? `?group=${filter}` : ''}`,
      providesTags: ['Tasks'],
    }),

    createTask: builder.mutation({
      query: (body) => ({
        url: 'tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),

    updateTask: builder.mutation({
      query: (body) => ({
        url: `tasks`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),

    deleteTask: builder.mutation({
      query: ({ id }) => ({
        url: `tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'],
    }),

    createTaskItem: builder.mutation({
      query: (body) => ({
        url: `tasks/items`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),

    updateTaskItem: builder.mutation({
      query: (body) => ({
        url: `tasks/items`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),

    groups: builder.query({
      query: () => 'groups',
      providesTags: ['Group'],
    }),

    groupCreate: builder.mutation({
      query: ({ body }) => ({
        url: 'groups',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Group'],
    }),

    AI: builder.mutation({
      query: ({ body }) => ({
        url: 'ai',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Group'],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCreateTaskItemMutation,
  useUpdateTaskItemMutation,
  useGroupsQuery,
  useGroupCreateMutation,
  useAIMutation,
} = TaskApi

