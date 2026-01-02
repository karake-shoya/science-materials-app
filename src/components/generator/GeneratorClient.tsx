'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { SCIENCE_TOPICS } from '@/lib/generators/types';

export function GeneratorClient() {
  const [count, setCount] = useState<number | string>(5);
  const [topic, setTopic] = useState('omega');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [format, setFormat] = useState<'basic' | 'graphical'>('basic');
  const [withAnswers, setWithAnswers] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    // iframeのロード開始をリセットするためにURLを一旦クリア
    setPdfUrl(null);
    
    // 生成時には数値を強制（空の場合は5にするなどのフォールバック）
    const numCount = typeof count === 'string' ? (parseInt(count) || 5) : count;
    
    setTimeout(() => {
        const url = `/api/generate-pdf?count=${numCount}&topic=${topic}&with_answers=${withAnswers}&format=${format}&t=${Date.now()}`;
        setPdfUrl(url);
        // 簡易実装: 生成リクエスト完了として1秒後にローディング解除
        setTimeout(() => setIsLoading(false), 1000);
    }, 100);
  };

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">教材生成ツール</h1>
        <p className="text-gray-500">問題プリントを自動生成します。</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>設定</CardTitle>
            <CardDescription>生成条件を指定してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="grade">学年</Label>
              <select 
                id="grade"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedGrade}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedGrade(val === 'all' ? 'all' : parseInt(val));
                }}
              >
                <option value="all">すべて</option>
                <option value="1">中学1年</option>
                <option value="2">中学2年</option>
                <option value="3">中学3年</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">単元</Label>
              <select 
                id="topic"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={topic}
                onChange={(e) => {
                  const newTopic = e.target.value;
                  setTopic(newTopic);
                  if (newTopic !== 'omega' && newTopic !== 'humidity') {
                    setFormat('basic');
                  }
                }}
              >
                {SCIENCE_TOPICS
                  .filter(t => selectedGrade === 'all' || t.grade === selectedGrade)
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      {t.grade === 1 ? '【中1】' : t.grade === 2 ? '【中2】' : '【中3】'} {t.name}
                    </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">問題数 (1-50)</Label>
              <Input 
                id="count" 
                type="number" 
                min={1} 
                max={50} 
                value={count} 
                onChange={(e) => {
                  const val = e.target.value;
                  setCount(val === "" ? "" : parseInt(val));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">出力形式</Label>
              <select 
                id="format"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={format}
                onChange={(e) => setFormat(e.target.value as 'basic' | 'graphical')}
              >
                <option value="basic">通常（一問一答）</option>
                <option 
                  value="graphical" 
                  disabled={topic !== 'omega' && topic !== 'humidity'}
                >
                  図解（グラフ・表あり）
                </option>
              </select>
              {(topic !== 'omega' && topic !== 'humidity') && (
                <p className="text-[10px] text-muted-foreground">※この単元は図解モードに未対応です</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch 
                id="with-answers" 
                checked={withAnswers}
                onCheckedChange={setWithAnswers}
              />
              <Label htmlFor="with-answers">解答も作成する（2ページ目）</Label>
            </div>
            
            <div className="pt-4">
              <Button 
                  className="w-full" 
                  onClick={handleGenerate} 
                  disabled={isLoading}
              >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        生成中...
                    </>
                ) : (
                    "PDFを作成してプレビュー"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 flex flex-col overflow-hidden h-full min-h-[500px]">
          <CardHeader className="pb-3 border-b">
            <CardTitle>プレビュー</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 bg-gray-100 relative">
            {pdfUrl ? (
              <iframe 
                src={pdfUrl} 
                className="w-full h-full border-none block"
                title="PDF Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                <div className="mb-4 text-6xl">📄</div>
                <p>左側の設定を入力して「PDFを作成」ボタンを押してください</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
