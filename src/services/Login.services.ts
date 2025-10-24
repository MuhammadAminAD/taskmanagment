import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery.ts";

export const LoginServices = createApi({
    reducerPath: "loginApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        loginWithCode: builder.mutation({
            query: (code: string) => ({
                url: `/auth/code/${code}`,
                method: "GET",
            }),
        }),

    })
})

export const {
    useLoginWithCodeMutation,
} = LoginServices