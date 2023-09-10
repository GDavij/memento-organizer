export type updateKanbanTasksRequest = {
    add: kanbanTaskAddRequest[];
    replace: kanbanTaskReplaceRequest[];
    delete: string[];
}

export type kanbanTaskAddRequest = {
    name?: string
    content?: string
    column?: string
}

export type kanbanTaskReplaceRequest = {
    id: string;
    name?: string;
    content?: string;
    column?: string;
}

export type UpdateKanbanColumnsRequest = {
    add: AddKanbanColumnRequest[];
    replace: ReplaceKanbanColumnRequest[];
    delete: string[];
}

export type AddKanbanColumnRequest = {
    name: string;
    order: number;
}

export type ReplaceKanbanColumnRequest = {
    id: string;
    columnToReplaceId: string;
}


export type UpdateKanbanRequest = {
    name?: string
    description?: string
}