import { cache } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import db from '@/lib/firebase/firebase';

interface Song {
  id: string;
  name: string;
  kana: string;
  album: string;
  year: string;
  song_info: string;
  lyrics: string;
  mv_url: string;
  photo: string;
  holy_locations?: {
    location_name: string;
    location_address: string;
    location_url: string;
  };
  goods?: {
    goods_name: string;
    goods_info: string;
    goods_url: string;
  };
  reference_list?: {
    reference_url_1: string;
    reference_url_2: string;
    reference_url_3: string;
  };
  createdAt?: string | null;
  editAt?: string | null;
  isDeleted?: boolean;
}

// ✅ React.cacheでリクエスト内キャッシュ
export const getSongs = cache(async (): Promise<Song[]> => {
  try {
    console.log('🎵 曲データを取得中...');
    console.log('🔥 Firebase設定:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '存在' : '不存在');
    const startTime = Date.now();
    
    const songsRef = query(
      collection(db, "songs"), 
      orderBy("kana", "asc")
    );
    const querySnapshot = await getDocs(songsRef);
    
    const songs = querySnapshot.docs.map((doc) => {
      const data = {
        id: doc.id,
        ...doc.data(),
      };
      
      // ✅ JSON.stringify/parseでTimestampを自動的に文字列化
      return JSON.parse(JSON.stringify(data));
    }) as Song[];

    // 削除済みの曲を除外
    const activeSongs = songs.filter(song => !song.isDeleted);

    const endTime = Date.now();
    console.log(`✅ ${activeSongs.length}件の曲を取得完了 (${endTime - startTime}ms)`);
    
    return activeSongs;
    
  } catch (error) {
    console.error('❌ 曲データ取得エラー:', error);
    return [];
  }
});

// ✅ 楽曲検索のヘルパー関数
export const getSongById = cache(async (id: string): Promise<Song | null> => {
  const allSongs = await getSongs();
  return allSongs.find(song => song.id === id) || null;
});
