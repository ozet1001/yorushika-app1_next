// src/lib/firebase/firebase-admin.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';

console.log('=== Firebase Admin 初期化開始 ===');

// 秘密鍵の読み込み
let serviceAccount;

try {
  // まずファイルから読み込みを試行
  const serviceAccountPath = './serviceAccountKey.json';
  
  if (existsSync(serviceAccountPath)) {
    console.log('✅ serviceAccountKey.json が見つかりました');
    console.log('serviceAccountKey.json から読み込み中...');
    const serviceAccountFile = readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountFile);
    console.log('✅ サービスアカウント読み込み成功');
    console.log('プロジェクトID:', serviceAccount.project_id);
  } else if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    // ファイルがない場合のみ環境変数から読み込み
    console.log('serviceAccountKey.json が見つかりません');
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
    // 両方とも見つからない場合
    console.error('❌ サービスアカウント情報が見つかりません');
    console.error('現在のディレクトリ:', process.cwd());
    console.error('探しているファイル:', serviceAccountPath);
    console.error('ファイル存在確認:', existsSync(serviceAccountPath));
    
    // ディレクトリの中身を表示
    console.error('ディレクトリの内容:');
    try {
      const { readdirSync } = await import('fs');
      const files = readdirSync('./');
      files.forEach(file => console.error('  -', file));
    } catch (e) {
      console.error('ディレクトリ読み込みエラー:', e.message);
    }
    
    throw new Error('serviceAccountKey.json ファイルも環境変数も設定されていません');
  }
} catch (error) {
  console.error('❌ サービスアカウント読み込みエラー:', error.message);
  throw error;
}

// サービスアカウントの検証
if (!serviceAccount || typeof serviceAccount !== 'object') {
  console.error('❌ サービスアカウントが正しく読み込まれていません');
  console.error('serviceAccount type:', typeof serviceAccount);
  console.error('serviceAccount value:', serviceAccount);
  throw new Error('サービスアカウントが無効です');
}

console.log('✅ サービスアカウント検証OK');

// Firebase Admin初期化
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id, // JSONファイルから直接取得
    });
    console.log('✅ Firebase Admin初期化成功');
  } catch (error) {
    console.error('❌ Firebase Admin初期化エラー:', error);
    throw error;
  }
}

export const adminDb = getFirestore();
console.log('✅ Firestore接続完了');