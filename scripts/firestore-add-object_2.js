// scripts/add-nested-fields.js
import { adminDb } from '../src/lib/firebase/firebase-admin.js';

/**
 * 指定されたコレクションの全ドキュメントの二階層目にフィールドを追加
 * @param {string} collectionName - 対象コレクション名
 * @param {string} firstLevelPath - 第一階層のパス
 * @param {string} secondLevelPath - 第二階層のパス
 * @param {Object} fieldsToAdd - 追加するフィールドとデフォルト値のオブジェクト
 * @param {Object} options - オプション設定
 */
async function addNestedFields(collectionName, firstLevelPath, secondLevelPath, fieldsToAdd, options = {}) {
  console.log('=== 二階層目フィールド追加開始 ===');
  console.log(`コレクション: ${collectionName}`);
  console.log(`第一階層: ${firstLevelPath}`);
  console.log(`第二階層: ${secondLevelPath}`);
  console.log(`追加フィールド:`, Object.keys(fieldsToAdd));
  
  try {
    // コレクションを取得
    const collection = adminDb.collection(collectionName);
    const snapshot = await collection.get();
    
    console.log(`対象ドキュメント数: ${snapshot.size}件`);
    
    // バッチ処理の準備
    const batch = adminDb.batch();
    let processedCount = 0;
    let skippedCount = 0;
    
    // 各ドキュメントを処理
    snapshot.docs.forEach((doc) => {
      const docData = doc.data();
      const docRef = collection.doc(doc.id);
      
      // 第一階層のオブジェクトを取得
      const firstLevelObject = docData[firstLevelPath];
      
      // 第一階層が存在しない場合の処理
      if (!firstLevelObject || typeof firstLevelObject !== 'object') {
        if (options.createMissingParents) {
          // 親オブジェクトを作成
          const updateData = {
            [`${firstLevelPath}.${secondLevelPath}`]: fieldsToAdd
          };
          
          if (options.addTimestamp !== false) {
            updateData.updatedAt = new Date().toISOString();
          }
          
          batch.update(docRef, updateData);
          processedCount++;
          
          if (options.verbose) {
            console.log(`親オブジェクト作成: ${doc.id} (${firstLevelPath})`);
          }
        } else {
          skippedCount++;
          if (options.verbose) {
            console.log(`スキップ: ${doc.id} (${firstLevelPath} が存在しません)`);
          }
        }
        return;
      }
      
      // 第二階層のオブジェクトを取得（存在しない場合は空オブジェクト）
      const existingSecondLevelObject = firstLevelObject[secondLevelPath] || {};
      
      // 新しいフィールドをマージ
      const updatedSecondLevelObject = {
        ...existingSecondLevelObject,  // 既存フィールドを保持
        ...fieldsToAdd                 // 新しいフィールドを追加
      };
      
      // 更新データを準備（ドット記法を使用）
      const updateData = {
        [`${firstLevelPath}.${secondLevelPath}`]: updatedSecondLevelObject
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
        console.log(`処理中: ${doc.id} (${processedCount}/${snapshot.size - skippedCount})`);
      }
    });
    
    // バッチ実行
    await batch.commit();
    
    console.log('\n=== 処理完了 ===');
    console.log(`✅ ${processedCount}件のドキュメントを更新しました`);
    if (skippedCount > 0) {
      console.log(`⚠️  ${skippedCount}件のドキュメントをスキップしました`);
    }
    console.log(`追加されたフィールド: ${Object.keys(fieldsToAdd).join(', ')}`);
    
    return { 
      success: true, 
      updatedCount: processedCount,
      skippedCount: skippedCount
    };
    
  } catch (error) {
    console.error('❌ 二階層目フィールド追加エラー:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * 複数の二階層目パスに対してフィールドを追加
 * @param {string} collectionName - 対象コレクション名
 * @param {string} firstLevelPath - 第一階層のパス
 * @param {Array} operations - 操作の配列 [{secondLevelPath, fieldsToAdd}, ...]
 * @param {Object} options - オプション設定
 */
async function addMultipleNestedFields(collectionName, firstLevelPath, operations, options = {}) {
  console.log('=== 複数二階層目フィールド追加開始 ===');
  console.log(`コレクション: ${collectionName}`);
  console.log(`第一階層: ${firstLevelPath}`);
  console.log(`操作数: ${operations.length}件`);
  
  const results = [];
  
  for (const operation of operations) {
    console.log(`\n--- ${operation.secondLevelPath} を処理中 ---`);
    const result = await addNestedFields(
      collectionName, 
      firstLevelPath, 
      operation.secondLevelPath, 
      operation.fieldsToAdd, 
      options
    );
    results.push({
      path: operation.secondLevelPath,
      ...result
    });
  }
  
  console.log('\n=== 全体処理完了 ===');
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.path}: ${result.updatedCount}件更新`);
    } else {
      console.log(`❌ ${result.path}: エラー`);
    }
  });
  
  return results;
}

// === 使用例 ===

async function executeNestedFieldAddition() {
  console.log('二階層目フィールド追加処理を開始します...');
  
  try {
    // // 例1: songs.holy_locations_1.location_details に詳細情報を追加
    // await addNestedFields('songs', 'holy_locations_1', 'location_details', {
    //   detailed_address: "",
    //   access_info: "",
    //   opening_hours: "",
    //   contact_info: ""
    // }, {
    //   verbose: true,
    //   createMissingParents: true  // 親オブジェクトが存在しない場合は作成
    // });
    
    // 例2: songs.literatures.literature_1 に新しいフィールドを追加
    await addNestedFields('songs', 'holy_locations', 'holy_locations_3', {
      location_img_1_account_name: "",
      location_img_1_account_url: "",
      location_img_2_account_name: "",
      location_img_2_account_url: "",
      location_img_3_account_name: "",
      location_img_3_account_url: "",
    });
    
    // // 例3: songs.goods.merchandise に商品情報オブジェクトを追加
    // await addNestedFields('songs', 'goods', 'merchandise', {
    //   product_name: "",
    //   price: 0,
    //   availability: true,
    //   description: "",
    //   image_urls: []
    // });
    
    // 例4: 複数の二階層目パスを一度に処理
    // await addMultipleNestedFields('songs', 'fan_art', [
    //   {
    //     secondLevelPath: 'fan_art_1',
    //     fieldsToAdd: {
    //       rating: 0,
    //       tags: [],
    //       created_date: ""
    //     }
    //   },
    //   {
    //     secondLevelPath: 'fan_art_2',
    //     fieldsToAdd: {
    //       rating: 0,
    //       tags: [],
    //       created_date: ""
    //     }
    //   }
    // ], {
    //   verbose: true,
    //   createMissingParents: true
    // });
    
    console.log('🎉 全ての処理が完了しました');
    process.exit(0);
    
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
executeNestedFieldAddition();

// エクスポート（他のファイルから使用可能）
export { addNestedFields, addMultipleNestedFields };