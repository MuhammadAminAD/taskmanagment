import { useEffect, useRef, useState } from "react";
import IPlus from "../../../components/Icons/IPlus";
import { useCreateNoteMutation } from "../../../services/note.services";
import { useGetIconsQuery } from "../../../services/icon.services";
import { useAlert } from "../../../components/Alert/useAlert";
import { createPortal } from "react-dom";

interface FormErrors {
    title?: string;
    description?: string;
}

interface Icon {
    id: string;
    url: string;
    name?: string;
}

export default function CreateNote() {
    const [open, setOpen] = useState(false);
    const [createNote] = useCreateNoteMutation();
    const { addAlert } = useAlert();
    const titleRef = useRef<HTMLInputElement>(null);

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedLogo, setSelectedLogo] = useState<string>("");
    const [errors, setErrors] = useState<FormErrors>({});

    // 🔍 icon filter holati
    const [iconsFilter, setIconsFilter] = useState({
        skip: 0,
        limit: 50,
        search: "",
    });

    // 🔁 barcha iconlarni bitta joyda saqlaymiz
    const [allIcons, setAllIcons] = useState<Icon[]>([]);
    const { data: iconsData, isFetching } = useGetIconsQuery(iconsFilter);

    const [toggleIconDropdown, setToggleIconDropdown] = useState(false);
    const iconsContainerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);
    const hasMoreRef = useRef(true);

    // Icons ma'lumotlarini yangilash - MUAMMONI TAXLIL QILISH
    useEffect(() => {
        if (iconsData?.data?.length) {
            const newIcons = iconsData.data;
            setAllIcons(prev => [...prev, ...newIcons]); // duplikatni tekshirmasdan
            hasMoreRef.current = newIcons.length > 0;
            isLoadingRef.current = false;
        }
    }, [iconsData]);


    // 🔁 Infinite scroll kuzatish
    useEffect(() => {
        const container = iconsContainerRef.current;
        if (!container || !toggleIconDropdown) return;

        const handleScroll = () => {
            if (!container || isLoadingRef.current || !hasMoreRef.current || isFetching) return;

            const { scrollTop, scrollHeight, clientHeight } = container;
            const isBottom = scrollTop + clientHeight >= scrollHeight - 100;

            if (isBottom) {
                console.log("Loading more icons...");
                isLoadingRef.current = true;
                setIconsFilter((prev) => ({
                    ...prev,
                    skip: prev.skip + prev.limit,
                }));
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [toggleIconDropdown, isFetching]);

    // 🔍 Search - debounce bilan
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIconsFilter({
            skip: 0,
            limit: 50,
            search: value
        });
        setAllIcons([]); // Yangi search uchun eski iconlarni tozalash
        hasMoreRef.current = true;
        isLoadingRef.current = false;
    };

    // 🔒 Modal scroll block
    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        if (open) {
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0px";
            // Reset form when closing
            setErrors({});
            setSelectedLogo("");
            setToggleIconDropdown(false);
        }

        return () => {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0px";
        };
    }, [open]);

    // Focus management
    useEffect(() => {
        if (open && titleRef.current) {
            setTimeout(() => titleRef.current?.focus(), 150);
        }
    }, [open]);

    // 🔑 Klaviatura qisqa yo'llar
    useEffect(() => {
        const handleKeyDowns = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                setOpen(false);
            }
            if (e.ctrlKey && e.key.toLowerCase() === "k" && !open) {
                e.preventDefault();
                setOpen(true);
            }
        };

        window.addEventListener("keydown", handleKeyDowns);
        return () => window.removeEventListener("keydown", handleKeyDowns);
    }, [open]);

    // Validatsiya funksiyalari
    const validateForm = (title: string, description: string): boolean => {
        const newErrors: FormErrors = {};

        if (!title.trim()) {
            newErrors.title = "Note title is required";
        } else if (title.trim().length < 2) {
            newErrors.title = "Title must be at least 2 characters";
        } else if (title.trim().length > 100) {
            newErrors.title = "Title must be less than 100 characters";
        }

        if (description.trim().length > 500) {
            newErrors.description = "Description must be less than 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Real-time validatsiya
    const handleInputChange = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // 🧾 Note yaratish
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget as HTMLFormElement);
        const { title, description } = Object.fromEntries(form.entries()) as {
            title: string;
            description: string;
        };

        if (!validateForm(title, description)) {
            return;
        }

        setButtonDisabled(true);

        try {
            const body = {
                title: title.trim(),
                description: description.trim(),
                icon: selectedLogo || null,
            };

            console.log("Creating note with data:", body);
            await createNote(body).unwrap();
            addAlert("Note created successfully!", "success");
            setOpen(false);

            // Form reset
            (e.target as HTMLFormElement).reset();
            setSelectedLogo("");
        } catch (error: unknown) {
            console.error("Error:", error);

            let errorMessage = "Failed to process task";

            if (typeof error === 'object' && error !== null) {
                if ('data' in error && typeof error.data === 'object' && error.data !== null) {
                    const errorData = error.data as { message?: string };
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                }

                // Standard Error object
                else if ('message' in error && typeof error.message === 'string') {
                    errorMessage = error.message;
                }
            }

            addAlert(errorMessage, "error");
        } finally {
            setButtonDisabled(false);
        }
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    // Icon URL ni to'g'ri shakllantirish
    const getIconUrl = (url: string) => {
        if (!url) return '';

        // Agar URL allaqachon to'liq bo'lsa
        if (url.startsWith('http')) return url;

        // Nisbiy URL bo'lsa
        const baseUrl = 'http://localhost:8080';
        if (url.startsWith('/public')) {
            return `${baseUrl}${url}`;
        } else if (url.startsWith('/')) {
            return `${baseUrl}/public${url}`;
        } else {
            return `${baseUrl}/public/${url}`;
        }
    };

    // Icon dropdown ni yopish
    const handleIconSelect = (iconUrl: string) => {
        setSelectedLogo(iconUrl);
        setToggleIconDropdown(false);
    };

    // Icon dropdown ni toggle qilish
    const handleToggleIconDropdown = () => {
        setToggleIconDropdown(!toggleIconDropdown);
        // Agar dropdown ochilayotgan bo'lsa va iconlar bo'sh bo'lsa, yangidan yuklash
        if (!toggleIconDropdown && allIcons.length === 0) {
            setIconsFilter(prev => ({ ...prev, skip: 0 }));
        }
    };

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="w-10 h-10 flex justify-center items-center bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Create new note"
            >
                <IPlus />
            </button>

            {/* Overlay */}
            {createPortal(
                <div
                    onClick={handleCloseModal}
                    className={`fixed inset-0 bg-black/70 z-[99] transition-opacity duration-300 ${open
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                        }`}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`h-full bg-white w-[90vw] max-w-[450px] shadow-lg transition-all duration-300 border-r border-neutral-300 overflow-hidden ${!open
                            ? "max-w-0 opacity-0"
                            : "py-6 px-5 opacity-100"
                            }`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-neutral-700">
                                Create a new note
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition duration-200 text-gray-500 hover:text-gray-700"
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    ref={titleRef}
                                    name="title"
                                    type="text"
                                    placeholder="Enter note title"
                                    className={`w-full border rounded py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.title ? "border-red-500" : "border-neutral-400"
                                        }`}
                                    onChange={() => handleInputChange('title')}
                                    maxLength={100}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Enter note description (optional)"
                                    rows={4}
                                    className={`w-full border rounded py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-none ${errors.description ? "border-red-500" : "border-neutral-400"
                                        }`}
                                    onChange={() => handleInputChange('description')}
                                    maxLength={500}
                                ></textarea>
                                {errors.description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Icon select */}
                            <div>
                                <button
                                    type="button"
                                    onClick={handleToggleIconDropdown}
                                    className="w-full border border-blue-500 text-blue-500 py-2.5 rounded font-medium hover:bg-blue-500 hover:text-white transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                                >
                                    {toggleIconDropdown
                                        ? "Hide icons"
                                        : selectedLogo
                                            ? "Change icon"
                                            : "Select icon (optional)"}
                                </button>

                                {selectedLogo && (
                                    <div className="flex justify-center items-center mt-3 p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600 mr-2">Selected icon:</span>
                                        <img
                                            src={getIconUrl(selectedLogo)}
                                            alt="Selected icon"
                                            className="w-8 h-8 object-contain"
                                            onError={(e) => {
                                                console.error("Failed to load icon:", selectedLogo);
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}

                                {toggleIconDropdown && (
                                    <div className="mt-3 border border-gray-300 rounded-lg p-3 bg-white">
                                        {/* Search */}
                                        <input
                                            type="text"
                                            placeholder="Search icons..."
                                            value={iconsFilter.search}
                                            onChange={handleSearch}
                                            className="w-full border border-neutral-400 rounded py-2 px-3 mb-3 outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                                        />

                                        {/* Icons grid */}
                                        <div
                                            ref={iconsContainerRef}
                                            className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1"
                                        >
                                            {allIcons.length > 0 ? (
                                                <>
                                                    {allIcons.map((icon) => (
                                                        <button
                                                            key={icon.id}
                                                            type="button"
                                                            onClick={() => handleIconSelect(icon.url)}
                                                            className={`aspect-square p-1 rounded-lg border-2 transition duration-200 hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedLogo === icon.url
                                                                ? "border-blue-500 bg-blue-50"
                                                                : "border-gray-200"
                                                                }`}
                                                        >
                                                            <img
                                                                src={getIconUrl(icon.url)}
                                                                alt={icon.name || "icon"}
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    console.error("Failed to load icon image:", icon.url);
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        </button>
                                                    ))}

                                                    {/* Loading indicator */}
                                                    {(isFetching || isLoadingRef.current) && (
                                                        <div className="col-span-6 flex justify-center items-center py-4">
                                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                                        </div>
                                                    )}

                                                    {/* No more icons message */}
                                                    {!hasMoreRef.current && !isFetching && (
                                                        <div className="col-span-6 text-center text-gray-400 text-sm py-2">
                                                            No more icons to load
                                                        </div>
                                                    )}
                                                </>
                                            ) : isFetching ? (
                                                <div className="col-span-6 flex justify-center items-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                                </div>
                                            ) : (
                                                <div className="col-span-6 text-center text-gray-500 py-4">
                                                    {iconsFilter.search ? "No icons found for your search" : "No icons available"}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                disabled={buttonDisabled}
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-md transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {buttonDisabled ? (
                                    <span className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating...
                                    </span>
                                ) : (
                                    "Create Note"
                                )}
                            </button>
                        </form>

                        {/* Shortcut info */}
                        <div className="mt-6 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
                            <p>💡 Quick tip: Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded border border-gray-300 text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-200 rounded border border-gray-300 text-xs">K</kbd> to quickly open this form</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}