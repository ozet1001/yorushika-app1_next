import React from "react";
import SongListClient from "@/app/components/SongListClient";
// firestoreからのSong型をインポート
import { Song } from "@/types/songs";

interface SidebarProps {
  songsData?: Song[]; // レイアウトから渡されるデータ
}

const Sidebar = async ({ songsData }: SidebarProps) => {
  // ✅ propsでデータが渡された場合はそれを使用、なければ独自取得
  let all_songs: Song[];

  if (songsData) {
    // MainLayoutから渡されたデータを使用
    all_songs = songsData;
    console.log(
      `🎵 [Sidebar] レイアウトからデータを受信: ${all_songs.length}件`
    );
  } else {
    // 従来通り独自でデータ取得（後方互換性）
    const { getSongs } = await import("@/lib/songs");
    all_songs = await getSongs();
    console.log(`🎵 [Sidebar] 独自でデータ取得: ${all_songs.length}件`);
  }

  return (
    <aside className="h-[100%] z-0 p-2 border border-r-2 rounded-sm">
      <div className="h-[270px] lg:h-[90%] pr-2">
        <SongListClient initialSongs={all_songs} />
      </div>
    </aside>
  );
};

export default Sidebar;
