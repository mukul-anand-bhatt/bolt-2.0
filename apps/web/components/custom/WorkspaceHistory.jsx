"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import React, { useContext, useEffect, useState } from 'react'
import { useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';
import axios from 'axios';

function WorkspaceHistory() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const [workspaceList, setWorkspaceList] = useState([]);
    const { toggleSidebar } = useSidebar();

    useEffect(() => {
        userDetail && GetAllWorkspace();
    }, [userDetail])

    const GetAllWorkspace = async () => {
        try {
            const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workspace/${userDetail?.email}`);
            setWorkspaceList(result.data);
            console.log(result.data);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <h2 className='font-medium text-lg mb-4 ml-4'>Your Chats</h2>
            <div className='flex flex-col'>
                {workspaceList && workspaceList.map((workspace, index) => (
                    <Link href={'/workspace/' + workspace?.id} key={index}>
                        <h2 onClick={toggleSidebar} className='text-sm text-gray-400 mt-2 font-light hover:text-white cursor-pointer hover:bg-gray-800 p-2 rounded-lg pl-4'>
                            {workspace?.messages && JSON.parse(workspace?.messages)[0]?.content}
                        </h2>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default WorkspaceHistory