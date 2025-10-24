import Filter from "./components/Filter/filter";
import CreateTask from "./components/create task/create";
import DndContainer from "./components/dndContainer";



export default function ToDo() {

    return (
        <div className="w-full block">
            <div className="flex items-center w-full justify-between border-b border-zinc-300 p-4 sticky top-0 bg-white  z-1">
                <h1 className="text-xl font-medium">My todos</h1>

                <div className="flex items-center gap-4 relative z-1">
                    <Filter />
                    <CreateTask />
                </div>
            </div>

            <div className="px-4">
                <DndContainer />
            </div>
        </div>
    );
}