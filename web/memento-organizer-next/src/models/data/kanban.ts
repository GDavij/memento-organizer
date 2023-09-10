export type Kanban = {
    id: string;
    owner: string;
    name: string;
    description: string;
    columns: KanbanColumn[];
    issued: string;
    lastUpdate: string;
}

export type KanbanColumn = {
    id: string
    owner: string
    name: string
    order: number
    issued: string
    lastUpdate: string
}


export type KanbanTask = {
    id: string;
    owner: string;
    name: string;
    content: string;
    column: string;
    issued: string;
    lastUpdate: string;
}