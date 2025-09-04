// src/config/sidebar-config.ts
import {
  Home,
  User,
  Mail,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react"

export const mainNav = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Profile", href: "/profile", icon: User },
  { title: "Request", href: "/request", icon: Mail },
  { title: "Template", href: "/template", icon: Calendar },
  { title: "Received Requests", href: "/received", icon: FileText },
  { title: "History", href: "/history", icon: BarChart3 },
]

export const bottomNav = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help & Support", href: "/help", icon: HelpCircle },
  // { title: "Logout", href: "/logout", icon: LogOut, destructive: true },
]
