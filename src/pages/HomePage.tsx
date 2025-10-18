import { Circle, CircleCheckBig, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CardItem from "@/components/CardItem/CardItem";
import { useGetTasksQuery, useUpdateTaskMutation } from "@/services/baseApi";
import type { TaskType, stageType } from "@/types/types";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverEvent,
    useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BottomPanel from "@/components/shared/BottomPanel";

function DroppableContainer({
    id,
    children,
    className,
}: {
    id: string;
    children: React.ReactNode;
    className?: string;
}) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className={className}>
            {children}
        </div>
    );
}

export default function HomePage() {
    const { id } = useParams()
    const [updateTask] = useUpdateTaskMutation();
    const [activeTask, setActiveTask] = useState<TaskType | null>(null);
    const { data } = useGetTasksQuery(id);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const allTasks = [
            ...(data?.data?.success || []),
            ...(data?.data?.progress || []),
            ...(data?.data?.todo || []),
        ];
        const task = allTasks.find((t: TaskType) => t.id === active.id);
        setActiveTask(task || null);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        if (!over) return;

        console.log("Drag over container:", over.id);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.id;

        let newStatus = over.id as stageType;

        const allTasks = [
            ...(data?.data?.success || []),
            ...(data?.data?.progress || []),
            ...(data?.data?.todo || []),
        ];

        const overTask = allTasks.find((t: TaskType) => t.id === over.id);
        if (overTask) {
            newStatus = overTask.status;
        }

        const task = allTasks.find((t: TaskType) => t.id === taskId);

        if (task && task.status !== newStatus) {
            try {
                await updateTask({ status: newStatus, id: taskId }).unwrap();
            } catch (err) {
                console.error("❌ Status update failed:", err);
            }
        }
    };
    useEffect(() => console.log(data), [data])


    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <section className="space-y-3 min-h-screen w-full p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className={cn("text-md text-zinc-600 flex items-center gap-4")}>
                            <Badge className={cn("bg-green-500")}>
                                <CircleCheckBig /> success
                            </Badge>
                            <Badge className={cn("bg-green-500")}>{data?.data?.success?.length || 0}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DroppableContainer id="success">
                            <SortableContext
                                items={data?.data?.success?.map((t: TaskType) => t.id) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                {data?.data?.success?.map((task: TaskType, index: number) => (
                                    <CardItem key={task.id} stage="success" data={task} isFirst={index == 0} />
                                ))}
                            </SortableContext>
                        </DroppableContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className={cn("text-md text-zinc-600 flex items-center gap-4")}>
                            <Badge className={cn("bg-yellow-500")}>
                                <Circle /> in-progress
                            </Badge>
                            <Badge className={cn("bg-yellow-500")}>{data?.data?.progress?.length || 0}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DroppableContainer id="in-progress">
                            <SortableContext
                                items={data?.data?.progress?.map((t: TaskType) => t.id) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                {data?.data?.progress?.map((task: TaskType, index: number) => (
                                    <CardItem key={task.id} stage="in-progress" data={task} isFirst={index == 0} />
                                ))}
                            </SortableContext>
                        </DroppableContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className={cn("text-md text-zinc-600 flex items-center gap-4")}>
                            <Badge className={cn("bg-zinc-500")}>
                                <LoaderCircle /> to-do
                            </Badge>
                            <Badge className={cn("bg-zinc-500")}>{data?.data?.todo?.length || 0}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DroppableContainer id="to-do">
                            <SortableContext
                                items={data?.data?.todo?.map((t: TaskType) => t.id) || []}
                                strategy={verticalListSortingStrategy}
                            >
                                {data?.data?.todo?.map((task: TaskType, index: number) => (
                                    <CardItem key={task.id} stage="to-do" data={task} isFirst={index == 0} />
                                ))}
                            </SortableContext>
                        </DroppableContainer>
                    </CardContent>
                </Card>
                <BottomPanel />
            </section>

            <DragOverlay>
                {activeTask ? (
                    <div className="bg-white shadow-lg rounded-lg p-3 border-2 border-blue-400 opacity-90">
                        <p className="text-sm font-medium">{activeTask.title}</p>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
