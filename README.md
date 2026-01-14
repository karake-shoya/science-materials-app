# 理科教材作成アプリ (ScienceEditor)
![generator画面のスクリーンショット](./public/screenshots/generator-visual.png)

このアプリケーションは、学校の先生や生徒が電気回路図や計算問題プリントなどの理科教材を直感的に作成できるように設計されたWebアプリケーションです。
ブラウザ上で図を作成したり、学習レベルに合わせた問題プリントを自動生成してPDF出力したりすることができます。

## 主な機能

### 1. 電気回路図のエディタ
- **標準的な記号のサポート**: 日本の理科教育で使用される記号（豆電球、抵抗、電源、スイッチ、電流計・電圧計など）を完備。
- **インテリジェントな配線**: 記号同士を自動的に直角に結ぶマンハッタン配線や、接続ポイントへのスナップ機能を搭載。
- **充実の編集機能**: 元に戻す(Undo)/やり直す(Redo)、コピー＆ペースト、グループ移動、保存・読み込みに対応。

### 2. 教材プリント自動生成 (Worksheet Generator)
多彩な理科の計算単元に対応し、一問一答から応用問題まで、パラメーターを調整して無限に問題を生成できます。

- **対応単元**:
  - 【中1】密度、圧力、濃度、速さ
  - 【中2】オームの法則、湿度、電力・電力量
  - 【中3】仕事
- **多彩な出力形式**:
  - **通常モード**: 基本的な数値計算の一問一答形式。
  - **図解・グラフモード**: 回路図やグラフ、表を読み取って解く実践形式。
  - **大問モード**: 導入文、表、グラフ（飽和水蒸気量曲線）を組み合わせた総合的な問題。
- **高度なグラフィック描画**:
  - 湿度の問題では、飽和水蒸気量曲線を動的に描画。
  - 補助線（点線）や数値ラベルの自動配置、重なり回避ロジックを搭載し、読みやすさを追求。
- **解答編の同時出力**: 解答欄付きの解答用ページもワンクリックで作成可能。

## 技術スタック

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Canvas Library**: [Fabric.js](http://fabricjs.com/)
- **PDF Generation**: [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html)
- **Database**: Supabase (PostgreSQL)

## ディレクトリ構造

```
src/
├── app/                 # Next.js App Routerのエントリーポイント
│   ├── editor/          # 回路図エディタ画面
│   ├── generator/       # 教材生成ツール画面
│   └── api/             # PDF生成等のAPIエンドポイント
├── components/          # Reactコンポーネント (Editor用, Generator用)
├── lib/                 
│   ├── canvas/          # 回路図エディタのコアロジック
│   └── generators/      # 各単元の問題生成アルゴリズム
└── ...
```

## 開発の始め方

### 前提条件

- Node.js (v18以上推奨)
- npm, yarn, pnpm, または bun

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。
`/editor` で回路図作成、`/generator` でプリント生成機能を利用できます。
