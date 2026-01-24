"use client"
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { MessageContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SignInDialog from "./SignInDialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import Prompt from "@/config/Prompt";
import { Loader2 } from "lucide-react";

export default function Hero() {

  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessageContext)
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false)
  const { setOpen } = useSidebar();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(false)
  }, [])

  const onGenerate = async (input) => {
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
    setLoading(true);

    // 1. Construct the message for the UI
    const msg = {
      role: 'user',
      content: input
    };
    setMessages([msg]);

    try {
      // 2. Generate Code using the new AI Endpoint
      // We combine the system prompt with the user's idea
      const fullPrompt = `${Prompt.CODE_GEN_PROMPT}\nUser Request: ${input}`;

      const aiResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gen-code`, {
        prompt: fullPrompt
      });

      console.log('AI Response:', aiResponse.data);

      // 3. Parse the JSON response
      // It might be wrapped in ```json ... ```
      let generatedData = aiResponse.data.result;
      if (typeof generatedData === 'string') {
        generatedData = generatedData.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
          generatedData = JSON.parse(generatedData);
        } catch (e) {
          console.error("Failed to parse AI JSON:", e);
          // Fallback or error handling? For now, we might proceed with text or alert
        }
      }

      // 4. Create Workspace with the generated data
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/workspace`, {
        user: userDetail?.email,
        messages: JSON.stringify([msg]), // We store the user's initial message
        fileData: generatedData ? JSON.stringify(generatedData) : null
      });

      console.log('Workspace created:', response.data);

      if (response.data && response.data.id) {
        setOpen(true);
        router.push(`/workspace/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center mt-36 xl:mt-42 gap-2">
      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
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

      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-3">
        {Lookup.SUGGSTIONS.map((suggestion, index) => (
          <h2
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
            key={index}
            onClick={() => onGenerate(suggestion)}
          >
            {suggestion}
          </h2>
        ))}
      </div>
      <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
      {loading && <div className="absolute top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm flex items-center justify-center flex-col z-50">
        <Loader2 className="animate-spin h-10 w-10 text-white" />
        <h2 className="text-white mt-4 font-semibold">Generating your project...</h2>
      </div>}
    </div>
  )
}