import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Clock, FileText, FlaskConical, Zap, Dna, Mountain } from 'lucide-react'
// モックデータ（本来はSupabaseから取得）
const recentProjects = [
  { id: 1, title: '2年 2学期中間テスト', date: '2時間前', thumbnail: '/api/placeholder/400/300' },
  { id: 2, title: '電気回路図_基本', date: '1日前', thumbnail: '/api/placeholder/400/300' },
  { id: 3, title: '蒸留の実験装置', date: '3日前', thumbnail: '/api/placeholder/400/300' },
]
const categories = [
  { name: '物理', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { name: '化学', icon: FlaskConical, color: 'text-blue-500', bg: 'bg-blue-50' },
  { name: '生物', icon: Dna, color: 'text-green-500', bg: 'bg-green-50' },
  { name: '地学', icon: Mountain, color: 'text-orange-500', bg: 'bg-orange-50' },
]
export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* 1. ヘッダー＆新規作成ボタン */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規作成
          </Button>
        </div>
      </div>
      {/* 2. クイックアクセス（分野別） */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Card key={cat.name} className="hover:bg-slate-50 cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {cat.name}分野の素材
              </CardTitle>
              <cat.icon className={`h-4 w-4 ${cat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cat.name}</div>
              <p className="text-xs text-muted-foreground">
                回路図, 力の矢印...
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* 3. 最近のプロジェクト */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          最近のプロジェクト
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <div className="aspect-video w-full bg-slate-200 relative">
                {/* ここにサムネイル画像が入ります */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <FileText className="h-12 w-12" />
                </div>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-base">{project.title}</CardTitle>
                <p className="text-xs text-muted-foreground">最終更新: {project.date}</p>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full">
                  編集を再開
                </Button>
              </CardFooter>
            </Card>
          ))}
          {/* 新規作成カード（空の状態） */}
          <Card className="flex flex-col items-center justify-center border-dashed p-8 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold">新しい図版を作成</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              白紙から作成するか、<br />テンプレートを選びます
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}