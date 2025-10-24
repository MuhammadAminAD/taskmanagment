// pages/NoteDetail/components/Sidebar.tsx
import { Icon } from "@iconify/react";

interface SidebarProps {
    sections: any[];
    editMode: boolean;
    onToggleEdit: () => void;
    onSectionClick: (id: number | string) => void;
}

export function Sidebar({ sections, editMode, onToggleEdit, onSectionClick }: SidebarProps) {
    return (
        <aside className="w-64 sticky top-24 h-fit">
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Icon icon="mdi:table-of-contents" className="text-xl text-neutral-600" />
                    <h3 className="font-semibold text-neutral-800">Mundarija</h3>
                </div>

                <nav>
                    <ul className="space-y-1">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <button
                                    onClick={() => onSectionClick(section.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 transition-all text-left"
                                >
                                    <Icon icon="mdi:file-document" className="text-lg" />
                                    <span className="truncate">{section.title}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-8 pt-6 border-t border-neutral-200">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-3">
                        Tezkor Havolalar
                    </h4>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="https://docs.nestjs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-blue-600 transition-colors"
                            >
                                <Icon icon="mdi:book-open-variant" />
                                <span>Rasmiy Hujjatlar</span>
                                <Icon icon="mdi:open-in-new" className="text-xs ml-auto" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <button
                onClick={onToggleEdit}
                className={`py-3 w-full mt-4 rounded-xl shadow-sm font-semibold transition-all ${editMode
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
            >
                {editMode ? "✓ Tayyor" : "✏️ Tahrirlash Rejimi"}
            </button>

            {editMode && (
                <div className="bg-blue-50 rounded-xl p-4 mt-4 border border-blue-200">
                    <p className="text-xs text-blue-700 leading-relaxed">
                        💡 <strong>Maslahat:</strong>
                        <br />
                        • Har bir element ustiga hover qiling
                        <br />
                        • Matnni bosib tahrirlang
                        <br />
                        • + tugmasi bilan yangi element qo'shing
                        <br />• 🗑️ bilan o'chiring
                    </p>
                </div>
            )}
        </aside>
    );
}