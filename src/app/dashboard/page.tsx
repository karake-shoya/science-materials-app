import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Clock, LogOut, User } from 'lucide-react'
import { getUserCanvases } from '@/app/editor/actions'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { signOut } from '@/app/login/actions'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'ゲスト'
  
  const projects = await getUserCanvases()

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <p className="text-slate-600 mb-1">{displayName}さん、ようこそ！</p>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/editor">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新規作成
            </Button>
          </Link>
          <Link href="/mypage">
            <Button variant="outline" size="icon" title="マイページ">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          最近のプロジェクト
        </h3>
        
        {projects.length === 0 ? (
          <div className="text-slate-500 py-10 text-center bg-slate-50 rounded-lg">
            まだプロジェクトがありません。「新規作成」から始めましょう。
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 新規作成カード */}
            <Link href="/editor">
              <Card className="flex h-full flex-col items-center justify-center border-dashed p-8 hover:bg-slate-50 transition-colors">
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">新しい図版を作成</h3>
              </Card>
            </Link>

            {/* プロジェクト一覧 */}
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                formattedDate={formatDistanceToNow(new Date(project.updated_at), { addSuffix: true, locale: ja })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}