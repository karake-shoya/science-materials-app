# 理科教材作成アプリ (Science Materials App)

このアプリケーションは、学校の先生や生徒が電気回路図などの理科教材を直感的に作成できるように設計されたWebアプリケーションです。
Next.jsとFabric.jsを使用して構築されており、ブラウザ上で手軽に図を作成・保存・印刷することができます。

## 主な機能

- **電気回路図の作成**
  - 日本の理科教育で標準的な記号（豆電球、抵抗、電源、スイッチ、電流計・電圧計など）を用意
  - ドラッグ＆ドロップで簡単に配置
- **インテリジェントな導線描画**
  - 記号同士を自動的に直角に配線（マンハッタン配線）
  - 接続ポイントへのスナップ機能で、きれいに接続
- **編集機能**
  - 元に戻す (Undo) / やり直す (Redo)
  - コピー＆ペースト、複製
  - 複数選択、削除、移動
- **プロジェクト管理**
  - 作成した図の保存と読み込み
  - タイトル設定
- **出力機能**
  - 画像として保存 (PNG)
  - 印刷用PDFとして保存 (A4, B4対応)
- **教材自動生成 (Python)**
  - オームの法則計算問題プリントのPDF自動生成

## 技術スタック

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Canvas Library**: [Fabric.js](http://fabricjs.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: Supabase (PostgreSQL)

## ディレクトリ構造

主なディレクトリ構造は以下の通りです。

```
src/
├── app/                 # Next.js App Routerのエントリーポイント
│   ├── editor/          # エディタ画面と関連ロジック
│   └── ...
├── components/          # Reactコンポーネント
│   ├── canvas/          # キャンバス関連のコンポーネント (FabricCanvas, WireOverlayなど)
│   ├── editor/          # エディタUIコンポーネント (サイドバーなど)
│   └── ui/              # 汎用UIコンポーネント (shadcn/uiなど)
├── lib/                 # ユーティリティとコアロジック
│   ├── canvas/          # キャンバス操作のコアロジック
│   │   ├── hooks/       # React Custom Hooks (履歴、接続、イベント処理など)
│   │   └── ...
│   └── ...
└── ...
```

## 開発の始め方

### 前提条件

- Node.js (v18以上推奨)
- npm, yarn, pnpm, または bun

### インストール

依存関係をインストールします。

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

## 教材生成ツール (Python)

Webアプリ機能とは別に、Pythonを使用して印刷用の問題プリントを自動生成するツールが含まれています。
現在は「中学2年理科 電流（オームの法則）」の計算問題PDFを作成可能です。

### セットアップと実行

Python 3がインストールされている必要があります。

1. **仮想環境の作成と有効化**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # Mac/Linux
   # .venv\Scripts\activate   # Windows
   ```

2. **依存ライブラリのインストール**
   ```bash
   pip install -r generator/requirements.txt
   ```

3. **ツールの実行**
   ```bash
   python generator/ohm_law.py
   ```
   実行すると `generator/ohm_law_practice.pdf` が生成されます。
