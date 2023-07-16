import { BaseOperation, Editor, Element, Transforms, first, last } from "slate";
import { renderMarkdown } from "./renderer";
import { insertImage } from "./editor.aux";
import s3ImageService from '@/services/s3ImageStorage.service'
import { useImageStorageCacheContext } from "@/app/dashboard/contexts/useImageStorageCacheContext";
import { TBaseNoteData, TNoteTypes, noteTypes } from "@/models/data/editorTypes";
import { toast } from "react-toastify";
import { randomUUID } from "crypto";
export const withImagesFromFiles = (
    editor: Editor
) => {
    console.log("asdadasdsad");
    const { isVoid, apply, deleteBackward, deleteFragment, insertData, redo, undo } = editor;
    editor.isVoid = (element) =>
        element.type === "image" ? true : isVoid(element);

    editor.insertData = async (data) => {
        const { files } = data;
        if (files && files.length > 0 && data.files.length > 0) {

            const firstFile = files[0];

            try {
                let fileId: string | null = localStorage.getItem("actualDraggingImage")
                if (fileId == null) {
                    const formData = new FormData();
                    formData.append("formDataFile", firstFile);
                    const insertImagePromise = s3ImageService.postImage(formData);
                    toast.promise(insertImagePromise, { pending: "Uploading Image to Storage", error: "Could not Upload Image", success: "Image Uploaded With Sucess" });
                    fileId = await insertImagePromise
                }
                await insertImage(editor, fileId)
                if (fileId != null) {
                    localStorage.removeItem("actualDraggingImage");
                }

                return;
            }
            catch (er) {
                return;
            }
        }
        insertData(data);
    }

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
