import { AppSidebar } from "@/components/app-sidebar";
import { useToast } from "@/hooks/use-toast";
import { Pen } from "lucide-react"
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
import { useNavigate } from "react-router-dom";
import {
    createConversation,
    createMessage,
    fetchMessages,
    checkConversationExists,
    createConversationWithOutTitle
} from "@/utils/func";
import {
    ClipboardIcon,
    ThumbsUpIcon,
    ThumbsDownIcon,
    RefreshCcwIcon
}
    from "@/components/icons";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


interface Message {
    id?: string;
    role: "user" | "assistant";
    content: string;
    loading?: boolean;
}

interface conversation {
    id: string;
    userId: string;
    title: string;
    createdAt: Date;
}



export default function Page() {

    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([{ id: uuidv4(), role: "assistant", content: "Hello! I'm Ollama. How can I help you today?", loading: false }]);
    const [input, setInput] = useState("");
    const [conversation, setConversation] = useState<conversation | null>(null);
    const path = window.location.pathname;
    const { toast } = useToast()
    const chatEndRef = useRef<HTMLDivElement>(null);


    // Fetch conversation and messages on page load
    useEffect(() => {
        const conversationId = path.split("/").pop();
        if (conversationId) {
            checkConversationExists(conversationId).then((data) => {
                if (data.error === "Conversation not found") {
                    navigate("/chat/c/");
                    toast({
                        title: "Error",
                        description: "Conversation not found"
                    });
                }
                else {
                    setConversation(data);
                    fetchMessages(data.id).then((data) => {
                        if (data.length > 0) {
                            setMessages(() => {
                                const dbMessages = data.flatMap((msg: any) => [
                                    {
                                        id: uuidv4(),
                                        role: "user",
                                        content: msg.userInput
                                    },
                                    {
                                        id: uuidv4(),
                                        role: "assistant",
                                        content: msg.modelResponse
                                    }
                                ]);
                                console.log("Flatmap", dbMessages);
                                return dbMessages;
                            })
                        } else if (data.length === 0) {
                            setMessages([{ id: uuidv4(), role: "assistant", content: "Hello! I'm Ollama. How can I help you today?", loading: false }]);
                        }
                    });
                }
            }).catch((error) => {
                console.error(error);
                toast({
                    title: "Error",
                    description: error.message
                });
                navigate("/chat/c/");
            })
        }
    }
        , [path]);



    // Scroll to the bottom whenever messages are updated
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleReceiveMessage = async (userInput: string) => {

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
                if (conversation) {
                    createMessage(conversation?.id, userInput, botMessage);
                }

                if (path === "/chat/c/" || path === "/chat/c" || path === "/chat/c#") {
                    const conversationText = updatedMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
                    const { id } = await createConversation(conversationText);
                    navigate(`/chat/c/${id}`);
                }

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
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger onClick={() => createConversationWithOutTitle().then((data) => navigate(`/chat/c/${data.id}`))}>
                                        <Pen className="w-5 h-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>New conversation</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
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

