import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const IconServices = createApi({
    reducerPath: "iconApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getIcons: builder.query({
            query: ({ search, skip, limit }: { search?: string; skip?: number, limit?: number }) => ({
                url: `/icons${search ? `?search=${search}&` : "?"}${skip ? `skip=${skip}&` : ""}${limit ? `limit=${limit}` : ""}`
            })
        }),

    })
})

export const {
    useGetIconsQuery,
} = IconServices