import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap, LogOut, User, FlaskConical } from 'lucide-react'
import { signOut } from '@/app/login/actions'
import { createClient } from '@/lib/supabase/server'

export async function DashboardHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'ゲスト'

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <FlaskConical className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">ScienceEditor</span>
          </Link>
          <Link href="/generator">
            <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10">
              <Zap className="h-4 w-4 fill-primary" />
              <span className="hidden sm:inline">問題ジェネレーター</span>
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/mypage">
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{displayName}</span>
            </Button>
          </Link>
          <form action={signOut}>
            <Button variant="ghost" size="icon" type="submit" title="ログアウト">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
