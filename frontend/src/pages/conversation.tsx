import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from 'lucide-react';
import { useState } from 'react';




function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}



function Conversation() {
    const [inputPosition, setInputPosition] = useState("top-1/2");

    

    return (
        <>
            <Layout>
                <div className={`absolute ${inputPosition} left-1/2 transform -translate-x-1/2 -translate-y-1/2`}>
                    <div className="flex items-center">
                        <Input placeholder="What's on your mind?" className="w-96 border-gray-600 border-2 rounded-3xl p-2" />
                        <Button variant={"outline"} className="ml-2" onClick={() => setInputPosition("bottom-0")}>
                            <SendHorizontal />
                        </Button>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Conversation;