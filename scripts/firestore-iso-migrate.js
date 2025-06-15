// scripts/add-fields-simple.js
import { adminDb } from '../src/lib/firebase/firebase-admin.js';

// Timestamp から ISO文字列に変換する関数
function timestampToISO(timestamp) {
  if (!timestamp || typeof timestamp._seconds !== 'number') {
    return null;
  }
  
  const milliseconds = timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000;
  return new Date(milliseconds).toISOString();
}

async function migrateCreatedAtToISO() {
  const batch = adminDb.batch();
  const snapshot = await adminDb.collection('songs').get();
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    
    // createdAtがTimestamp形式の場合のみ変換
    if (data.editAt && typeof data.editAt._seconds === 'number') {
      const isoCreatedAt = timestampToISO(data.editAt);
      
      batch.update(doc.ref, {
        createdAt: isoCreatedAt
      });
    }
  });
  
  await batch.commit();
  console.log('Migration completed');
}

// 実行
migrateCreatedAtToISO();