import { cache } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import db from '@/lib/firebase/firebase';
// firestoreからのSong型をインポート
import { Song } from "@/types/songs";


// ✅ React.cacheでリクエスト内キャッシュ
export const getSongs = cache(async (): Promise<Song[]> => {
  try {
    console.log('🎵 曲データを取得中...');
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
