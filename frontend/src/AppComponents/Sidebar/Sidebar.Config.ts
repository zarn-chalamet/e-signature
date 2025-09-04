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
  ClipboardClock,
  LayoutTemplate,
} from "lucide-react"

export const mainNav = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Profile", href: "/profile", icon: User },
  { title: "Send Request", href: "/request", icon: Mail },
  { title: "Templates", href: "/template", icon: LayoutTemplate },
  { title: "Received Requests", href: "/received", icon: FileText },
  { title: "History", href: "/history", icon: ClipboardClock },
]

export const bottomNav = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Help & Support", href: "/help", icon: HelpCircle },
  // { title: "Logout", href: "/logout", icon: LogOut, destructive: true },
]
