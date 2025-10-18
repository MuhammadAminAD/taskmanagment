import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

interface RefreshResponse {
    ok: boolean
    data: {
        access_token: string
    }
}

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://task-managment-production-ccc8.up.railway.app/api/v1/',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
})

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery(
            {
                url: '/auth/token',
                method: 'GET',
            },
            api,
            extraOptions
        )
        const data = refreshResult.data as RefreshResponse | undefined
        if (data?.data.access_token) {
            localStorage.setItem('access_token', data.data.access_token)
            result = await baseQuery(args, api, extraOptions)
        } else {
            localStorage.removeItem('access_token')
            window.location.href = '/'
        }
    }

    return result
}
