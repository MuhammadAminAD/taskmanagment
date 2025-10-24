import { Location } from "react-router-dom"

export const handleFilterClickForNavigate = (groupId: string, location: Location): string => {
    if (!groupId) {
        return '/todo'
    } else if (location.pathname === `/todo/${groupId}`) {
        return '/todo'
    } else {
        return `/todo/${groupId}`
    }
}

