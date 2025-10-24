interface NoteHeaderProps {
    title: string;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onDelete: () => void;
    isDeleting: boolean;
    icon: string;
    description: string
}

export function NoteHeader({
    title,
    searchQuery,
    onSearchChange,
    onDelete,
    isDeleting,
    icon,
    description
}: NoteHeaderProps) {
    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4.25">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={`https://tmanagment.up.railway.app/public${icon}`} alt={`${title} icon`} width={30} height={30} />
                        <div>
                            <h1 className="font-bold text-2xl text-neutral-800 leading-[80%]">{title}</h1>
                            <p className="text-xs text-neutral-500">{description}</p>
                        </div>
                    </div>
                    <div className="relative flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Qidirish..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-3 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                            onClick={onDelete}
                            className="text-sm text-red-500 hover:text-red-700"
                            title="Delete note"
                        >
                            {isDeleting ? "Deleting..." : "O'chirish"}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}