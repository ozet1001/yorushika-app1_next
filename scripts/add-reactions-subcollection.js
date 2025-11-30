import { adminDb } from '../src/lib/firebase/firebase-admin.js';

async function addReactionsToAllSongs() {
  console.log('=== 全曲にreactionsサブコレクションを追加 ===');
  
  try {
    // 全曲を取得
    const songsSnapshot = await adminDb.collection('songs').get();
    console.log(`対象曲数: ${songsSnapshot.size}曲`);
    
    let processedCount = 0;
    let skippedCount = 0;
    
    for (const songDoc of songsSnapshot.docs) {
      const songId = songDoc.id;
      const songName = songDoc.data().name || songId;
      
      console.log(`\n[${processedCount + 1}/${songsSnapshot.size}] ${songName}`);
      
      // reactions/counts が既に存在するかチェック
      const countsRef = adminDb
        .collection('songs')
        .doc(songId)
        .collection('reactions')
        .doc('counts');
      
      const countsSnap = await countsRef.get();
      
      if (countsSnap.exists) {
        console.log('  ⏭️  既に存在 - スキップ');
        skippedCount++;
        continue;
      }
      
      // reactions/counts を作成
      await countsRef.set({
        suki: 0,
        nakeru: 0,
        ensou: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('  ✅ reactions/counts 作成完了');
      processedCount++;
      
      // レート制限対策（少し待機）
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n=== 処理完了 ===');
    console.log(`作成: ${processedCount}曲`);
    console.log(`スキップ: ${skippedCount}曲`);
    console.log(`合計: ${songsSnapshot.size}曲`);
    
  } catch (error) {
    console.error('❌ エラー:', error);
    process.exit(1);
  }
}

// 実行
addReactionsToAllSongs()
  .then(() => {
    console.log('すべての処理が完了しました');
    process.exit(0);
  })
  .catch((error) => {
    console.error('処理中にエラーが発生しました:', error);
    process.exit(1);
  });