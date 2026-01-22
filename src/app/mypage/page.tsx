"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Zap, 
  School, 
  Beaker, 
  FileText, 
  BarChart3, 
  Settings2,
  CheckCircle2,
  Shield
} from "lucide-react"
import { toast } from "sonner"
import { getUser, updateDisplayName, updateProfile } from "./actions"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function MyPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  
  // Basic Profile
  const [displayName, setDisplayName] = useState("")
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  
  // Teaching Profile
  const [jobTitle, setJobTitle] = useState("")
  const [schoolType, setSchoolType] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [preferredPaperSize, setPreferredPaperSize] = useState("A4")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser()
      if (userData) {
        setUser(userData)
        setDisplayName(userData.user_metadata?.display_name || "")
        setJobTitle(userData.user_metadata?.job_title || "")
        setSchoolType(userData.user_metadata?.school_type || "")
        setSpecialty(userData.user_metadata?.specialty || "")
        setPreferredPaperSize(userData.user_metadata?.preferred_paper_size || "A4")
      }
    }
    fetchUser()
  }, [])

  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingName(true)
    const formData = new FormData()
    formData.append("displayName", displayName)
    const result = await updateDisplayName(formData)
    if (result.error) toast.error("エラー", { description: result.error })
    else toast.success("表示名を更新しました")
    setIsUpdatingName(false)
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingProfile(true)
    const formData = new FormData()
    formData.append("jobTitle", jobTitle)
    formData.append("schoolType", schoolType)
    formData.append("specialty", specialty)
    formData.append("preferredPaperSize", preferredPaperSize)
    
    const result = await updateProfile(formData)
    if (result.error) toast.error("エラー", { description: result.error })
    else toast.success("プロフィールを更新しました")
    setIsUpdatingProfile(false)
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">プロフィールを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">マイページ</h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
            <Zap className="h-4 w-4 text-primary fill-primary" />
            <span className="text-sm font-bold text-primary">Free Plan</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Summary & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <div className="h-24 bg-linear-to-br from-primary to-indigo-600" />
              <CardContent className="pt-0 -mt-10 text-center relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg mx-auto mb-4">
                  <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-100">
                    <User className="h-10 w-10" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{displayName || "ニックネーム未設定"}</h2>
                <p className="text-sm text-slate-500 mb-6">{user.email}</p>
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">作成済み</p>
                    <p className="text-lg font-black text-slate-900">12</p>
                  </div>
                  <div className="text-center border-l border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">保存済み</p>
                    <p className="text-lg font-black text-slate-900">48</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  今月の利用状況
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                     <span className="text-slate-500">プリント生成残数</span>
                     <span className="text-slate-900">3 / 10回</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: '30%' }} />
                  </div>
                </div>
                <Button variant="outline" className="w-full text-xs font-bold h-9 border-dashed border-primary/30 text-primary hover:bg-primary/5">
                   プランをアップグレード
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Editing Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 基本プロフィールフォーム */}
            <Card className="border-none shadow-sm bg-white">
              <form onSubmit={handleUpdateDisplayName}>
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    基本プロフィール
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="displayName" className="text-sm font-bold text-slate-700">表示名</Label>
                    <div className="flex gap-2">
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="例：佐藤 先生"
                        className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                      />
                      <Button type="submit" disabled={isUpdatingName} className="font-bold">
                        {isUpdatingName ? "保存中" : "保存"}
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">メールアドレス</Label>
                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 italic text-sm">
                       <Mail className="h-4 w-4" />
                       {user.email}
                       <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
                    </div>
                  </div>
                </CardContent>
              </form>
            </Card>

            {/* 教育プロフィールフォーム */}
            <Card className="border-none shadow-sm bg-white">
              <form onSubmit={handleUpdateProfile}>
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <School className="h-5 w-5 text-primary" />
                    教育プロフィール
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="schoolType" className="text-sm font-bold text-slate-700">校種</Label>
                    <select
                      id="schoolType"
                      value={schoolType}
                      onChange={(e) => setSchoolType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">選択してください</option>
                      <option value="junior-high">中学校</option>
                      <option value="high-school">高等学校</option>
                      <option value="cram-school">学習塾・予備校</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="specialty" className="text-sm font-bold text-slate-700">担当・専門教科</Label>
                    <select
                      id="specialty"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <option value="">選択してください</option>
                      <option value="physics">物理</option>
                      <option value="chemistry">化学</option>
                      <option value="biology">生物</option>
                      <option value="earth-science">地学</option>
                      <option value="general-science">理科全般</option>
                    </select>
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="jobTitle" className="text-sm font-bold text-slate-700">役職・役職名（任意）</Label>
                    <Input
                      id="jobTitle"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="例：理科主任 / 非常勤講師"
                      className="bg-slate-50/50 border-slate-200"
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t border-slate-100 px-6 py-4">
                  <Button type="submit" disabled={isUpdatingProfile} className="ml-auto font-bold px-8 shadow-md">
                    {isUpdatingProfile ? "保存中..." : "プロフィールの変更を保存"}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* エディタ設定 */}
            <Card className="border-none shadow-sm bg-white">
              <form onSubmit={handleUpdateProfile}>
                <CardHeader>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    エディタ基本設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label className="text-sm font-bold text-slate-700">標準の用紙サイズ</Label>
                    <div className="flex gap-4">
                      {['A4', 'B5'].map((size) => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="paper-size" 
                            checked={preferredPaperSize === size}
                            onChange={() => setPreferredPaperSize(size)}
                            className="w-4 h-4 text-primary border-slate-300 focus:ring-primary"
                          />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                       <FileText className="h-4 w-4 text-slate-400" />
                       <span className="text-xs text-slate-400 font-medium italic">作成開始時の初期値に反映されます</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                   <Button type="submit" disabled={isUpdatingProfile} variant="secondary" className="font-bold border border-slate-200">
                     設定を保存
                   </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Account Info Notice */}
            <div className="flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
               <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Shield className="h-6 w-6" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-indigo-900">アカウントの安全管理</h4>
                  <p className="text-xs text-indigo-700/70 leading-relaxed">
                    パスワードの変更やアカウントの削除などのセキュリティ管理は、
                    <Link href="/dashboard/security" className="text-indigo-600 font-bold underline underline-offset-2 hover:text-indigo-800 ml-1">
                      セキュリティ設定画面
                    </Link> 
                    から行えます。
                  </p>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
