import React from 'react';
import Link from 'next/link';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { MessageCircleCode, PanelLeftClose } from 'lucide-react';
import WorkspaceHistory from './WorkspaceHistory';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import { useSidebar } from '@/components/ui/sidebar';

function AppSideBar() {
    const { toggleSidebar } = useSidebar();

    return (
        <Sidebar>
            <SidebarHeader className="p-5">
                <div className='flex justify-between items-center'>
                    <Image src={'/logo.png'} alt='log' width={30} height={30} />
                    <Button onClick={toggleSidebar} variant="ghost" className="h-[30px] w-[30px]" size="icon">
                        <PanelLeftClose />
                    </Button>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-5">
                <Link href={'/'}>
                    <Button className="w-full"> <MessageCircleCode />Start New Chat </Button>
                </Link>
                <SidebarGroup />
                <WorkspaceHistory />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>

    )
}

export default AppSideBar