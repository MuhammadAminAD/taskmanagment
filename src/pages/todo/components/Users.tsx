import { Icon } from "@iconify/react";

export default function Users() {
    return (
        <div>
            <button
                className={`w-10 h-10 shadow flex-center p-0 rounded transition-colors duration-150 ${location.pathname.startsWith('/todo/') && location.pathname !== '/todo'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-neutral-700'
                    }`}
            >
                <Icon icon="fa-solid:users-cog" width="24" height="24" />
            </button>
        </div>
    )
}
