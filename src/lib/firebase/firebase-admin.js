import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { confirmEnvironment } from '../confirm.js';
import { readFileSync, existsSync } from 'fs';

console.log('=== Firebase Admin 初期化開始 ===');

// 環境変数から環境を取得（デフォルトは本番）
const FIREBASE_ENV = process.env.FIREBASE_ENV || 'prod';
console.log(`環境: ${FIREBASE_ENV}`);

// 環境ごとのサービスアカウントファイルのパス
const serviceAccountPaths = {
  prod: './serviceAccountKey.json',
  dev: './serviceAccountKey-dev.json'
};

const selectedPath = serviceAccountPaths[FIREBASE_ENV];

if (!selectedPath) {
  throw new Error(`Invalid FIREBASE_ENV: ${FIREBASE_ENV}. Use 'prod' or 'dev'`);
}

console.log(`サービスアカウントファイル: ${selectedPath}`);

// サービスアカウントの読み込み
let serviceAccount;

try {
  if (existsSync(selectedPath)) {
    console.log(`✅ ${selectedPath} が見つかりました`);
    const serviceAccountFile = readFileSync(selectedPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountFile);
    console.log('✅ サービスアカウント読み込み成功');
    console.log('プロジェクトID:', serviceAccount.project_id);
  } else {
    console.error(`❌ ${selectedPath} が見つかりません`);
    console.error('現在のディレクトリ:', process.cwd());
    
    // 環境変数からの読み込みを試行
    if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      console.log('環境変数から読み込み中...');
      serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
      };
      console.log('✅ 環境変数読み込み成功');
    } else {
      throw new Error(`${selectedPath} ファイルも環境変数も設定されていません`);
    }
  }
} catch (error) {
  console.error('❌ サービスアカウント読み込みエラー:', error.message);
  throw error;
}

// サービスアカウントの検証
if (!serviceAccount || typeof serviceAccount !== 'object') {
  console.error('❌ サービスアカウントが正しく読み込まれていません');
  throw new Error('サービスアカウントが無効です');
}

console.log('✅ サービスアカウント検証OK');

// Firebase Admin初期化
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    console.log(`✅ Firebase Admin初期化成功 (${FIREBASE_ENV}環境)`);
  } catch (error) {
    console.error('❌ Firebase Admin初期化エラー:', error);
    throw error;
  }
} else {
  console.log('✅ Firebase Admin は既に初期化済み');
}

export const adminDb = getFirestore();
console.log(`✅ Firestore接続完了: ${serviceAccount.project_id}`);

// 接続先確認プロンプト
const canProceed = await confirmEnvironment();
if (!canProceed) {
  process.exit(0);
}
