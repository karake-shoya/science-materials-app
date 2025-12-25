import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Clock } from 'lucide-react'
import { getUserCanvases } from '@/app/editor/actions'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ProjectCard } from '@/components/dashboard/ProjectCard'

export default async function DashboardPage() {
  // サーバーサイドでデータを取得
  const projects = await getUserCanvases()

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Link href="/editor">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </Link>
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