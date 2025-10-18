# 月猫図書館 / Tsuki Neko Library

[![GitHub last commit](https://img.shields.io/github/last-commit/ozet1001/yorushika-app1_next)](https://github.com/ozet1001/yorushika-app1_next/commits/master)
[![GitHub repo size](https://img.shields.io/github/repo-size/ozet1001/yorushika-app1_next)](https://github.com/ozet1001/yorushika-app1_next)

ヨルシカの楽曲データベース＆ファンコミュニティサイト  
Yorushika song database and fan community site

---

## 📖 このプロジェクトについて / About This Project

月猫図書館は、ヨルシカの楽曲情報、演奏情報、聖地情報などを集約したファンサイトです。  
Tsukineko Library is a comprehensive fan site covering Yorushika's music information, performance details, and sacred site information.

---

## 🛠 技術スタック / Tech Stack

### フロントエンド / Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hooks**

### バックエンド・データベース / Backend & Database
- **Firebase Firestore** (NoSQL Database)
- **Firebase Authentication**
- **Firebase Admin SDK** (Server-side operations)

### インフラ・DevOps / Infrastructure & DevOps
- **Vercel** (Deployment & Hosting)
- **AWS S3** (Image Storage & CDN)
- **GitHub** (Version Control & Collaboration)

---

## 🌍 機能 / Features

### 現在の機能 / Current Features
- 📚 **楽曲データベース** / Song Database
  - 楽曲情報、歌詞URL、MV、ライブ映像
  - Song information, lyrics URLs, music videos, live performances
- 📍 **聖地巡礼情報** / Holy Location Guides
- 📖 **文学作品との関連** / Literary References
- 🛍️ **グッズ情報** / Merchandise Information

### 開発中 / In Development
- 🔍 **楽曲検索機能** / Advanced Search
- 💬 **コミュニティ機能** / Community Features

---

## 📦 はじめ方 / Getting Started

### 必要要件 / Prerequisites
- Node.js 18+
- npm or yarn

1. **リポジトリをフォーク / Fork this repository**

2. **フォークをクローン / Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/yorushika-app1_next.git
cd yorushika-app1_next
```

3. **依存関係をインストール / Install dependencies**
```bash
npm install
```

4. **開発サーバーを起動 / Run development server**
```bash
npm run dev
```

5. **変更を加えてPull Requestを送信！ / Make your changes and submit a Pull Request!**

---

### 管理者向け（完全セットアップ）/ For Administrators (Full Setup)

<details>
<summary>Firebaseセットアップ手順を表示 / Click to expand Firebase setup instructions</summary>

1. `.env.local` ファイルを作成 / Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. プロジェクトルートに `serviceAccountKey.json` を配置（管理者のみ）  
   Place `serviceAccountKey.json` in the project root (administrators only)

3. Firestore Security Rulesを設定（設定済み）  
   Configure Firestore Security Rules (already set up)

</details>
<br>
<div align="left">

**⭐ このプロジェクトが気に入ったら、スターをお願いします！**  
**⭐ If you like this project, please give it a star! ⭐**

ヨルシカファンの皆様へ、愛を込めて ❤️  
Made with ❤️ for Yorushika fans

</div>