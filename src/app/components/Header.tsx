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
              <h1 className="text-2xl md:text-3xl font-bold tracking-wide mb-3" 
                  style={{ 
                    fontFamily: "'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic Medium', sans-serif",
                    letterSpacing: '0.1em'
                  }}>
                ヨルシカ<span className="text-yellow-800 mx-1 text-3xl md:text-3xl">&</span>個体図書
              </h1>
              
              {/* 装飾的な線 */}
              <div className="w-32 h-px bg-white opacity-60 mx-auto mb-3"></div>
            </div>
          </Link>
          
          {/* 副題 */}
          <p className=" opacity-60 tracking-wide " style={{ 
               fontFamily: "'Dela Gothic One', cursive",
               fontWeight: '400'
             }}>
            ヨルシカ楽曲まとめサイト
          </p>
        </div>
      </header>
    </>
  );
}

export default Header;