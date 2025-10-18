import {
    Sidebar,
    SidebarContent,
    // SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { List } from "lucide-react"
import { Link } from "react-router-dom"
// import {
//     Collapsible,
//     CollapsibleContent,
//     CollapsibleTrigger,
// } from "@/components/ui/collapsible"
// import { useGroupCreateMutation, useGroupsQuery } from "@/services/baseApi"
// import { ChevronDown, ChevronRight, PlusCircle } from "lucide-react"
// import { useLocation, useNavigate } from "react-router-dom"
// import { Input } from "./ui/input"
// import { Button } from "./ui/button"
// import React, { useState, useMemo } from "react"
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
// import MaterialSymbolsLightViewListRounded from "./icons/ListIcon"
// import MdiRobot from "./icons/BotIcon"

export function AppSidebar() {
    // const { data: groupsData } = useGroupsQuery("")
    // const navigate = useNavigate()
    // const location = useLocation() // URL dan active guruhni olish
    // const [search, setSearch] = useState("")
    // const [createGroup] = useGroupCreateMutation()
    // const [toggleNewGroupInput, setToggleNewGroupInput] = useState()

    // const filteredGroups = useMemo(() => {
    //     if (!groupsData?.data) return []
    //     return groupsData.data.filter((group: { title: string }) =>
    //         group.title.toLowerCase().includes(search.toLowerCase())
    //     )
    // }, [groupsData, search])

    // function handleCreateGroup(e: React.FormEvent<HTMLFormElement>) {
    //     e.preventDefault()
    //     const formData = new FormData(e.currentTarget)
    //     createGroup({ body: { title: formData.get("title") } }).unwrap()
    //     e.currentTarget.reset()
    // }

    return (
        <Sidebar >
            <SidebarHeader className="bg-white border-b">
                <h1 className="text-2xl font-bold text-center">Task Managment</h1>
            </SidebarHeader>
            <SidebarContent className="bg-white">
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem >
                                <SidebarMenuButton asChild>
                                    <Link to={"/tasks"}>
                                        <List />
                                        <p>Tasks</p>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem >
                                <SidebarMenuButton asChild>
                                    <a href={"/gg"}>
                                        <List />
                                        <p>AI</p>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
