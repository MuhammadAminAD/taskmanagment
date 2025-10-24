// pages/NoteDetail/components/ContentItem.tsx
import { useState, useEffect } from "react";
import { ItemActions } from "./itemActions";
import { InsertMenu } from "./insertMenu";
import { BadgeItem } from "./badgeItem";
interface ContentItemProps {
    item: any;
    sectionId: number | string;
    editMode: boolean;
    onUpdate: (id: number | string, field: string, value: any) => void;
    onDelete: (id: number | string) => void;
    onAddAfter: (sectionId: number | string, afterId: number | null, type: string) => void;
}

export function ContentItem({
    item,
    sectionId,
    editMode,
    onUpdate,
    onDelete,
    onAddAfter,
}: ContentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(item.value);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        setValue(item.value);
    }, [item.value]);

    const saveValue = () => {
        onUpdate(item.id, "value", value);
        setIsEditing(false);
    };

    if (item.type === "text") {
        return (
            <div className="group relative">
                {isEditing ? (
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={saveValue}
                        className="w-full p-3 border-2 border-blue-500 rounded-lg outline-none text-neutral-600 leading-relaxed"
                        rows={3}
                        autoFocus
                    />
                ) : (
                    <p
                        className={`text-neutral-600 leading-relaxed ${editMode ? "cursor-pointer hover:bg-blue-50 rounded p-2" : ""
                            }`}
                        onClick={() => editMode && setIsEditing(true)}
                    >
                        {item.value}
                    </p>
                )}
                {editMode && !isEditing && (
                    <ItemActions
                        onDelete={() => onDelete(item.id)}
                        onAddAfter={() => setShowMenu(!showMenu)}
                    />
                )}
                {showMenu && (
                    <InsertMenu
                        sectionId={sectionId}
                        afterId={item.id}
                        onAdd={(type: string) => {
                            onAddAfter(sectionId, item.id, type);
                            setShowMenu(false);
                        }}
                        onClose={() => setShowMenu(false)}
                    />
                )}
            </div>
        );
    }

    if (item.type === "code") {
        return (
            <div className="group relative">
                {isEditing ? (
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={saveValue}
                        className="w-full bg-neutral-900 text-neutral-100 p-4 rounded-lg text-sm font-mono outline-none border-2 border-blue-500"
                        rows={5}
                        autoFocus
                    />
                ) : (
                    <pre
                        className={`bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm ${editMode ? "cursor-pointer" : ""
                            }`}
                        onClick={() => editMode && setIsEditing(true)}
                    >
                        <code>{item.value}</code>
                    </pre>
                )}
                {editMode && !isEditing && (
                    <ItemActions
                        onDelete={() => onDelete(item.id)}
                        onAddAfter={() => setShowMenu(!showMenu)}
                    />
                )}
                {showMenu && (
                    <InsertMenu
                        sectionId={sectionId}
                        afterId={item.id}
                        onAdd={(type: string) => {
                            onAddAfter(sectionId, item.id, type);
                            setShowMenu(false);
                        }}
                        onClose={() => setShowMenu(false)}
                    />
                )}
            </div>
        );
    }

    if (item.type === "badge") {
        return (
            <BadgeItem
                item={item}
                sectionId={sectionId}
                editMode={editMode}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAddAfter={onAddAfter}
            />
        );
    }

    return null;
}