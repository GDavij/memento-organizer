import axios from '@/lib/axios.setup'
import { Kanban, KanbanTask } from '@/models/data/kanban';
import { CreateKanbanRequest, UpdateKanbanColumnsRequest, UpdateKanbanRequest, updateKanbanTasksRequest } from '@/models/requests/kanbanRequests';

async function getKanbanById(id: string): Promise<Kanban> {
    return (await axios.get(`/kanbans/find/${id}`)).data;
}

async function getKanbanTasksById(id: string): Promise<KanbanTask[]> {
    return (await axios.get(`/kanbans/find/${id}/tasks`)).data;
}

async function getKanbanTaskById(id: string): Promise<KanbanTask | null> {
    return (await axios.get(`/kanbans/find/tasks/${id}`)).data;
}

async function updateKanbanTasks(id: string, updateRequest: updateKanbanTasksRequest): Promise<boolean> {
    return (await axios.put(`/kanbans/update/${id}/tasks`, updateRequest)).data;

}

async function updateKanbanColumns(id: string, updateRequest: UpdateKanbanColumnsRequest): Promise<boolean> {
    return (await axios.put(`/kanbans/update/${id}/columns`, updateRequest)).data;
}

async function updateKanban(id: string, updateKanbanRequest: UpdateKanbanRequest): Promise<boolean> {
    return (await axios.put(`/kanbans/update/${id}`, updateKanbanRequest)).data;
}

async function getKanbansByOwner(): Promise<Kanban[]> {
    return (await axios.get("/kanbans/find")).data;
}

async function deleteKanbanById(id: string): Promise<boolean> {
    return (await axios.delete(`/kanbans/delete/${id}`)).data
}

async function createKanban(createKanbanRequest: CreateKanbanRequest): Promise<string> {
    return (await axios.post<{ id: string }>(`/kanbans/new`, createKanbanRequest)).data.id;
}

const services = {
    getKanbanById,
    getKanbanTasksById,
    getKanbanTaskById,
    getKanbansByOwner,
    updateKanbanTasks,
    updateKanban,
    updateKanbanColumns,
    deleteKanbanById,
    createKanban
}

export default services;
