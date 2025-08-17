"use client"
import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMain } from "./chat-main"
import { UserProfile } from "./user-profile"

export interface Contact {
  id: string
  name: string
  avatar: string
  status: "online" | "away" | "busy" | "offline"
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: "text" | "image" | "file"
}

export interface Conversation {
  id: string
  contact: Contact
  messages: Message[]
}

// Mock data for demonstration
const mockContacts: Contact[] = [
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Hey! How's the project going?",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    lastMessage: "I'll send the designs tomorrow",
    lastMessageTime: "1 hour ago",
  },
  {
    id: "4",
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    lastMessage: "Great work on the presentation!",
    lastMessageTime: "3 hours ago",
    unreadCount: 1,
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "busy",
    lastMessage: "In a meeting, will call back later",
    lastMessageTime: "Yesterday",
  },
]

const mockConversations: Conversation[] = [
  {
    id: "2",
    contact: mockContacts[0],
    messages: [
      {
        id: "1",
        senderId: "2",
        senderName: "Sarah Chen",
        content: "Hey Alex! How's the new project coming along?",
        timestamp: "10:30 AM",
        type: "text",
      },
      {
        id: "2",
        senderId: "1",
        senderName: "Alex Johnson",
        content: "Going great! Just finished the authentication system. The dark mode looks amazing.",
        timestamp: "10:32 AM",
        type: "text",
      },
      {
        id: "3",
        senderId: "2",
        senderName: "Sarah Chen",
        content: "That's awesome! Can't wait to see it. The gradient colors you mentioned sound perfect for the brand.",
        timestamp: "10:35 AM",
        type: "text",
      },
    ],
  },
]

export function ChatInterface() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0])
  const [showProfile, setShowProfile] = useState(false)

  return (
    <div className="flex h-screen bg-slate-900">
      <ChatSidebar
        contacts={mockContacts}
        conversations={mockConversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        onShowProfile={() => setShowProfile(true)}
      />
      <ChatMain conversation={selectedConversation} onShowProfile={() => setShowProfile(true)} />
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}
    </div>
  )
}
