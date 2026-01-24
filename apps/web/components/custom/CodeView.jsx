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

import { useParams } from 'next/navigation';

function CodeView() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code')
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE)

    useEffect(() => {
        if (id) {
            GetFiles();
        }
    }, [id])

    const GetFiles = async () => {
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workspace/${id}`);
            const generatedFileString = result.data.fileData;

            if (generatedFileString) {
                const parsedFiles = JSON.parse(generatedFileString).files;
                setFiles(parsedFiles);
            } else {
                setFiles(Lookup.DEFAULT_FILE);
            }
        } catch (e) {
            console.error(e);
        }
    }


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
            <SandpackProvider
                key={id} // Force re-render when user switches workspace or new code is generated
                template="react"
                theme='dark'
                files={files}
                customSetup={{
                    dependencies: {
                        "lucide-react": "^0.469.0",
                        "date-fns": "^4.1.0",
                        "react-chartjs-2": "^5.3.0",
                        "chart.js": "^4.4.7",
                        "firebase": "^11.1.0",
                        "@google/generative-ai": "^0.21.0"
                    }
                }}
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