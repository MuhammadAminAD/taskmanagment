// pages/NoteDetail/components/BadgeItem.tsx
import { useState, useEffect } from "react";
import { ItemActions } from "./itemActions";
import { InsertMenu } from "./insertMenu";
interface BadgeItemProps {
    item: any;
    sectionId: number | string;
    editMode: boolean;
    onUpdate: (id: number | string, field: string, value: any) => void;
    onDelete: (id: number | string) => void;
    onAddAfter: (sectionId: number | string, afterId: number | null, type: string) => void;
}

const colors = ["blue", "orange", "green", "red", "purple", "yellow"];

const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    orange: "bg-orange-100 text-orange-700 border-orange-300",
    green: "bg-green-100 text-green-700 border-green-300",
    red: "bg-red-100 text-red-700 border-red-300",
    purple: "bg-purple-100 text-purple-700 border-purple-300",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

export function BadgeItem({
    item,
    sectionId,
    editMode,
    onUpdate,
    onDelete,
    onAddAfter,
}: BadgeItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditingText, setIsEditingText] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [text, setText] = useState(item.value);
    const [title, setTitle] = useState(item.title);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        setText(item.value);
        setTitle(item.title);
    }, [item.value, item.title]);

    const saveText = () => {
        onUpdate(item.id, "value", text);
        setIsEditingText(false);
    };

    const saveTitle = () => {
        onUpdate(item.id, "title", title);
        setIsEditingTitle(false);
    };

    return (
        <div
            className="border-l-4 pl-4 py-2 relative group"
            style={{ borderColor: "rgba(0,0,0,0.08)" }}
        >
            <div className="flex items-center gap-2 mb-2 flex-wrap">
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={saveTitle}
                        onKeyPress={(e) => e.key === "Enter" && saveTitle()}
                        className="px-3 py-1 rounded-full text-xs font-semibold border-2 border-blue-500 outline-none"
                        autoFocus
                    />
                ) : (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses[item.color] ?? colorClasses.blue
                            } ${editMode ? "cursor-pointer" : ""}`}
                        onClick={() => editMode && setIsEditingTitle(true)}
                    >
                        {item.title}
                    </span>
                )}

                {editMode && (
                    <div className="flex gap-1">
                        {colors.map((color) => (
                            <button
                                key={color}
                                onClick={() => onUpdate(item.id, "color", color)}
                                className={`w-4 h-4 rounded-full border-2 ${item.color === color
                                    ? "border-neutral-800"
                                    : "border-transparent"
                                    }`}
                                title={color}
                            />
                        ))}
                    </div>
                )}

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-neutral-500 hover:text-neutral-700"
                >
                    {isExpanded ? "Kamroq" : "Ko'proq"}
                </button>
            </div>

            {isEditingText ? (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={saveText}
                    className="w-full text-neutral-600 text-sm leading-relaxed p-2 border-2 border-blue-500 rounded outline-none"
                    rows={4}
                    autoFocus
                />
            ) : (
                <p
                    className={`text-neutral-600 text-sm leading-relaxed ${isExpanded ? "" : "line-clamp-3"
                        } ${editMode ? "cursor-pointer hover:bg-blue-50 rounded p-1" : ""}`}
                    onClick={() => editMode && setIsEditingText(true)}
                >
                    {item.value}
                </p>
            )}

            {editMode && !isEditingText && (
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