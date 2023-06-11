import { MdDelete } from "react-icons/md";
import { Editor, NodeEntry, Transforms } from "slate";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";

export const renderMarkdown = (editor: Editor, nodeEntry: NodeEntry) => {
  let text = (nodeEntry[0] as { text: string }).text;
  console.log({ subject: "renderer", text: text });
  if (text) {
    let headers = 0;
    if (text[0] === "#") {
      headers++;
      for (let i = 1; i < 6; i++) {
        if (text[i] === "#") {
          headers++;
        }
      }
      if (text[headers] == " ") {
        switch (headers) {
          case 1:
            Transforms.setNodes(editor, {
              type: "heading-1",
            });
            break;
          case 2:
            Transforms.setNodes(editor, {
              type: "heading-2",
            });
            break;
          case 3:
            Transforms.setNodes(editor, {
              type: "heading-3",
            });
            break;
          case 4:
            Transforms.setNodes(editor, {
              type: "heading-4",
            });
            break;
          case 5:
            Transforms.setNodes(editor, {
              type: "heading-5",
            });
            break;
          case 6:
            Transforms.setNodes(editor, {
              type: "heading-6",
            });
            break;
        }
        return;
      }
    }
    const orderedListProbability = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ];
    if (orderedListProbability.includes(text[0])) {
      if (text[1] === "." && text[2] == " ") {
        Transforms.setNodes(editor, { type: "ordered-list" });
        return;
      } else {
        let isOrdered = 0;
        let i = 0;
        while (i < text.length - 2) {
          if (orderedListProbability.includes(text[i])) {
            isOrdered++;
          }
          i++;
        }

        if (text[isOrdered] === "." && text[isOrdered + 1] === " ") {
          Transforms.setNodes(editor, { type: "ordered-list" });
          return;
        }
      }
    }
    if (text[0] === "-" && text[1] === " ") {
      Transforms.setNodes(editor, { type: "unordered-list" });
      return;
    }
    Transforms.setNodes(editor, {
      type: "paragraph",
    });
  } else if (text === "") {
    Transforms.setNodes(editor, {
      type: "paragraph",
    });
  }
};
