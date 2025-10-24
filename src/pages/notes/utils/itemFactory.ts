// pages/NoteDetail/utils/itemFactory.ts

/**
 * Type bo'yicha yangi item yaratish
 */
export const createNewItem = (type: string): any => {
    const newItem: any = {
        type
    };

    if (type === "text") {
        newItem.value = "Yangi matn...";
    }

    if (type === "code") {
        newItem.value = "// kod yozing";
        newItem.lang = "bash";
    }

    if (type === "badge") {
        newItem.title = "YANGI";
        newItem.color = "blue";
        newItem.value = "Badge matni...";
    }

    if (type === "section") {
        newItem.title = "Yangi Bo'lim";
        newItem.children = [];
    }

    return newItem;
};