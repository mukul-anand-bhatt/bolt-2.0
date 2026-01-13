"use client"

import React, { useContext, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { MessageContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

function Provider({ children }) {
    const [messages, setMessages] = useState();
    const [userDetail, setUserDetail] = useState();
    return (
        <div>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
                <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                    <MessageContext.Provider value={{ messages, setMessages }}>
                        <NextThemesProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <Header />
                            {children}
                        </NextThemesProvider>
                    </MessageContext.Provider>
                </UserDetailContext.Provider>
            </GoogleOAuthProvider>
        </div>
    )
}




export default Provider;
