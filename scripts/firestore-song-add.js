// scripts/add-new-song.js
import { adminDb } from '../src/lib/firebase/firebase-admin.js';

/**
 * 楽曲ドキュメントのデフォルトテンプレートを取得
 * @returns {Object} 楽曲ドキュメントのテンプレート
 */
function getSongTemplate() {
  return {
    id: "", // 自動採番されるため空文字
    isDeleted: false,
    album: "",
    year: "",
    name: "",
    kana: "",
    photo: "",
    lyrics: "",
    analysis: "",
    song_info: "",
    reference_list: {
      reference_url_1: "",
      reference_url_2: "",
      reference_url_3: ""
    },
    mv_url: "",
    tieup_info: {
      tieup_info_1: {
        tieup_name: "",
        tieup_url: ""
      },
      tieup_info_2: {
        tieup_name: "",
        tieup_url: ""
      },
      tieup_info_3: {
        tieup_name: "",
        tieup_url: ""
      }
    },
    fan_art: {
      fan_art_title: "",
      fan_art_url: "",
      fan_art_account_name: "",
      fan_art_account_url: ""
    },
    goods: {
      goods_1: {
        goods_info: "",
        goods_name: "",
        goods_url: ""
      },
      goods_2: {
        goods_info: "",
        goods_name: "",
        goods_url: ""
      },
      goods_3: {
        goods_info: "",
        goods_name: "",
        goods_url: ""
      }
    },
    literatures: {
      literatures_1: {
        author: "",
        url: "",
        work_name: ""
      },
      literatures_2: {
        author: "",
        url: "",
        work_name: ""
      },
      literatures_3: {
        author: "",
        url: "",
        work_name: ""
      }
    },
    photo_account_name: "",
    photo_account_url: "",
    holy_locations: {
      holy_locations_1: {
        location_address: "",
        location_name: "",
        location_url: "",
        location_img_1: "",
        location_img_2: "",
        location_img_3: "",
        location_img_1_account_name: "",
        location_img_1_account_url: "",
        location_img_2_account_name: "",
        location_img_2_account_url: "",
        location_img_3_account_name: "",
        location_img_3_account_url: ""
      },
      holy_locations_2: {
        location_address: "",
        location_name: "",
        location_url: "",
        location_img_1: "",
        location_img_2: "",
        location_img_3: "",
        location_img_1_account_name: "",
        location_img_1_account_url: "",
        location_img_2_account_name: "",
        location_img_2_account_url: "",
        location_img_3_account_name: "",
        location_img_3_account_url: ""
      },
      holy_locations_3: {
        location_address: "",
        location_name: "",
        location_url: "",
        location_img_1: "",
        location_img_2: "",
        location_img_3: "",
        location_img_1_account_name: "",
        location_img_1_account_url: "",
        location_img_2_account_name: "",
        location_img_2_account_url: "",
        location_img_3_account_name: "",
        location_img_3_account_url: ""
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * 新しい楽曲ドキュメントを追加
 * @param {Object} songData - 楽曲データ（部分的なデータでも可）
 * @param {Object} options - オプション設定
 * @returns {Object} 処理結果
 */
async function addNewSong(songData = {}) {
  console.log('=== 新規楽曲ドキュメント追加開始 ===');
  console.log('楽曲名:', songData.name || '未設定');
  
  try {
    // テンプレートを取得
    const template = getSongTemplate();
    
    // 入力データでテンプレートを上書き（ディープマージ）
    const mergedData = deepMerge(template, songData);
    
    // コレクションを取得
    const collection = adminDb.collection('songs');
    
    // 新しいドキュメント参照を作成（IDは自動生成）
    const docRef = collection.doc();
    
    // 自動生成されたIDをドキュメントデータに設定
    mergedData.id = docRef.id;
    
    // ドキュメントを追加
    await docRef.set(mergedData);
    
    console.log('\n=== 処理完了 ===');
    console.log(`✅ 新しい楽曲ドキュメントを追加しました`);
    console.log(`ドキュメントID: ${docRef.id}`);
    console.log(`楽曲名: ${mergedData.name || '未設定'}`);
    console.log(`アルバム: ${mergedData.album || '未設定'}`);
    console.log(`作成日時: ${mergedData.createdAt}`);
    
    return {
      success: true,
      documentId: docRef.id,
      songData: mergedData
    };
    
  } catch (error) {
    console.error('❌ 楽曲ドキュメント追加エラー:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 複数の楽曲ドキュメントを一括追加
 * @param {Array} songsArray - 楽曲データの配列
 * @param {Object} options - オプション設定
 * @returns {Object} 処理結果
 */
async function addMultipleSongs(songsArray, options = {}) {
  console.log('=== 複数楽曲ドキュメント一括追加開始 ===');
  console.log(`追加数: ${songsArray.length}件`);
  
  const results = [];
  
  try {
    // バッチ処理を使用
    const batch = adminDb.batch();
    const collection = adminDb.collection('songs');
    
    for (const songData of songsArray) {
      // テンプレートを取得
      const template = getSongTemplate();
      
      // 入力データでテンプレートを上書き
      const mergedData = deepMerge(template, songData);
      
      // 新しいドキュメント参照を作成
      const docRef = collection.doc();
      mergedData.id = docRef.id;
      
      // バッチに追加
      batch.set(docRef, mergedData);
      
      results.push({
        documentId: docRef.id,
        songName: mergedData.name || '未設定'
      });
      
      if (options.verbose) {
        console.log(`準備完了: ${mergedData.name || '未設定'} (${docRef.id})`);
      }
    }
    
    // バッチ実行
    await batch.commit();
    
    console.log('\n=== 一括処理完了 ===');
    console.log(`✅ ${results.length}件の楽曲ドキュメントを追加しました`);
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.songName} (${result.documentId})`);
    });
    
    return {
      success: true,
      addedCount: results.length,
      results: results
    };
    
  } catch (error) {
    console.error('❌ 一括追加エラー:', error);
    return {
      success: false,
      error: error.message,
      partialResults: results
    };
  }
}

/**
 * オブジェクトのディープマージ
 * @param {Object} target - ベースオブジェクト
 * @param {Object} source - マージするオブジェクト
 * @returns {Object} マージされたオブジェクト
 */
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// === 使用例 ===

async function executeAddNewSongs() {
  console.log('新規楽曲ドキュメント追加処理を開始します...');
  
  try {
    // 例1: 単一楽曲の追加
    await addNewSong({
      name: "言って。",
      kana: "いって",
      album: "夏草が邪魔をする",
      year: "2017年6月28日リリース",
      lyrics: "https://yorushika.com/lyrics/detail/2/",
      mv_url: "https://www.youtube.com/embed/F64yFFnZfkI",
      song_info: "n-bunaが「純粋に、シンプルにいいものを作ろうと思って作りました。」との想いを込めて制作された楽曲。\n本作は「雲と幽霊」と対になる構成となっており、相互に関連性を持つ作品として位置づけられている。\n歌詞から「言って」から「いった」「逝った」へと言葉が変化することで、失った人への想いが表現された楽曲。",
      reference_list: {
        reference_url_1: "https://natalie.mu/music/pp/yorushika/page/3",
        reference_url_2: "",
        reference_url_3: ""
      },
      goods: {
        goods_1: {
          goods_info: "",
          goods_name: "バンドスコアピース 言って。",
          goods_url: "https://a.r10.to/hPfZVp"
        },
        goods_2: {
          goods_info: "",
          goods_name: "LIVE TOUR 2024 前世 ピンバッジ",
          goods_url: "https://amzn.asia/d/3OGT3aC"
        },
        goods_3: {
          goods_info: "",
          goods_name: "月光 言って キーホルダー ",
          goods_url: "https://amzn.asia/d/abNA8WT"
        }
      },
    });

    // 例1: 単一楽曲の追加
    // await addNewSong({
    //   name: "花に亡霊",
    //   kana: "はなにぼうれい",
    //   album: "だから僕は音楽を辞めた",
    //   year: "2019年4月10日リリース",
    //   lyrics: "https://yorushika.com/lyrics/detail/21/",
    //   mv_url: "https://www.youtube.com/embed/8IHLBIRVa5s",
    //   song_info: "ヨルシカの代表的な楽曲の一つ。桜と別れをテーマにした楽曲。",
    //   literatures: {
    //     literatures_1: {
    //       author: "太宰治",
    //       work_name: "桜桃",
    //       url: "https://www.aozora.gr.jp/cards/000035/files/301_14912.html"
    //     }
    //   },
    //   holy_locations: {
    //     holy_locations_1: {
    //       location_name: "哲学の道",
    //       location_address: "京都府京都市左京区",
    //       location_url: "https://maps.app.goo.gl/example"
    //     }
    //   }
    // });
    
    // 例2: 複数楽曲の一括追加
    // await addMultipleSongs([
    //   {
    //     name: "ただ君に晴れ",
    //     kana: "ただきみにはれ",
    //     album: "だから僕は音楽を辞めた",
    //     year: "2019年4月10日リリース"
    //   },
    //   {
    //     name: "思想犯",
    //     kana: "しそうはん", 
    //     album: "エルマ",
    //     year: "2019年8月28日リリース"
    //   }
    // ], {
    //   verbose: true
    // });
    
    console.log('🎉 全ての処理が完了しました');
    process.exit(0);
    
  } catch (error) {
    console.error('処理中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// 実行
executeAddNewSongs();

// エクスポート（他のファイルから使用可能）
export { addNewSong, addMultipleSongs, getSongTemplate };
