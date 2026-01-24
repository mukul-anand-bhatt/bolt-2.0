"use client"
import React, { useState, useContext } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useSidebar } from "../ui/sidebar";
import SignInDialog from "./SignInDialog";


export default function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const { toggleSidebar } = useSidebar();
    const [openDialog, setOpenDialog] = useState(false);

    return (
        <div className="p-4 flex justify-between items-center">
            {userDetail?.picture ? (
                <div onClick={() => toggleSidebar()} className="cursor-pointer">
                    <Image src={userDetail?.picture} alt="user" width={40} height={40} className="rounded-full" />
                </div>
            ) : (
                <Image src={'/logo.png'} alt="Logo" width={40} height={40} />
            )}
            {
                !userDetail && <div className="flex gap-5">
                    <Button variant="ghost" onClick={() => setOpenDialog(true)} >SignIn</Button>
                    <Button className="text-white" style={{
                        backgroundColor: Colors.BLUE
                    }}
                        onClick={() => setOpenDialog(true)}
                    >Get Started
                    </Button>
                </div>
            }
            <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
        </div>
    )
}