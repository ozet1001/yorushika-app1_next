import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | 月猫図書館',
  description: '「月猫図書館」のプライバシーポリシーです。',
}

export default function PrivacyPolicyPage() {
  return (
    <>
        <div className="min-h-screen bg-gray-50">
        {/* ヘッダー */}
        <Header />

        {/* メインコンテンツ */}
        <main className="container max-w-4xl px-4 py-12 mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-8 pb-4 border-b-2" style={{ color: '#499FD8' }}>
                プライバシーポリシー
            </h1>

            {/* アクセス解析ツール */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#499FD8' }}>
                アクセス解析ツールについて
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                    当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
                </p>
                <p>
                    Googleアナリティクスは、トラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
                </p>
                <p>
                    この機能はCookieを無効にすることで収集を拒否することができますので、お使いのブラウザの設定をご確認ください。
                </p>
                <p>
                    Googleアナリティクスの利用規約については、
                    <a 
                    href="https://www.google.com/analytics/terms/jp.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                    >
                    こちら
                    </a>
                    をご確認ください。
                </p>
                </div>
            </section>

            {/* アフィリエイトプログラム */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#499FD8' }}>
                アフィリエイトプログラムについて
                </h2>
                
                <h3 className="text-lg font-semibold mb-3 text-gray-800">楽天アフィリエイト</h3>
                <div className="text-gray-700 leading-relaxed space-y-3 mb-6">
                <p>
                    当サイトは、楽天株式会社が提供する楽天アフィリエイト・プログラムに参加しています。
                </p>
                <p>
                    一部のリンクはアフィリエイトリンクとなっており、当サイトを経由して商品が購入された場合、当サイトが紹介料を得ることがあります。
                </p>
                </div>

                <h3 className="text-lg font-semibold mb-3 text-gray-800">Amazonアソシエイト</h3>
                <div className="text-gray-700 leading-relaxed space-y-3 mb-4">
                <p>
                    当サイトは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
                </p>
                <p>
                    当サイトを経由してAmazonで商品が購入された場合、当サイトが紹介料を得ることがあります。
                </p>
                </div>

                <div className="bg-blue-50 border-l-4 p-4 text-sm text-gray-700" style={{ borderColor: '#499FD8' }}>
                ※ アフィリエイトリンクを経由して商品を購入された場合でも、訪問者の皆様には金銭的な負担は一切発生しません。
                </div>
            </section>

            {/* Cookie */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#499FD8' }}>
                Cookieについて
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                    当サイトでは、アクセス解析やアフィリエイトプログラムのためにCookieを使用しています。
                </p>
                <p>
                    Cookieは、訪問者がウェブサイトを訪れた際に、その訪問者のコンピュータに保存される小さなテキストファイルです。
                </p>
                <p>
                    Cookieの利用を望まない場合は、ブラウザの設定でCookieを無効にすることができます。
                </p>
                </div>
            </section>

            {/* 変更について */}
            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#499FD8' }}>
                プライバシーポリシーの変更について
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                    当サイトは、本プライバシーポリシーの内容を必要に応じて変更することがあります。
                </p>
                <p>
                    変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じるものとします。
                </p>
                </div>
            </section>

            {/* 制定日 */}
            <div className="text-right text-sm text-gray-500 mt-12 pt-4 border-t">
                制定日：2025年9月17日<br/>
                最終更新日：2025年10月7日
            </div>

            {/* トップへ戻るボタン */}
            <div className="text-center mt-8">
                <Link 
                href="/" 
                className="inline-block px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#499FD8' }}
                >
                トップページへ戻る
                </Link>
            </div>
            </div>
        </main>
        </div>

        {/* フッター */}
        <Footer />
    </>
  )
}