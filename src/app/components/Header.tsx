// import Image from 'next/image';
import Link from 'next/link';

function Header() {
  return (
    <>
      <header className="w-full py-8 text-white shadow-lg" style={{ backgroundColor: '#499FD8' }}>
        <div className="container flex flex-col items-center justify-center px-4 mx-auto">
          <Link href="/" className="group">
            {/* 文字ベースのロゴデザイン */}
            {/* <div className="text-center transition-transform duration-300 group-hover:scale-105"> */}
            <div className="text-center transition-transform duration-300">
              {/* メインタイトル */}
              <h1 className="text-2xl md:text-4xl font-bold tracking-wide mb-4" 
                  style={{
                    fontFamily: 'var(--font-kaisei), serif',
                    letterSpacing: '0.1em'
                  }}>
                <span className="mr-3">🌙</span>
                月猫図書館
                <span className="ml-3">🐈‍⬛</span>
              </h1>
              
              {/* 装飾的な線 */}
              <div className="w-55 h-px bg-white opacity-60 mx-auto mb-2"></div>
            </div>
          </Link>
          
          {/* 副題 */}
          <p className=" font-normal opacity-90 tracking-normal mt-2" 
             style={{ 
               fontFamily: "'Kosugi Maru', 'Rounded Mplus 1c', 'Hiragino Maru Gothic ProN', cursive",
               fontWeight: '400'
             }}>
            ヨルシカ楽曲まとめサイト
          </p>
        </div>
      </header>
      {/* グローバルナビゲーション */}
      <nav
        className="w-full py-3 text-white shadow-md"
        style={{ backgroundColor: '#7FC3EA' }}
      >
        <div className="container flex flex-wrap justify-center gap-4 md:gap-8 mx-auto px-4">
          {/* ホーム */}
          <Link
            href="/"
            className="text-sm sm:text-base font-semibold hover:underline hover:scale-105 transition-all duration-150"
          >
            🏠 ホーム
          </Link>

          {/* クイズ */}
          <Link
            href="/quiz"
            className="text-sm sm:text-base font-semibold hover:underline hover:scale-105 transition-all duration-150 whitespace-nowrap"
          >
            ❓ クイズ
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Header;