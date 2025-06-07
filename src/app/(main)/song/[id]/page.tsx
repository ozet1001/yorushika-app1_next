import { getSongById } from '@/lib/songs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
}

// ✅ ISR設定（SEO + パフォーマンス）
export const revalidate = 3600;

// ✅ SEO最重要: 動的メタデータ生成
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const song = await getSongById(params.id);

  if (!song) {
    return {
      title: '楽曲が見つかりません - Yorushika App 1st',
      description: '指定された楽曲は存在しないか削除されています。',
      robots: 'noindex, nofollow', // 404は検索エンジンからブロック
    };
  }

  // ✅ 完璧なSEOメタデータ
  return {
    title: `${song.name} - ${song.album} | Yorushika App 1st`,
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
    
    // Open Graph（SNS共有）
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
          url: '/og-default.jpg', // デフォルト画像
          width: 1200,
          height: 630,
          alt: 'ヨルシカ楽曲データベース',
        }
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${song.name} - ${song.album}`,
      description: song.song_info?.slice(0, 120) || `${song.name}の楽曲詳細`,
      images: song.photo ? [song.photo] : ['/og-default.jpg'],
    },
    
    // 構造化データ用
    other: {
      'music:song': song.name,
      'music:album': song.album,
      'music:release_date': song.year,
    },
  };
}

// ✅ SEO最適: Server Componentで完全なHTML生成
export default async function SongDetailPage({ params }: PageProps) {
  const song = await getSongById(params.id);

  if (!song) {
    notFound();
  }

  // ✅ 構造化データ（JSON-LD）
  const jsonLd = {
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
  };

  return (
    <>
      {/* ✅ 構造化データ埋め込み */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      
      {/* 
      ✅ このページは (main) レイアウトを使用するため、
      layout.tsx が自動的にHeader、Sidebar、Mainコンポーネントを表示
      
      Mainコンポーネントが usePathname() で /song/[id] を検知し、
      自動的に楽曲詳細を表示する
      
      このコンポーネントの役割:
      1. SEO最適化（メタデータ、構造化データ）
      2. 404処理
      3. ISR設定
      */}
      
      {/* ✅ 非表示のSEO用データ（検索エンジン用） */}
      <div style={{ display: 'none' }}>
        <h1>{song.name}</h1>
        <p>アーティスト: ヨルシカ</p>
        <p>アルバム: {song.album}</p>
        <p>リリース: {song.year}</p>
        <p>{song.song_info}</p>
      </div>
    </>
  );
}
