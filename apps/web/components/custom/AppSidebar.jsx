import React, { useContext } from 'react';
import Link from 'next/link';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { MessageCircleCode, PanelLeftClose, LogOut } from 'lucide-react';
import WorkspaceHistory from './WorkspaceHistory';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { UserDetailContext } from '@/context/UserDetailContext';
import { googleLogout } from '@react-oauth/google';
import { useRouter } from "next/navigation";


function AppSideBar() {
    const { toggleSidebar } = useSidebar();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const router = useRouter();

    const onLogout = () => {
        googleLogout();
        localStorage.removeItem('user');
        setUserDetail(null);
        toggleSidebar();
        router.push('/');
    }

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
            <SidebarFooter>
                {userDetail && (
                    <Button onClick={onLogout} variant="ghost" className="w-full justify-start">
                        <LogOut /> Log Out
                    </Button>
                )}
            </SidebarFooter>
        </Sidebar>

    )
}

export default AppSideBar