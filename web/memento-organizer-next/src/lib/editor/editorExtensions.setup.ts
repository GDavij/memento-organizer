import { Editor } from "slate";
import { renderMarkdown } from "./renderer";
import { insertImage } from "./editor.aux";
import s3ImageService from '@/services/s3ImageStorage.service'
import { useImageStorageCacheContext } from "@/app/dashboard/contexts/useImageStorageCacheContext";

export const withImagesFromFiles = (editor: Editor, setIsLoadingImage: (isLoading: boolean) => void) => {
    const { isVoid, insertData } = editor;
    editor.isVoid = (element) =>
        element.type === "image" ? true : isVoid(element);

    editor.insertData = async (data) => {
        const { files, getData, types, items, dropEffect } = data;
        if (files && files.length > 0) {
            setIsLoadingImage(true);
            const firstFile = files[0];
            try {
                const formData = new FormData();
                formData.append("formDataFile", firstFile);
                const fileId = await s3ImageService.postImage(formData);
                await insertImage(editor, fileId)
            }
            catch (er) {
                setIsLoadingImage(false);
                insertData(data);
            }
        } else {
            insertData(data);
        }
    };
    return editor;
};

export const withMarkdown = (editor: Editor) => {
    const { node, select } = editor;
    editor.select = (target) => {
        select(target);
        renderMarkdown(editor, node(target));
    }

    return editor;
};
