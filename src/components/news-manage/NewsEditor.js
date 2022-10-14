import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw,ContentState,EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect } from "react";

export default function NewsEditor(props) {

    const [editorState,setEditorState] = useState("")

    useEffect(()=>{
        // console.log(props.content);
        // 把html转换draft
        const html = props.content;
        if (html === null) return
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          setEditorState(editorState)
        }
    },[props.content])

    return (   
        <div>
           <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={(editorState)=>setEditorState(editorState)}

            onBlur={()=> {
                // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            }}
            />
        </div>
    )
}