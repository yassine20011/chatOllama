import { ChevronUp, CircleUser, MoreHorizontal } from "lucide-react"
import useAuth from "@/hooks/useAuth"
import axiosInstance from "@/conf/axois-instance"
import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuAction,
} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom"



interface Conversation {
  id: string
  title: string
  url: string
}

export function AppSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const { logout } = useAuth()
  const navigate = useNavigate()


  useEffect(() => {
    axiosInstance.get("/v1/get/conversations")
      .then((response) => {
        setConversations(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])


  const handleDeleteConversation = (id: string) => {
    axiosInstance.delete(`/v1/delete/conversation/${id}`)
      .then((response) => {
        if (response.status === 204) {
          setConversations(conversations.filter((item) => item.id !== id))
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }


  return (
    <>
      <Sidebar collapsible="offcanvas">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Recent conversations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {conversations.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild onClick={() => navigate(`/chat/c/${item.id}`)} className="cursor-pointer">
                      <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>
                          <span>Edit Title</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteConversation(item.id)}>
                          <span>Delete Conversation</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Separator />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <span><CircleUser /></span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <Toaster />
      </Sidebar>
    </>
  )
}
