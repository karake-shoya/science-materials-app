"use client"

import { LogOut, User, Settings, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UserMenuProps {
  displayName: string
  signOutAction: () => Promise<void>
}

export function UserMenu({ displayName, signOutAction }: UserMenuProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2 hover:bg-slate-100 rounded-lg transition-colors group">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all">
            <User className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline font-bold text-slate-700">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 py-1">
            <p className="text-sm font-bold leading-none text-slate-900">{displayName} 様</p>
            <p className="text-xs leading-none text-slate-500">
              ScienceEditor ユーザー
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/mypage")} className="cursor-pointer py-2.5">
            <User className="mr-3 h-4 w-4" />
            <span className="font-medium">プロフィール設定</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/security")} className="cursor-pointer py-2.5">
            <Shield className="mr-3 h-4 w-4" />
            <span className="font-medium">セキュリティ</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2.5"
          onClick={async () => {
            const formData = new FormData()
            // signout is a server action
            await signOutAction()
          }}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-bold">ログアウト</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
