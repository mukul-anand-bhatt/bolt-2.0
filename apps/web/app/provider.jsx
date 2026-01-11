"use client"

import React, { useContext } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { MessageContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({children}) {
    const [messages, setMessages] = useState();
    const [userDetail, setUserDetail] = useState();
    return (
    <div>
        <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
        <MessageContext.Provider value={{messages, setMessages}}>
            <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            >
                <Header/>
                    {children}
            </NextThemesProvider>
        </MessageContext.Provider>
        </UserDetailContext.Provider>
    </div>
    )
}




export default Provider;
