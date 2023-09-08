import axios from '@/lib/axios.setup'
import { Kanban, KanbanTask } from '@/models/data/kanban';
import { updateKanbanTasksRequest } from '@/models/requests/kanbanRequests';

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

async function getKanbansByOwner(): Promise<Kanban[]> {
    return (await axios.get("/kanbans/find")).data;
}

const services = { getKanbanById, getKanbanTasksById, getKanbanTaskById, getKanbansByOwner, updateKanbanTasks }

export default services;
