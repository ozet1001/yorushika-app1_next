import React, { useState, useEffect } from 'react';

const XShareButton = ({ 
  text = "", 
  hashtags = ["ヨルシカ", "個体", "ファンサイト"],
  size = "medium",
  style = "default" 
}) => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // クライアントサイドで現在のURLを取得
    setCurrentUrl(window.location.href);
  }, []);

  const createShareUrl = () => {
    const shareText = text || `ヨルシカの楽曲情報をまとめた「月猫図書館」をチェック！`;
    const hashtagsString = hashtags.join(',');
    
    const params = new URLSearchParams({
      url: currentUrl + "\n",
      text: shareText,
      hashtags: hashtagsString
    });

    return `https://twitter.com/intent/tweet?${params.toString()}`;
  };

  const handleShare = () => {
    const shareUrl = createShareUrl();
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // スタイル設定
  const sizeClasses: Record<"small" | "medium" | "large", string> = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };

  const styleClasses: Record<"default" | "outline" | "minimal", string> = {
    default: "bg-black hover:bg-gray-800 text-white",
    outline: "border-2 border-black hover:bg-black text-black hover:text-white",
    minimal: "text-black hover:text-gray-700 underline"
  };

  if (style === "minimal") {
    return (
      <button
        onClick={handleShare}
        className={`${styleClasses[style as keyof typeof styleClasses]} ${sizeClasses[size as keyof typeof sizeClasses]} transition-colors duration-200 flex items-center gap-2`}
      >
        <XIcon size={size === "small" ? 16 : size === "medium" ? 20 : 24} />
        このページをシェア
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      className={`${styleClasses[style as keyof typeof styleClasses]} ${sizeClasses[size as keyof typeof sizeClasses]} rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md`}
    >
      <XIcon size={size === "small" ? 16 : size === "medium" ? 20 : 24} />
      Xでシェア
    </button>
  );
};

// X(Twitter)のアイコンコンポーネント
interface XIconProps {
  size: number;
}

const XIcon: React.FC<XIconProps> = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// // 使用例のデモ
// const ShareButtonDemo = () => {
//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-2xl mx-auto space-y-8">
//         <h1 className="text-2xl font-bold text-center mb-8">Xシェアボタン サンプル</h1>
        
//         {/* 基本的な使用例 */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">基本スタイル</h2>
//           <div className="flex gap-4 flex-wrap">
//             <XShareButton />
//             <XShareButton size="small" />
//             <XShareButton size="large" />
//           </div>
//         </div>

//         {/* アウトラインスタイル */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">アウトラインスタイル</h2>
//           <div className="flex gap-4 flex-wrap">
//             <XShareButton style="outline" />
//             <XShareButton style="outline" size="small" />
//             <XShareButton style="outline" size="large" />
//           </div>
//         </div>

//         {/* ミニマルスタイル */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-semibent mb-4">ミニマルスタイル</h2>
//           <div className="flex gap-4 flex-wrap">
//             <XShareButton style="minimal" />
//             <XShareButton style="minimal" size="small" />
//             <XShareButton style="minimal" size="large" />
//           </div>
//         </div>

//         {/* カスタムテキスト例 */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">楽曲ページ用（カスタムテキスト）</h2>
//           <div className="flex gap-4 flex-wrap">
//             <XShareButton 
//               text="ヨルシカ「ただ君に晴れ」の歌詞解釈をチェック！月猫図書館で詳しく解説中✨"
//               hashtags={["ヨルシカ", "ただ君に晴れ", "歌詞解釈", "個体"]}
//             />
//           </div>
//         </div>

//         {/* 使用方法の説明 */}
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-lg font-semibold mb-4">使用方法</h2>
//           <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
// {`// 基本的な使用
// <XShareButton />

// // カスタマイズ
// <XShareButton 
//   text="カスタムシェアテキスト"
//   hashtags={["ヨルシカ", "楽曲名", "個体"]}
//   size="large"
//   style="outline"
// />`}
//           </pre>
//         </div>
//       </div>
//     </div>
//   );
// };

export default XShareButton;