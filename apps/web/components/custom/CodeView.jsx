"use client"
import React, { useContext, useEffect, useState } from 'react'
import {
    SandpackProvider,
    SandpackLayout,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import axios from 'axios';
import Lookup from '@/data/Lookup';
// import { MessagesContext } from '@/contexts/MessagesContext';

function CodeView() {
    const [activeTab, setActiveTab] = useState('preview')
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE)
    // const { messages, setMessages } = useContext(MessagesContext)


    return (
        <div className='relative'>
            <div className='bg-[#181818] w-full p-2 border'>
                <div className='flex items-center gap-3 bg-black rounded-full w-[140px] p-1 justify-center'>
                    <h2
                        className={`text-sm cursor-pointer px-2 py-1 rounded-full ${activeTab === 'code' ? 'text-blue-500 bg-blue-900 bg-opacity-15' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('code')}
                    >
                        Code
                    </h2>
                    <h2
                        className={`text-sm cursor-pointer px-2 py-1 rounded-full ${activeTab === 'preview' ? 'text-blue-500 bg-blue-900 bg-opacity-15' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </h2>
                </div>
            </div>
            <SandpackProvider template="react" theme='dark'
                files={Lookup.DEFAULT_FILE}
                options={{
                    externalResources: ['https://cdn.tailwindcss.com']
                }}
            >
                <SandpackLayout>
                    {activeTab === 'code' ? (
                        <>
                            <SandpackFileExplorer style={{ height: "80vh" }} />
                            <SandpackCodeEditor style={{ height: "80vh" }} />
                        </>
                    ) : (
                        <SandpackPreview style={{ height: "80vh" }} showNavigator={true} showOpenInCodeSandbox={false} showRefreshButton={true} />
                    )}
                </SandpackLayout>
            </SandpackProvider>
        </div>
    )
}

export default CodeView