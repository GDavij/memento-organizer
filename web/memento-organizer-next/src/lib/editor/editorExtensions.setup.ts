import { Editor } from "slate";
import { renderMarkdown } from "./renderer";
import { insertImage } from "./editor.aux";

export const withImagesFromFiles = (editor: Editor) => {
    const { isVoid, insertData } = editor;

    editor.isVoid = (element) =>
        element.type === "image" ? true : isVoid(element);

    editor.insertData = (data) => {
        const { files } = data;
        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader();
                const [mime] = file.type.split("/");

                if (mime === "image") {
                    reader.addEventListener("load", () => {
                        const url: string = reader.result as string;
                        insertImage(editor, url);
                    });

                    reader.readAsDataURL(file);
                }
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
