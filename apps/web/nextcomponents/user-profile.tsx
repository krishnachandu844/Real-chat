"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { X, Edit3, Save, Camera, Bell, Shield, Palette } from "lucide-react"

interface UserProfileProps {
  onClose: () => void
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { user, logout, updateUserStatus } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")
  const [editedEmail, setEditedEmail] = useState(user?.email || "")
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    console.log("Saving profile:", { name: editedName, email: editedEmail })
    setIsEditing(false)
  }

  const handleStatusChange = (status: "online" | "away" | "busy" | "offline") => {
    updateUserStatus(status)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "away":
        return "Away"
      case "busy":
        return "Busy"
      default:
        return "Offline"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-96 bg-slate-800 h-full overflow-y-auto border-l border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Profile & Settings</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Avatar and Basic Info */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                  {user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Camera className="h-4 w-4" />
              </Button>
              <div
                className={`absolute top-1 right-1 w-6 h-6 rounded-full border-3 border-slate-800 ${getStatusColor(user?.status || "online")}`}
              />
            </div>

            {isEditing ? (
              <div className="w-full space-y-3">
                <div>
                  <Label htmlFor="name" className="text-slate-200 text-sm">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-200 text-sm">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center w-full">
                <h3 className="text-xl font-semibold text-white">{user?.name}</h3>
                <p className="text-slate-400">{user?.email}</p>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-slate-400 hover:text-white"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Status Section */}
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
          <Select value={user?.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(user?.status || "online")}`} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="online" className="text-white hover:bg-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Online</span>
                </div>
              </SelectItem>
              <SelectItem value="away" className="text-white hover:bg-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>Away</span>
                </div>
              </SelectItem>
              <SelectItem value="busy" className="text-white hover:bg-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Busy</span>
                </div>
              </SelectItem>
              <SelectItem value="offline" className="text-white hover:bg-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500" />
                  <span>Offline</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Settings Section */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-400" />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Push Notifications</p>
                  <p className="text-slate-400 text-xs">Receive notifications for new messages</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Sound Effects</p>
                  <p className="text-slate-400 text-xs">Play sounds for message alerts</p>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-purple-400" />
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Dark Mode</p>
                  <p className="text-slate-400 text-xs">Use dark theme across the app</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-400" />
              Privacy & Security
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                Change Password
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                Privacy Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                Blocked Users
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-700" />

          {/* Logout Button */}
          <Button
            onClick={logout}
            variant="destructive"
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
