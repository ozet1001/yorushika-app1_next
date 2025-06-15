// scripts/firestore-export.js
import { adminDb } from '../src/lib/firebase/firebase-admin.js';
import { writeFileSync } from 'fs';

async function exportAllData() {
  console.log('=== Firestore エクスポート開始 ===');
  
  try {
    const collections = await adminDb.listCollections();
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalCollections: collections.length,
      },  
      collections: {}
    };

    console.log(`見つかったコレクション数: ${collections.length}`);

    for (const collection of collections) {
      console.log(`エクスポート中: ${collection.id}`);
      
      const snapshot = await collection.get();
      const collectionData = {};

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        collectionData[doc.id] = {
          id: doc.id,
          ...data
        };
      });

      exportData.collections[collection.id] = collectionData;
      console.log(`完了: ${collection.id} (${snapshot.size}件)`);
    }

    // ファイル保存
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `firestore-export-${timestamp}.json`;
    
    writeFileSync(fileName, JSON.stringify(exportData, null, 2), 'utf8');
    
    console.log(`\n=== エクスポート完了 ===`);
    console.log(`ファイル: ${fileName}`);
    console.log(`保存場所: ${process.cwd()}\\${fileName}`);
    
    // 各コレクションの件数サマリー
    console.log('\n=== エクスポートサマリー ===');
    Object.entries(exportData.collections).forEach(([name, data]) => {
      console.log(`${name}: ${Object.keys(data).length}件`);
    });
    
    return fileName;
    
  } catch (error) {
    console.error('エクスポートエラー:', error);
    process.exit(1);
  }
}

// 実行
exportAllData()
  .then(() => {
    console.log('エクスポート処理が正常に完了しました');
    process.exit(0);
  })
  .catch((error) => {
    console.error('エクスポート処理でエラーが発生しました:', error);
    process.exit(1);
  });