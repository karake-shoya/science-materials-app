import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Clock, FileText } from 'lucide-react'
import { getUserCanvases } from '@/app/editor/actions' // 作成したアクション
import { formatDistanceToNow } from 'date-fns' // 日付フォーマット用(後述) or そのまま表示
import { ja } from 'date-fns/locale'

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
              <Link key={project.id} href={`/editor/${project.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="aspect-video w-full bg-slate-200 relative flex items-center justify-center">
                    {/* サムネイル機能は未実装なのでアイコンで代用 */}
                    <FileText className="h-12 w-12 text-slate-400" />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base line-clamp-1">{project.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {/* 日付表示 (date-fnsがない場合は project.updated_at をそのまま表示でもOK) */}
                      {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true, locale: ja })}
                    </p>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 mt-auto">
                    <Button variant="ghost" size="sm" className="w-full text-slate-500">
                      編集を開く
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}