"use client"

import React, { useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Header from "@/components/custom/Header";
import { MessageContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
function Provider({ children }) {
    const [messages, setMessages] = useState();
    const [userDetail, setUserDetail] = useState();

    useEffect(() => {
        IsAuthenticated();
    }, [])
    const IsAuthenticated = async () => {
        // [Refactor] Environment Check
        // Why: 'typeof window' returns a string "undefined" when server-side rendering, 
        // preventing hydration mismatches or server crashes.
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');

            // [Refactor] Safe Access
            // Why: Parsing null/undefined or accessing properties on them causes runtime errors.
            if (!userStr) return;

            const user = JSON.parse(userStr);
            if (!user?.email) return;

            try {
                const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user?email=${user.email}`);
                setUserDetail(result?.data);
            } catch (error) {
                // Why: API might return 404 if user not found, we shouldn't crash the app.
                console.error("Error fetching user details:", error);
            }
        }
    }


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
