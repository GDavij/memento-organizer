'use client';
import Loader from '@/app/components/Loader';
import { useEditor } from '@/app/dashboard/contexts/editor/useEditor';
import { useImageStorageCacheContext } from '@/app/dashboard/contexts/useImageStorageCacheContext';
import { Note, TBaseNoteData, TBaseText } from '@/models/data/editorTypes';
import s3ImageStorageService from '@/services/s3ImageStorage.service';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';

type TTextEditorImageProps = {
  editor: Editor;
  renderProps: RenderElementProps;
};

export function TextEditorImage(props: TTextEditorImageProps) {
  const { hasCached, addCache, hasCachedOnTrash } =
    useImageStorageCacheContext();

  const url = props.renderProps.element.url!;
  const imageB64 = hasCached(url);

  const path = ReactEditor.findPath(props.editor, props.renderProps.element);

  if (imageB64 == null) {
    s3ImageStorageService
      .findImage(url)
      .then((fileData) => {
        addCache(url!, fileData);
      })
      .catch(async (er) => {
        const dataFromTrash = hasCachedOnTrash(url);
        if (dataFromTrash) {
          const dataBytesStr = atob(dataFromTrash);
          const bytesData = new Uint8Array(dataBytesStr.length);
          for (let i = 0; i < dataBytesStr.length; i++)
            bytesData[i] = dataBytesStr.charCodeAt(i);

          const file = new File([bytesData], 'Download.jpeg', {
            type: 'image/jpeg',
          });
          const formData = new FormData();
          formData.append('formDataFile', file);
          const reUploadImage = s3ImageStorageService.postImage(formData);
          toast.promise(reUploadImage, {
            pending: 'Re-uploading Image from storage',
            error: 'Could not Re-upload Image',
            success: 'Re-upload Image with Sucess',
          });
          const fileId = await reUploadImage;
          addCache(fileId, dataFromTrash);
          Transforms.insertNodes(props.editor, {
            type: 'image',
            url: fileId,
            children: [{ text: '' }],
          });
        } else {
          Transforms.removeNodes(props.editor, { at: path });
        }
      });
  }

  return imageB64 ? (
    <>
      <div
        {...props.renderProps.attributes}
        contentEditable={false}
        onDragStart={() => {
          localStorage.setItem('actualDraggingImage', url);
        }}
        className="flex w-full h-fit items-start cursor-grab justify-center px-8"
      >
        {/* eslint-disable-next-line @next/next/no-img-element*/}
        <div className="w-fit h-full  border-4 rounded-lg border-slate-300 dark:border-slate-800 bg-slate-300 dark:bg-slate-800">
          <img
            src={'data:image/jpeg;base64,' + imageB64!}
            alt={`Image ${url} Could not be loaded or is unavaible`}
            className="rounded-lg"
          />
        </div>
        <button
          onClick={() => Transforms.removeNodes(props.editor, { at: path })}
          className="flex text-red-500 text-2xl bg-slate-300 dark:bg-slate-800 -translate-x-[4px] translate-y-[50%] rounded-r-lg p-2"
        >
          <MdDelete />
        </button>
        {props.renderProps.children}
      </div>
      <div></div>
    </>
  ) : (
    <div
      contentEditable={false}
      className="border-4 border-slate-200 dark:border-slate-800 rounded-lg p-4"
      {...props.renderProps.attributes}
    >
      <Loader loadingText={`Trying to Load Image ${url}`} />
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
    case 'image':
      return (
        <TextEditorImage
          editor={props.editor}
          renderProps={props.renderProps}
        />
      );
    case 'heading-1':
      return (
        <h1
          className="text-[2.8em] leading-[1.2em]"
          {...props.renderProps.attributes}
        >
          {props.renderProps.children}
        </h1>
      );
    case 'heading-2':
      return (
        <h2
          className="text-[2.4em] leading-[1.2em]"
          {...props.renderProps.attributes}
        >
          {props.renderProps.children}
        </h2>
      );
    case 'heading-3':
      return (
        <h3
          className="text-[2em] leading-[1.2em]"
          {...props.renderProps.attributes}
        >
          {props.renderProps.children}
        </h3>
      );
    case 'heading-4':
      return (
        <h4
          className="text-[1.8em] leading-[1.2em]"
          {...props.renderProps.attributes}
        >
          {props.renderProps.children}
        </h4>
      );
    case 'heading-5':
      return (
        <h5
          className="text-[1.8em] leading-[1.2em]"
          {...props.renderProps.attributes}
        >
          {props.renderProps.children}
        </h5>
      );
    case 'heading-6':
      return (
        <h6
          className="text-[1.8em] leading-[1.2em]"
          {...props.renderProps.attributes}
        >
          {props.renderProps.children}
        </h6>
      );
    case 'unordered-list':
      return (
        <ul
          className=" list-none h-fit w-fit "
          {...props.renderProps.attributes}
        >
          <li className="text-emerald-500 text-[1.2em] ">
            {props.renderProps.children}
          </li>
        </ul>
      );
    case 'ordered-list':
      return (
        <ul
          className=" list-none h-fit w-fit "
          {...props.renderProps.attributes}
        >
          <li className="text-emerald-500 text-[1.2em] ">
            {props.renderProps.children}
          </li>
        </ul>
      );
  }
  return (
    <p
      className="text-[1.2em] text-slate-500 dark:text-slate-400"
      {...props.renderProps.attributes}
    >
      {props.renderProps.children}
    </p>
  );
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

export function leafDisabled(leaf: TBaseText): JSX.Element {
  if (leaf.bold) {
    return <strong>{leaf.text}</strong>;
  }

  if (leaf.italic) {
    return <em>{leaf.text}</em>;
  }

  if (leaf.underline) {
    return <u>{leaf.text}</u>;
  }

  return <span>{leaf.text}</span>;
}

function ElementDisabled(props: TBaseNoteData) {
  if (props.type === 'image') {
    return <p className="truncate">[Embeded Image]</p>;
  }

  return <p className="truncate">{leafDisabled(props.children[0])}</p>;
}

export const renderElementDisabled = (note: Note) => {
  const noteContent: TBaseNoteData[] = JSON.parse(note.content);
  const nodes =
    noteContent.length === 1 && noteContent[0].children[0].text == '' ? (
      <div>
        <div>No Content here</div>
        <div>Start Writing Something!</div>
      </div>
    ) : (
      noteContent.map((data, i) => (
        <ElementDisabled key={note.id + i} {...data} />
      ))
    );

  return nodes;
};

export const renderElement = (props: RenderElementProps, editor: Editor) => (
  <Element renderProps={props} editor={editor} />
);

export const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;
