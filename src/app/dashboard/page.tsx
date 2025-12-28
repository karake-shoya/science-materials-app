import { FolderOpen } from 'lucide-react'
import { getUserCanvases } from '@/app/editor/actions'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { createClient } from '@/lib/supabase/server'
import { CreateProjectButton } from '@/components/dashboard/CreateProjectButton'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'ゲスト'
  
  const projects = await getUserCanvases()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted-foreground text-sm mb-1">{displayName}さん、ようこそ</p>
            <h1 className="text-2xl font-bold">プロジェクト</h1>
          </div>
          <CreateProjectButton />
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-2">プロジェクトがありません</h3>
            <p className="text-muted-foreground text-sm mb-6">
              新規作成ボタンから最初のプロジェクトを作成しましょう
            </p>
            <CreateProjectButton variant="outline" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* 新規作成カード */}
            <CreateProjectButton variant="card" />

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
      </main>
    </div>
  )
}
