// pages/NoteDetail/index.tsx
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetOneNoteQuery,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} from "../../../services/note.services";
import {
    findAndUpdate,
    findAndDelete,
    insertAfterInSection
} from "../utils/contentHelpers";
import { createNewItem } from "../utils/itemFactory";
import { Sidebar } from "../components/sidebar";
import { Section } from "../components/sections";
import { NoteHeader } from "../components/header";

export default function NoteDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, isFetching, isError } = useGetOneNoteQuery(id as string, {
        skip: !id,
    });
    const [updateNote] = useUpdateNoteMutation();
    const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

    const [content, setContent] = useState<any[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (data?.ok && data.note) {
            const sections = data.note.sections ?? [];
            setContent(sections);
        }
    }, [data]);

    const saveToBackend = async (updatedContent: any[]) => {
        if (!id) return;
        try {
            await updateNote({
                id: parseInt(id),
                title: data.note.title,
                description: data.note.description,
                logo: data.note.logo,
                sections: updatedContent
            }).unwrap();
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    const updateContent = (newContent: any[]) => {
        setContent(newContent);
        saveToBackend(newContent);
    };

    const addItemAfter = (sectionId: number | string, afterId: number | null, type: string) => {
        const newItem = createNewItem(type);
        const updated = insertAfterInSection(content, sectionId, afterId, newItem);
        updateContent(updated);
    };

    const addSection = () => {
        const newSection = {
            type: "section",
            title: "Yangi Bo'lim",
            heshteg: "",
            children: [],
        };
        updateContent([...content, newSection]);
    };

    const updateItem = (idItem: number | string, field: string, value: any) => {
        const updated = findAndUpdate(content, idItem, (it) => ({ ...it, [field]: value }));
        updateContent(updated);
    };

    const deleteItem = (idToDelete: number | string) => {
        const updated = findAndDelete(content, idToDelete);
        updateContent(updated);
    };

    const handleDeleteNote = async () => {
        if (!id) return;
        const confirmed = window.confirm("Haqiqatan ham bu noteni o'chirmoqchimisiz?");
        if (!confirmed) return;

        try {
            await deleteNote(id).unwrap();
            navigate("/note");
        } catch (err) {
            console.error("Delete note error:", err);
            alert("Note o'chirishda xatolik yuz berdi!");
        }
    };

    const scrollToSection = (idToScroll: number | string) => {
        const element = document.getElementById(`section-${idToScroll}`);
        if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (isLoading || isFetching) {
        return (
            <div className="flex justify-center items-center h-screen text-neutral-600">
                Yuklanmoqda...
            </div>
        );
    }

    if (isError || !data?.ok) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600">
                Xatolik: note topilmadi yoki serverga ulanib bo'lmadi
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
            <NoteHeader
                title={data?.note?.title ?? "Note"}
                icon={data?.note?.logo ?? ""}
                description={data?.note?.description ?? "None"}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onDelete={handleDeleteNote}
                isDeleting={isDeleting}
            />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-8 flex-col lg:flex-row">
                    <main className="flex-1 bg-white rounded-xl shadow-sm p-8">
                        {content.length === 0 && (
                            <div className="text-center text-neutral-400 py-12">
                                Hali bo'limlar yo'q. "Tahrirlash" tugmasini bosib yangi bo'lim qo'shing.
                            </div>
                        )}

                        {content.map((section) => (
                            <Section
                                key={section.id || `temp-${Math.random()}`}
                                section={section}
                                editMode={editMode}
                                onUpdate={updateItem}
                                onDelete={deleteItem}
                                onAddAfter={addItemAfter}
                            />
                        ))}

                        {editMode && (
                            <button
                                onClick={addSection}
                                className="w-full py-3 border-2 border-dashed border-neutral-300 rounded-lg text-neutral-500 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2 mt-6"
                            >
                                <Icon icon="mdi:plus-circle" className="text-xl" />
                                Yangi Bo'lim Qo'shish
                            </button>
                        )}
                    </main>

                    <Sidebar
                        sections={content}
                        editMode={editMode}
                        onToggleEdit={() => setEditMode(!editMode)}
                        onSectionClick={scrollToSection}
                    />
                </div>
            </div>
        </div>
    );
}