import { convertToRaw, ContentState, EditorState } from 'draft-js';
import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function Edit(props: any) {
    const [editorState, setEditorState] = useState<any>()
    console.log(props.content)

    useEffect(() => {
        setContent()
    }, [props.content])

    const setContent = () => {
        const html = props.content
        if (html === undefined) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }

    return (
        <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={(value) => setEditorState(value)}
            onBlur={() => props.getContent(draftToHtml(convertToRaw(editorState?.getCurrentContent())))}
        />
    )
}
