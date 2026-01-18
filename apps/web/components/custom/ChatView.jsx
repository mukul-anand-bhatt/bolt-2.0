"use client"
import React from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useState } from 'react'
import { MessageContext } from '@/context/MessagesContext'
import { useContext } from 'react'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext'
import Image from 'next/image'
import Lookup from '@/data/Lookup'
import { ArrowRight } from 'lucide-react'
import { Link } from 'lucide-react'

const ChatView = () => {

    const { id } = useParams();
    const { messages, setMessages } = useContext(MessageContext);
    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    const [userInput, setUserInput] = useState('');
    useEffect(() => {
        id && GetMessages();
    }, [id]);

    const GetMessages = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${id}`);
            const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    const onGenerate = async (input) => {
        if (!input) return;

        try {
            // Optimistic update
            const userMsg = { role: 'user', content: input };
            setMessages(prev => [...(Array.isArray(prev) ? prev : []), userMsg]);
            setUserInput('');

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`, {
                workspaceId: id,
                message: input
            });

            const aiMsg = { role: 'ai', content: response.data.result };
            setMessages(prev => [...(Array.isArray(prev) ? prev : []), aiMsg]);
            setUserInput('');

        } catch (error) {
            console.error("Error generating response:", error);
        }
    }

    return (
        <div className='relative h-[85vh] flex flex-col gap-5'>
            <div className='flex-1 overflow-y-scroll scrollbar-hide'>

                {messages?.map((msg, index) => (
                    <div key={index}
                        className='p-3 rounded-lg mb-2 flex gap-2 items-start'
                        style={{
                            backgroundColor: Colors.CHAT_BACKGROUND
                        }}>
                        {msg?.role == 'user' &&
                            <Image src={userDetail?.picture} alt="userImage"
                                width={50}
                                height={50}
                                className='rounded-full'
                            />
                        }
                        <h2>{msg.content}</h2>
                    </div>
                ))}
            </div>
            {/* Input Section */}
            <div
                className="p-5 border rounded-xl max-w-2xl w-full mt-3"
                style={{
                    backgroundColor: Colors.BACKGROUND,
                }}
            >
                <div className="flex gap-2">
                    <textarea
                        placeholder={Lookup.INPUT_PLACEHOLDER}
                        className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
                        value={userInput}
                        onChange={(event) => setUserInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault(); // Prevent newline
                                if (userInput) onGenerate(userInput);
                            }
                        }}
                    />
                    {userInput && (
                        <ArrowRight
                            onClick={() => onGenerate(userInput)}
                            className="bg-blue-500 p-2 w-10 h-10 rounded-md cursor-pointer"
                        />
                    )}
                </div>
                <div>
                    <Link className="h-5 w-5" />
                </div>
            </div>



        </div>
    )
}

export default ChatView;