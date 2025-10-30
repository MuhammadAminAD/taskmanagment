import { useEffect, RefObject } from "react";
import { tCreateTodoActions } from "../components/create task/create.reducers";

export const useBodyScroll = (
    isOpen: boolean,
    isUpdate: boolean,
    handleClose?: () => void,
    dispatch?: React.Dispatch<tCreateTodoActions>
) => {
    useEffect(() => {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0px";
            // Modal yopilganda handleClose chaqirish
            if (isUpdate) {
                handleClose?.();
            }
            // Form errors reset
            dispatch?.({ type: "UNSET_ERRORS" });
        }

        return () => {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = "0px";
        };
    }, [isOpen, isUpdate, handleClose, dispatch]);
};

export const useKeyboardShortcuts = (
    isOpen: boolean,
    isUpdate: boolean,
    dispatch: React.Dispatch<tCreateTodoActions>
) => {
    useEffect(() => {
        const handleKeyDowns = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                dispatch({ type: "CLOSE_DIALOG" });
            }
            if (e.ctrlKey && e.key.toLowerCase() === "k" && !isUpdate) {
                e.preventDefault();
                dispatch({ type: "OPEN_DIALOG" });
            }
        };
        window.addEventListener("keydown", handleKeyDowns);
        return () => window.removeEventListener("keydown", handleKeyDowns);
    }, [isOpen, isUpdate, dispatch]);
};

export const useInputFocus = (
    isOpen: boolean,
    inputRef: RefObject<HTMLInputElement | null>
) => {
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, inputRef]);
};