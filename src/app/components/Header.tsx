import Image from 'next/image';
import Link from 'next/link';

function Header() {
  return (
    <>
    
    <header className="w-full py-5 text-white shadow-md" style={{ backgroundColor: '#499FD8' }}>
    <div className="container flex flex-col items-center justify-center px-4 mx-auto">
        <Link href="/">
            <Image 
                src="/images/common/yorushika_header_logo1.jpg" 
                alt="ヨルシカヘッダーロゴ" 
                width={180} 
                height={100}
                priority // 画像の優先読み込み
                placeholder="blur" // ローディング時のぼかし効果
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyv" 
                className="hover:opacity-80 transition-opacity duration-200"
            />
        </Link>
      <h1 className="mt-4 text-xl font-bold">Yorushika App 1st</h1>

    </div>
    </header>
    </>
  );
}

export default Header;