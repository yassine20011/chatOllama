import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from 'uuid';
import MarkdownView from 'react-showdown';
import axiosInstance from "@/conf/axois-instance";
import { useNavigate } from "react-router-dom";

interface Message {
    id?: string;
    role: "user" | "assistant";
    content: string;
    loading?: boolean;
}

const createConversation = async () => {
    const req = await axiosInstance.get('/v1/create/conversation');
    console.log(req.data.id);
    return req.data;
}


export default function Page() {

    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([{ id: uuidv4(), role: "assistant", content: "Hello! I'm Ollama. How can I help you today?", loading: false }]);
    const [input, setInput] = useState("");


    const chatEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom whenever messages are updated
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleReceiveMessage = async (userInput: string) => {

        const path = window.location.pathname;
        console.log(path);
        if (path === "/chat/c/" || path === "/chat/c" || path === "/chat/c#") {
            const { id } = await createConversation();
            navigate(`/chat/${id}`);
        }

        
        const updatedMessages: Message[] = [...messages, { id: uuidv4(), role: "user", content: userInput, loading: true }, { id: uuidv4(), role: "assistant", content: "Thinking...", loading: true }];
        setMessages(updatedMessages);

        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ model: "llama3.2", messages: updatedMessages }),
            });

            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let done = false;
                let botMessage = '';

                while (!done) {
                    const { value, done: readerDone } = await reader.read();
                    done = readerDone;
                    if (value) {
                        const text = decoder.decode(value);
                        const json = JSON.parse(text);
                        botMessage += json.message.content;

                        // Update the last message with the current botMessage
                        setMessages((prev) => {
                            const newMessages = [...prev];
                            newMessages[newMessages.length - 1].content = botMessage;
                            return newMessages;
                        });
                    }
                }

                // Final update to set loading to false
                setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].loading = false;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error(error);
        }
    };


    const handleSendMessage = () => {
        if (input.trim() === "") {
            return;
        }

        console.log(input);

        setMessages([
            ...messages,
            {
                id: uuidv4(),
                role: "user",
                content: input,
            },
        ]);
        handleReceiveMessage(input);
        setInput("");
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    }



    return (
        <>
            <SidebarProvider defaultOpen={false}>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-col h-full">
                        <div className="sticky top-0 p-2">
                            <SidebarTrigger />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="gap-1 rounded-xl px-3 h-10 data-[state=open]:bg-muted text-lg"
                                    >
                                        Ollama<span className="text-muted-foreground">3.2</span>
                                    </Button>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </div>
                        <div className="flex flex-col items-start flex-1 max-w-2xl gap-8 px-4 mx-auto">
                            {
                                messages.map((message) => {

                                    if (message.role === "user") {
                                        return (
                                            <div key={message.id} className="flex items-start gap-4">
                                                <div className="grid gap-1">
                                                    <div className="font-bold">You</div>
                                                    <div className="prose text-muted-foreground">
                                                        <p>{message.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    else {
                                        return (
                                            <div className="flex items-start gap-4" key={message.id}>
                                                <div className="grid gap-1">
                                                    <div className="font-bold">Ollama</div>
                                                    <div className="prose text-muted-foreground">
                                                        <MarkdownView markdown={message.content} options={{ tables: true, emoji: true }} />
                                                    </div>
                                                    <div className="flex items-center gap-2 py-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                                                        >
                                                            <ClipboardIcon className="w-4 h-4" />
                                                            <span className="sr-only">Copy</span>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                                                        >
                                                            <ThumbsUpIcon className="w-4 h-4" />
                                                            <span className="sr-only">Upvote</span>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                                                        >
                                                            <ThumbsDownIcon className="w-4 h-4" />
                                                            <span className="sr-only">Downvote</span>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-4 h-4 hover:bg-transparent text-stone-400 hover:text-stone-900"
                                                        >
                                                            <RefreshCcwIcon className="w-4 h-4" />
                                                            <span className="sr-only">Regenerate</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            }

                        </div>

                        <div className="max-w-2xl w-full mx-auto py-2 flex flex-col gap-1.5 px-4 bg-background">
                            <div className="relative">
                                <Textarea
                                    placeholder="Message Ollama..."
                                    name="message"
                                    id="message"
                                    rows={1}
                                    className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
                                    onKeyDown={(e) => {
                                        handleKeyDown(e);
                                    }}
                                    onChange={(e) => setInput(e.target.value)}
                                    value={input}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="absolute w-8 h-8 top-3 right-3"
                                    onClick={() => {
                                        console.log("Send message");
                                        handleSendMessage();
                                    }}
                                >
                                    <ArrowUp className="w-4 h-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                            <p className="text-xs font-medium text-center text-neutral-700">
                                Ollama can make mistakes. Consider checking important
                                information.
                            </p>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
            <div ref={chatEndRef} />
        </>
    );
}

function ClipboardIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        </svg>
    );
}

function RefreshCcwIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
        </svg>
    );
}

function ThumbsDownIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
        </svg>
    );
}

function ThumbsUpIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
    );
}
