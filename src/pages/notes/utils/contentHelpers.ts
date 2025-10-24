// pages/NoteDetail/utils/contentHelpers.ts

/**
 * Rekursiv ravishda itemlarni topish va yangilash
 */
export const findAndUpdate = (
    items: any[],
    idToFind: number | string,
    updater: (it: any) => any
): any[] => {
    return items.map((it) => {
        if (it.id === idToFind) {
            return updater(it);
        }
        if (it.children && Array.isArray(it.children)) {
            return { ...it, children: findAndUpdate(it.children, idToFind, updater) };
        }
        return it;
    });
};

/**
 * Rekursiv ravishda itemni topish va o'chirish
 */
export const findAndDelete = (items: any[], idToDelete: number | string): any[] => {
    return items.reduce((acc: any[], it) => {
        if (it.id === idToDelete) {
            return acc; // skip
        }
        if (it.children && Array.isArray(it.children)) {
            acc.push({ ...it, children: findAndDelete(it.children, idToDelete) });
        } else {
            acc.push(it);
        }
        return acc;
    }, []);
};

/**
 * Bo'lim ichida yangi item qo'shish (afterId dan keyin)
 */
export const insertAfterInSection = (
    items: any[],
    sectionId: number | string,
    afterId: number | string | null,
    newItem: any
): any[] => {
    return items.map((it) => {
        if (it.id === sectionId) {
            const children = Array.isArray(it.children) ? it.children.slice() : [];
            if (afterId == null) {
                // oxiriga qo'shish
                return { ...it, children: [...children, newItem] };
            }
            const idx = children.findIndex((c: any) => c.id === afterId);
            if (idx === -1) {
                // topilmasa, oxiriga qo'shish
                return { ...it, children: [...children, newItem] };
            }
            const newChildren = [
                ...children.slice(0, idx + 1),
                newItem,
                ...children.slice(idx + 1),
            ];
            return { ...it, children: newChildren };
        }
        if (it.children && Array.isArray(it.children)) {
            return {
                ...it,
                children: insertAfterInSection(it.children, sectionId, afterId, newItem),
            };
        }
        return it;
    });
};