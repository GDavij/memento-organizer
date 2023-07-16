import axios from '@/lib/axios.setup'

async function postImage(data: FormData): Promise<string> {
    const imageId = (await axios.post<{ fileId: string }>("/storage/images/new", data)).data.fileId;
    return imageId;
}

async function findImage(imageId: string): Promise<string> {
    const b64Image = (await axios.get<{ b64Image: string }>(`/storage/images/find/${imageId}`)).data.b64Image
    return b64Image;
}

async function deleteImage(imageId: string): Promise<boolean> {
    return (await axios.delete<boolean>(`/storage/images/delete/${imageId}`)).data
}

const service = {
    postImage,
    findImage,
    deleteImage
}

export default service;