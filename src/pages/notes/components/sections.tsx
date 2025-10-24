// pages/NoteDetail/components/Section.tsx
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { ContentItem } from "./contentItem";
import { AddMenu } from "./addMenu";

interface SectionProps {
    section: any;
    editMode: boolean;
    onUpdate: (id: number | string, field: string, value: any) => void;
    onDelete: (id: number | string) => void;
    onAddAfter: (sectionId: number | string, afterId: number | null, type: string) => void;
}

export function Section({ section, editMode, onUpdate, onDelete, onAddAfter }: SectionProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(section.title);

    useEffect(() => {
        setTitle(section.title);
    }, [section.title]);

    const saveTitle = () => {
        onUpdate(section.id, "title", title);
        setIsEditingTitle(false);
    };

    return (
        <section id={`section-${section.id}`} className="mb-12 scroll-mt-6 group">
            <div className="flex items-center gap-2 mb-4 relative">
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyPress={(e) => e.key === "Enter" && saveTitle()}
                        className="text-xl font-semibold text-neutral-800 border-b-2 border-blue-500 outline-none flex-1"
                        autoFocus
                    />
                ) : (
                    <h2
                        className={`text-xl font-semibold text-neutral-800 border-b-2 border-neutral-200 pb-2 flex-1 ${editMode ? "cursor-pointer hover:border-blue-300" : ""
                            }`}
                        onClick={() => editMode && setIsEditingTitle(true)}
                    >
                        {section.title}
                    </h2>
                )}

                {editMode && (
                    <button
                        onClick={() => onDelete(section.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg text-red-500"
                        title="Bo'limni o'chirish"
                    >
                        <Icon icon="mdi:delete" className="text-xl" />
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {Array.isArray(section.children) &&
                    section.children.map((item: any) => (
                        <ContentItem
                            key={item.id}
                            item={item}
                            sectionId={section.id}
                            editMode={editMode}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onAddAfter={onAddAfter}
                        />
                    ))}

                {editMode && <AddMenu sectionId={section.id} onAdd={onAddAfter} />}
            </div>
        </section>
    );
}