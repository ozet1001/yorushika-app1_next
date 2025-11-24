// scripts/firestore-import-safe.js
import { adminDb } from '../src/lib/firebase/firebase-admin.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

async function importAllData(filePath, options = {}) {
  const { merge = true, dryRun = false } = options;
  
  console.log('=== Firestore インポート開始 ===');
  console.log(`モード: ${dryRun ? 'DRY RUN（実際には書き込まない）' : '実行'}`);
  console.log(`マージ: ${merge ? '有効（既存データと結合）' : '無効（完全上書き）'}`);
  
  try {
    const fileContent = readFileSync(filePath, 'utf8');
    const importData = JSON.parse(fileContent);
    
    console.log(`\n=== インポート内容 ===`);
    Object.entries(importData.collections).forEach(([name, data]) => {
      console.log(`${name}: ${Object.keys(data).length}件`);
    });
    
    if (dryRun) {
      console.log('\n⚠️  DRY RUNモード: データは書き込まれません');
    } else {
      console.log('\n⚠️  5秒後にインポート開始（Ctrl+C で中断）');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    let totalImported = 0;
    
    for (const [collectionName, documents] of Object.entries(importData.collections)) {
      console.log(`\n処理中: ${collectionName}`);
      
      const collectionRef = adminDb.collection(collectionName);
      const documentEntries = Object.entries(documents);
      
      const batchSize = 500;
      for (let i = 0; i < documentEntries.length; i += batchSize) {
        if (!dryRun) {
          const batch = adminDb.batch();
          const batchDocs = documentEntries.slice(i, i + batchSize);
          
          batchDocs.forEach(([docId, docData]) => {
            const { id, ...data } = docData;
            const docRef = collectionRef.doc(docId);
            batch.set(docRef, data, { merge });
          });
          
          await batch.commit();
        }
        console.log(`  進捗: ${Math.min(i + batchSize, documentEntries.length)}/${documentEntries.length}件`);
      }
      
      totalImported += documentEntries.length;
      console.log(`完了: ${collectionName}`);
    }
    
    console.log(`\n=== ${dryRun ? 'DRY RUN ' : ''}完了 ===`);
    console.log(`合計 ${totalImported}件`);
    
  } catch (error) {
    console.error('エラー:', error);
    process.exit(1);
  }
}

// 引数解析
const args = process.argv.slice(2);
const fileName = args.find(arg => !arg.startsWith('--'));
const dryRun = args.includes('--dry-run');
const noMerge = args.includes('--no-merge');

if (!fileName) {
  console.error('使い方: node scripts/firestore-import-safe.js <ファイル名> [オプション]');
  console.error('オプション:');
  console.error('  --dry-run    実際には書き込まない（テスト）');
  console.error('  --no-merge   既存データを完全上書き');
  process.exit(1);
}

const filePath = resolve(process.cwd(), fileName);

importAllData(filePath, { dryRun, merge: !noMerge })
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('エラー:', error);
    process.exit(1);
  });