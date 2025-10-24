import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const GroupServices = createApi({
    reducerPath: "groupApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getGroups: builder.query({
            query: () => ({
                url: "/groups"
            })
        }),

    })
})

export const {
    useGetGroupsQuery,
} = GroupServices