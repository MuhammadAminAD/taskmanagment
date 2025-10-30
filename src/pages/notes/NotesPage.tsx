import Create from "./components/create";
import NoteCard from "./components/noteCard";
import { useGetAllNotesQuery } from "../../services/note.services";
import { useState } from "react";

export default function Note() {
    const { data, isLoading, isError } = useGetAllNotesQuery("");
    const [search, setSearch] = useState("");

    const notes = data?.notes || [];

    // 🔍 Filtirlash (frontend tomonda)
    const filteredNotes = notes.filter((note: { title: string, logo: string, id: string }) =>
        note.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="w-full block">
                <div className="flex items-center w-full justify-between border-b border-zinc-300 p-4 sticky top-0 bg-white">
                    <h1 className="text-xl font-medium">Notes</h1>

                    <div className="flex items-center gap-4">
                        <Create />
                    </div>
                </div>

                <div className="px-4 mt-4">
                    <label className="text-neutral-700 font-medium mb-1 block">
                        Search note
                    </label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border outline-0 border-zinc-400 focus-visible:border-2 focus-visible:border-blue-500 rounded py-2 px-4"
                        placeholder="search"
                    />

                    <div className="mt-5">
                        {isLoading && (
                            <p className="text-gray-500">Loading notes...</p>
                        )}

                        {isError && (
                            <p className="text-red-500">Failed to load notes 😢</p>
                        )}

                        {!isLoading && !filteredNotes.length && (
                            <p className="text-gray-400">No notes found</p>
                        )}

                        {filteredNotes.map((note: { title: string, logo: string, id: string }) => (
                            <NoteCard
                                key={note.id}
                                title={note.title}
                                logo={note.logo}
                                id={note.id}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


