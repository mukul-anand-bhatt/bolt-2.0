"use client"
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useSidebar } from "../ui/sidebar";

export default function Header() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const { toggleSidebar } = useSidebar();
    return (
        <div className="p-4 flex justify-between items-center">
            {userDetail?.picture ? (
                <div onClick={toggleSidebar} className="cursor-pointer">
                    <Image src={userDetail?.picture} alt="user" width={40} height={40} className="rounded-full" />
                </div>
            ) : (
                <Image src={'/logo.png'} alt="Logo" width={40} height={40} />
            )}
            {
                !userDetail && <div className="flex gap-5">
                    <Button variant="ghost" >SignIn</Button>
                    <Button className="text-white" style={{
                        backgroundColor: Colors.BLUE
                    }}
                    >Get Started
                    </Button>
                </div>
            }
        </div>
    )
}