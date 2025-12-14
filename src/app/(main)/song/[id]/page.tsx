import { getSongById } from '@/lib/songs';
import { Metadata } from 'next';
import Main from "@/app/components/Main/Main";
import { getSongs } from "@/lib/songs";

interface PageProps {
  params: {
    id: string;
  };
}

// ISR設定（SEO + パフォーマンス）
// export const revalidate = 3600;

// 動的メタデータ生成
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const song = await getSongById(params.id);

  if (!song) {
    return {
      title: '楽曲が見つかりません - 月猫図書館',
      description: '指定された楽曲は存在しないか削除されています。',
      robots: 'noindex, nofollow',
    };
  }

  return {
    title: `${song.name} - (${song.album}) | 月猫図書館`,
    description: `${song.name}（${song.album}, ${song.year}）の詳細情報。${song.song_info?.slice(0, 120)}`,
    keywords: [
      'ヨルシカ',
      song.name,
      song.album,
      song.kana,
      '楽曲',
      '歌詞',
      '音楽',
      'アニメ',
      'J-POP'
    ].join(', '),
    
    openGraph: {
      title: `${song.name} - ${song.album}`,
      description: song.song_info || `${song.name}の楽曲詳細`,
      type: 'article',
      images: song.photo ? [
        {
          url: song.photo,
          width: 1200,
          height: 630,
          alt: `${song.name} - ${song.album}`,
        }
      ] : [
        {
          url: '/og-default.jpg',
          width: 1200,
          height: 630,
          alt: 'ヨルシカ楽曲データベース',
        }
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: `${song.name} - (${song.album})`,
      description: song.song_info?.slice(0, 120) || `${song.name}の楽曲詳細`,
      images: song.photo ? [song.photo] : ['/og-default.jpg'],
    },
    
    other: {
      'music:song': song.name,
      'music:album': song.album,
      'music:release_date': song.year,
    },
  };
}


// ✅ 実際のレンダリング（Main コンポーネントが楽曲詳細を表示）
export default async function SongPage({ params }: PageProps) {
  const allSongs = await getSongs();
  const song = await getSongById(params.id);

  // ✅ 構造化データ（JSON-LD）- SEO用
  const jsonLd = song ? {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name: song.name,
    byArtist: {
      '@type': 'MusicGroup',
      name: 'ヨルシカ',
    },
    inAlbum: {
      '@type': 'MusicAlbum',
      name: song.album,
    },
    datePublished: song.year,
    description: song.song_info,
    url: `https://yourdomain.com/song/${song.id}`,
    ...(song.lyrics && { 
      associatedMedia: {
        '@type': 'MediaObject',
        name: '歌詞',
        url: song.lyrics,
      }
    }),
    ...(song.mv_url && {
      video: {
        '@type': 'VideoObject',
        name: `${song.name} MV`,
        url: song.mv_url,
      }
    }),
  } : null;

  return (
    <>
      {/* ✅ 構造化データ埋め込み（SEO用） */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}
      
      {/* ✅ 非表示のSEO用データ（検索エンジン用） */}
      {song && (
        <div style={{ display: 'none' }}>
          <h1>{song.name}</h1>
          <p>アーティスト: ヨルシカ</p>
          <p>アルバム: {song.album}</p>
          <p>リリース: {song.year}</p>
          <p>{song.song_info}</p>
        </div>
      )}
      
      {/* ✅ Main コンポーネントを表示させる */}
      <Main songsData={allSongs} />
    </>
  );
}
