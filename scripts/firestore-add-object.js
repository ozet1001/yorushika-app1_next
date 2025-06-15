// scripts/add-fields-simple.js
import { adminDb } from '../src/lib/firebase/firebase-admin.js';

/**
 * 指定されたコレクションの全ドキュメントの特定オブジェクトにフィールドを追加
 * @param {string} collectionName - 対象コレクション名
 * @param {string} targetObjectPath - 対象オブジェクトのパス
 * @param {Object} fieldsToAdd - 追加するフィールドとデフォルト値のオブジェクト
 * @param {Object} options - オプション設定
 */
async function addFieldsToObject(collectionName, targetObjectPath, fieldsToAdd, options = {}) {
  console.log('=== フィールド追加開始 ===');
  console.log(`コレクション: ${collectionName}`);
  console.log(`対象オブジェクト: ${targetObjectPath}`);
  console.log(`追加フィールド:`, Object.keys(fieldsToAdd));
  
  try {
    // コレクションを取得
    const collection = adminDb.collection(collectionName);
    const snapshot = await collection.get();
    
    console.log(`対象ドキュメント数: ${snapshot.size}件`);
    
    // バッチ処理の準備
    const batch = adminDb.batch();
    let processedCount = 0;
    
    // 各ドキュメントを処理
    snapshot.docs.forEach((doc) => {
      const docData = doc.data();
      const docRef = collection.doc(doc.id);
      
      // 既存のオブジェクトを取得（存在しない場合は空オブジェクト）
      const existingObject = docData[targetObjectPath] || {};
      
      // 新しいフィールドをマージ
      const updatedObject = {
        ...existingObject,    // 既存フィールドを保持
        ...fieldsToAdd        // 新しいフィールドを追加
      };
      
      // 更新データを準備
      const updateData = {
        [targetObjectPath]: updatedObject
      };
      
      // オプション: updatedAt を自動追加（デフォルトで有効）
      if (options.addTimestamp !== false) {
        updateData.updatedAt = new Date().toISOString();
      }
      
      // バッチに追加
      batch.update(docRef, updateData);
      processedCount++;
      
      // 進捗表示（オプション）
      if (options.verbose) {
        console.log(`処理中: ${doc.id} (${processedCount}/${snapshot.size})`);
      }
    });
    
    // バッチ実行
    await batch.commit();
    
    console.log('\n=== 処理完了 ===');
    console.log(`✅ ${processedCount}件のドキュメントを更新しました`);
    console.log(`追加されたフィールド: ${Object.keys(fieldsToAdd).join(', ')}`);
    
    return { 
      success: true, 
      updatedCount: processedCount 
    };
    
  } catch (error) {
    console.error('❌ フィールド追加エラー:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// === 使用例 ===

async function executeSimpleFieldAddition() {
  console.log('シンプルフィールド追加処理を開始します...');
  
  try {
    // // 例1: holy_locations にフィールドを追加
    // await addFieldsToObject('songs', 'literatures', {
    //   literatures_3: {
    //     author: "",
    //     url: "",
    //     work_name: "",
    //   }
    // });
    
    // 例2: goods にフィールドを追加
    await addFieldsToObject('songs', 'holy_locations_1', {
      location_img_1_account_name: "",
      location_img_1_account_url: "",
    });
    
    // // 例3: 新しいオブジェクト tieup_info を追加
    // await addFieldsToObject('songs', 'fan_art', {
    //   fan_art_title: "",
    //   fan_art_url: "",
    //   fan_art_account_name: "",
    //   fan_art_account_url: "",

    // });
    
    console.log('🎉 全ての処理が完了しました');
    process.exit(0);
    
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
executeSimpleFieldAddition();

// エクスポート（他のファイルから使用可能）
export { addFieldsToObject };