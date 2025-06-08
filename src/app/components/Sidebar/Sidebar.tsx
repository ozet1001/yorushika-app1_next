import React from "react";
import { MdLibraryMusic } from "react-icons/md";
import SongListClient from "@/app/components/SongListClient";

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

interface SidebarProps {
  songsData?: Song[]; // レイアウトから渡されるデータ
}

const Sidebar = async ({ songsData }: SidebarProps) => {
  // ✅ propsでデータが渡された場合はそれを使用、なければ独自取得
  let all_songs: Song[];
  
  if (songsData) {
    // MainLayoutから渡されたデータを使用
    all_songs = songsData;
    console.log(`🎵 [Sidebar] レイアウトからデータを受信: ${all_songs.length}件`);
  } else {
    // 従来通り独自でデータ取得（後方互換性）
    const { getSongs } = await import('@/lib/songs');
    all_songs = await getSongs();
    console.log(`🎵 [Sidebar] 独自でデータ取得: ${all_songs.length}件`);
  }

  return (
    <aside className="h-[95%] z-0 p-2 border border-r-2 rounded-sm">
      <span className="mt-2 sm:mt-6 mb-2 font-bold flex items-center">
        <MdLibraryMusic className="inline ml-3 mr-1 text-lg" />
        曲一覧（{all_songs.length}件）
      </span> 
      
      <div className="h-[80%] pr-2">
        <SongListClient initialSongs={all_songs} />
      </div>
    </aside>
  );
};

export default Sidebar;