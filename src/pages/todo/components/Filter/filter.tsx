import { useEffect, useReducer, useRef } from 'react'
import IFilter from '../../../../components/Icons/IFilter'
import { useGetGroupsQuery } from '../../../../services/groups.services'
import { IGroups } from '../../../../types/index.types'
import { useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import filterReducer, { FilterInitialState } from './filter.reducer'
import { handleFilterClickForNavigate } from './filter.util'

export default function Filter() {
    const [state, dispatch] = useReducer(filterReducer, FilterInitialState)
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)
    const { data: groupsData } = useGetGroupsQuery("")
    const navigate = useNavigate()
    const location = useLocation() // ✅ kichik harf bilan yozish — React konventsiyasiga mos

    // 🔹 Tashqariga bosilganda dropdown yopiladi
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                !dropdownRef.current?.contains(e.target as Node) &&
                !toggleButtonRef.current?.contains(e.target as Node)
            ) {
                dispatch({ type: "CLOSE_DROPDOWN" })
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleFilterClick = (groupId?: string) => {
        const path = handleFilterClickForNavigate(groupId || '', location)
        navigate(path)
        dispatch({ type: "CLOSE_DROPDOWN" })
    }

    return (
        <div className="relative">
            {/* 🔹 Toggle button */}
            <button
                ref={toggleButtonRef}
                onClick={() => dispatch({ type: "TOGGLE_DROPDOWN" })}
                className={`w-10 h-10 shadow flex-center p-0 rounded transition-colors duration-150 ${location.pathname.startsWith('/todo/') && location.pathname !== '/todo'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-neutral-700'
                    }`}
            >
                <IFilter />
            </button>

            {/* 🔹 Dropdown */}
            {state.open && (
                <div
                    ref={dropdownRef}
                    className="dropdown-style p-4 absolute right-0 top-12 z-50 w-48 bg-white rounded-xl shadow-lg"
                >
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">
                        Filter by groups
                    </h4>

                    <div className="space-y-2">
                        <button
                            onClick={() => handleFilterClick()}
                            className="hover:pl-2 duration-100 cursor-pointer flex items-center justify-between w-full text-neutral-700"
                        >
                            <span>None</span>
                            {location.pathname === '/todo' && (
                                <Icon icon="material-symbols:check-rounded" width="22" height="22" />
                            )}
                        </button>

                        {groupsData?.data?.map((group: IGroups) => (
                            <button
                                key={group.id}
                                onClick={() => handleFilterClick(group.id)}
                                className="hover:pl-2 duration-100 cursor-pointer flex items-center justify-between w-full capitalize font-medium text-neutral-800"
                            >
                                <span>{group.title}</span>
                                {location.pathname === `/todo/${group.id}` && (
                                    <Icon icon="material-symbols:check-rounded" width="22" height="22" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
