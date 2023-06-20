"use client";
import { Note, TBaseNoteData, TBaseText } from "@/models/data/editorTypes";
import { MdDelete } from "react-icons/md";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";

type TTextEditorImageProps = {
  editor: Editor;
  renderProps: RenderElementProps;
};

export function TextEditorImage(props: TTextEditorImageProps) {
  const path = ReactEditor.findPath(props.editor, props.renderProps.element);
  return (
    <div
      {...props.renderProps.attributes}
      className="flex w-fit h-fit items-start cursor-grab"
    >
      {/* eslint-disable-next-line @next/next/no-img-element*/}
      <img
        src={props.renderProps.element.url!}
        alt={"Image Could not be loaded or is unavaible"}
      />
      <button
        onClick={() => Transforms.removeNodes(props.editor, { at: path })}
        className="flex text-red-500 text-2xl -translate-x-8 z-20 translate-y-2"
      >
        <MdDelete />
      </button>
      {props.renderProps.children}
    </div>
  );
}

type ElementProps = {
  renderProps: RenderElementProps;
  editor: Editor;
};
export function Element(props: ElementProps) {
  switch (props.renderProps.element.type) {
    case "image":
      return (
        <TextEditorImage
          editor={props.editor}
          renderProps={props.renderProps}
        />
      );
    case "heading-1":
      return (
        <h1 className="text-7xl" {...props.renderProps.attributes}>
          {props.renderProps.children}
        </h1>
      );
    case "heading-2":
      return (
        <h2 className="text-6xl" {...props.renderProps.attributes}>
          {props.renderProps.children}
        </h2>
      );
    case "heading-3":
      return (
        <h3 className="text-5xl" {...props.renderProps.attributes}>
          {props.renderProps.children}
        </h3>
      );
    case "heading-4":
      return (
        <h4 className="text-4xl" {...props.renderProps.attributes}>
          {props.renderProps.children}
        </h4>
      );
    case "heading-5":
      return (
        <h5 className="text-3xl" {...props.renderProps.attributes}>
          {props.renderProps.children}
        </h5>
      );
    case "heading-6":
      return (
        <h6 className="text-2xl" {...props.renderProps.attributes}>
          {props.renderProps.children}
        </h6>
      );
    case "unordered-list":
      return (
        <ul
          className=" list-none h-fit w-fit "
          {...props.renderProps.attributes}
        >
          <li className="text-emerald-500 text-xl ">
            {props.renderProps.children}
          </li>
        </ul>
      );
    case "ordered-list":
      return (
        <ul
          className=" list-none h-fit w-fit "
          {...props.renderProps.attributes}
        >
          <li className="text-emerald-500 text-xl ">
            {props.renderProps.children}
          </li>
        </ul>
      );
  }
  return <p {...props.renderProps.attributes}>{props.renderProps.children}</p>;
}

export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}

export function leafDisabled(leaf:TBaseText):JSX.Element {
  if (leaf.bold) {
    return <strong>{leaf.text}</strong>;
  }

  if (leaf.italic) {
    return <em>{leaf.text}</em>;
  }

  if (leaf.underline) {
    return <u>{leaf.text}</u>;
  }

  return <span >{leaf.text}</span>;
}



function ElementDisabled(props: TBaseNoteData) {
  if (props.type === "image") {
    return <p className="truncate">[Embeded Image]</p>;
  }

  return <p className="truncate">{leafDisabled(props.children[0])}</p>;
}

export const renderElementDisabled = (note:Note) => {
  const noteContent:TBaseNoteData[] = JSON.parse(note.content);
  const nodes = noteContent.length === 1 && noteContent[0].children[0].text == "" ? 
  (
    <div>
      <div>No Content here</div>
      <div>Start Writing Something!</div> 
    </div>
  )
    : noteContent.map((data,i) => <ElementDisabled key={note.id + i} {...data} />);
    
  return nodes;
}

export const renderElement = (
  props: RenderElementProps,
  editor: Editor,
) => <Element renderProps={props} editor={editor} />;

export const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;
