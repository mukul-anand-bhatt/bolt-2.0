import React from 'react'
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
} from "@codesandbox/sandpack-react";

const CodeView = () => {
    return (
        <div>
            <SandpackProvider template="react" theme={"dark"}>
                <SandpackLayout>
                    <SandpackCodeEditor />
                    <SandpackPreview />
                </SandpackLayout>
            </SandpackProvider>
        </div>
    )
}

export default CodeView