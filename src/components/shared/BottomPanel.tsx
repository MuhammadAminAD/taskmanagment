import { useEffect, useState } from "react"
import { useCreateTaskMutation, useGroupsQuery } from "@/services/baseApi"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export default function BottomPanel() {
    const { data: groupsData } = useGroupsQuery("")
    const [addTask, { isLoading }] = useCreateTaskMutation()
    const [createTaskDialog, setCreateTaskDialog] = useState(false)

    useEffect(() => {
        const handleShortcut = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setCreateTaskDialog((prev) => !prev)
            }
        }
        window.addEventListener("keydown", handleShortcut)
        return () => window.removeEventListener("keydown", handleShortcut)
    }, [])

    const [formData, setFormData] = useState({
        name: "",
        expire: "",
        group: ""
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!formData.name || !formData.expire) {
            alert("Iltimos, barcha maydonlarni to‘ldiring!")
            return
        }

        try {
            const res = await addTask({
                title: formData.name,
                expire: formData.expire,
                group: formData.group
            }).unwrap()

            console.log("✅ Yangi task:", res)
            setFormData({ name: "", expire: "", group: "" })
            setCreateTaskDialog(false)
        } catch (err) {
            console.error("❌ Xatolik:", err)
            alert("Taskni qo‘shishda xatolik bo‘ldi")
        }
    }

    return (
        <div className="fixed bottom-6 right-10 rounded-2xl">
            <Dialog open={createTaskDialog} onOpenChange={setCreateTaskDialog}>
                <DialogTrigger asChild>
                    <button className="flex border items-center justify-center bg-foreground text-background rounded-full shadow-lg duration-300 cursor-pointer group p-4">
                        <span className="group-hover:max-w-20 group-hover:mr-4 max-w-0 overflow-hidden duration-300 text-nowrap leading-[100%]">Add task <br /><span className="text-[12px] leading-[100%] text-zinc-200">ctrl+k</span></span>
                        <Plus size={30} />
                    </button>
                </DialogTrigger>

                <DialogContent className="max-w-sm">
                    <DialogHeader className="text-lg font-semibold">Add New Task</DialogHeader>
                    <form className="space-y-3 py-2" onSubmit={handleAdd}>
                        <Input
                            name="name"
                            placeholder="Task name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <Input
                            name="expire"
                            type="date"
                            value={formData.expire}
                            onChange={handleChange}
                        />

                        <Select
                            value={formData.group}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, group: value }))}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Guruh tanlash" />
                            </SelectTrigger>
                            <SelectContent>
                                {groupsData?.data?.map((group: { id: string; title: string }) =>
                                    <SelectItem key={group.id} value={String(group.id)}>
                                        {group.title}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading} className="w-full mt-5">
                                {isLoading ? "Adding..." : "Add task"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
