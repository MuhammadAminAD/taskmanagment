// src/services/note.services.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const NoteServices = createApi({
    reducerPath: "NoteServices",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Note"],

    endpoints: (builder) => ({
        // 🟢 Hammasini olish (GET /notes)
        getAllNotes: builder.query({
            query: () => "/notes",
            providesTags: ["Note"],
        }),

        // 🟢 Bitta note olish (GET /notes/content/:id)
        getOneNote: builder.query({
            query: (id) => `/notes/content/${id}`,
            providesTags: (_, __, id) => [{ type: "Note", id }],
            // Backend dan kelgan ma'lumotni frontend formatiga o'tkazish
            transformResponse: (response: any) => {
                if (response.ok && response.sections) {
                    return {
                        ok: true,
                        note: {
                            ...response.note,
                            sections: response.sections.map((section: any) => ({
                                id: section.id,
                                type: "section",
                                title: section.title,
                                heshteg: section.heshteg,
                                children: Array.isArray(section.contents)
                                    ? section.contents.map((content: any) => ({
                                        id: content.id,
                                        type: content.type,
                                        title: content.title,
                                        value: content.value,
                                    }))
                                    : []
                            }))
                        }
                    };
                }
                return response;
            },
        }),

        // 🟢 Yaratish (POST /notes)
        createNote: builder.mutation({
            query: (body) => ({
                url: "/notes",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Note"],
        }),

        // 🟡 Yangilash (PUT /notes)
        updateNote: builder.mutation({
            query: ({ id, title, description, logo, sections }) => {
                // Frontend formatidan backend formatiga o'tkazish
                const backendSections = sections.map((section: any) => ({
                    id: section.id, // agar mavjud bo'lsa
                    title: section.title,
                    heshteg: section.heshteg || "",
                    contents: (section.children || []).map((child: any) => ({
                        id: child.id, // agar mavjud bo'lsa
                        type: child.type,
                        title: child.title || "",
                        value: child.value || "",
                    }))
                }));

                return {
                    url: `/notes`,
                    method: "PUT",
                    body: {
                        id,
                        title,
                        description,
                        logo,
                        sections: backendSections
                    },
                };
            },
            invalidatesTags: (_, __, { id }) => [{ type: "Note", id }, "Note"],
        }),

        // 🔴 O'chirish (DELETE /notes/:id)
        deleteNote: builder.mutation({
            query: (id) => ({
                url: `/notes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Note"],
        }),

        // 🟢 Section yaratish (POST /notes/section)
        createSection: builder.mutation({
            query: (body) => ({
                url: "/notes/section",
                method: "POST",
                body,
            }),
            invalidatesTags: (_, __, { note_id }) => [
                { type: "Note", id: note_id },
                "Note"
            ],
        }),

        // 🟢 Content yaratish (POST /notes/content)
        createContent: builder.mutation({
            query: (body) => ({
                url: "/notes/content",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Note"],
        }),
    }),
});

export const {
    useGetAllNotesQuery,
    useGetOneNoteQuery,
    useCreateNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
    useCreateSectionMutation,
    useCreateContentMutation,
} = NoteServices;