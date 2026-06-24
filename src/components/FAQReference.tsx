import React, { useState } from "react";
import { HelpCircle, ChevronRight, ChevronDown, BookOpen, Shield, TrendingUp, NotebookTabs } from "lucide-react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
  category: "basic" | "tax" | "accounting";
}

export default function FAQReference() {
  const [activeCategory, setActiveCategory] = useState<"all" | "basic" | "tax" | "accounting">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: "basic",
      question: "ファイナンス・リースとオペレーティング・リースの違いは何ですか？",
      answer: (
        <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>ファイナンス・リース取引</strong>とは、「ノンキャンセラブル（途中中途解約不能）」かつ「フルペイアウト（物件に係るコスト総額を基本的に借手が実質支払う）」の要件をすべて満たすリース取引です。設備を買い取るのと同様の実質的な効果があります。
          </p>
          <p>
            <strong>オペレーティング・リース取引</strong>とは、ファイナンス・リース取引以外の取引です。主に車両（オートリース）やパソコン等で行われ、あらかじめ「リース終了時の予想残存価値（残価）」を設定し、物件想定価格から残価を引いた金額のみを支払うため、月々の支払いを押さえられます。
          </p>
        </div>
      ),
    },
    {
      category: "accounting",
      question: "中小企業の支払リース料の「経費処理（オフバランス処理）」とは何ですか？",
      answer: (
        <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
          <p>
            日本の「中小企業の会計に関する指針」によれば、中小企業は<strong>所有権移転外ファイナンス・リース</strong>について、企業会計上の「オンバランス（資産・負債としての計上）」義務を免除され、毎月支払うリース料をそのまま損金経費（<strong>賃借料処理/オフバランス処理</strong>）として処理することが認められています。
          </p>
          <p>
            これにより、賃貸借取引（オペレーティングリース等のレンタルと同様）として、簡単な経理仕訳だけで済み、決算書の自己資本比率を高く見せ、財務健全度をアピールすることが可能になります。
          </p>
        </div>
      ),
    },
    {
      category: "tax",
      question: "リースでも「中小企業投資促進税制」や「経営強化税制」は使えますか？",
      answer: (
        <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>はい、適用できます。</strong>
            所有権移転外ファイナンス・リース取引において、リース会社を通じて一般社団法人日本中小企業簡易リース工業会等から発行される「リース仕様確認証書（A類、B類など）」を取得することで、以下の税制特典を受けられます。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>中小企業投資促進税制：</strong>基準取得価額の7%（特定の場合は10%）の税額控除、または30%の特別償却。
            </li>
            <li>
              <strong>中小企業経営強化税制：</strong>経営力向上計画の認定を受けることで、リース物件であっても取得価額相当分の<strong>100%即時償却（実質的に控除枠としての恩恵）</strong>、または10%（一部7%）の特別税額控除が適用可能です。
            </li>
          </ul>
        </div>
      ),
    },
    {
      category: "basic",
      question: "銀行融資で設備を購入するのと、リースを組むのではどちらがお得ですか？",
      answer: (
        <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
          <p>
            一概にどちらが良いとは言えませんが、以下のような違いがあります。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">銀行融資・購入のメリット</span>
              <ul className="list-disc pl-4 mt-1 text-xs space-y-1">
                <li>金利相当負担が一般にリースより低い</li>
                <li>設備の所有権が当初から（または完済後）手に入る</li>
                <li>長期的に使用する場合、トータルコストが最も安い</li>
              </ul>
            </div>
            <div>
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">リースのメリット</span>
              <ul className="list-disc pl-4 mt-1 text-xs space-y-1">
                <li>頭金・初期投資が不要で、手元資金（運転キャッシュ）を温存可能</li>
                <li>銀行の借入枠を温存できるため、機動的な運転資金調達に余力を残せる</li>
                <li>固定資産税の納税や動産保険の手続きが全てリース料に含まれ、完全にアウトソーシング可能</li>
                <li>陳腐化が早い（数年で最新機種に換わる）機器の処分や入れ替え手続きが容易</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      category: "basic",
      question: "審査に不安がある場合、銀行とリースでの難易度差はありますか？",
      answer: (
        <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong>一般的に、リース審査の方が融資に比べて承認されやすい傾向があります。</strong>
          </p>
          <p>
            リース契約では、所有権が最終的にリース会社に残るため、仮に支払いが滞った場合は、リース会社が物件を引き揚げて回収に充てることができます（物件自体が担保の役割を果たします）。
          </p>
          <p>
            そのため、創業間もない企業や一時的に決算が赤字の企業でも、その設備が会社の売上・生産性向上に直結する見込みがある場合、比較的審査が通りやすくなっています。
          </p>
        </div>
      ),
    }
  ];

  const filteredFaqs = activeCategory === "all" ? faqs : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">精選リース・財務知識ガイド</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        日本の中小企業に適用される「中小企業特例」や「税制優遇制度」について、基本となるポイントを整理したクイックリファレンスです。
      </p>

      {/* カテゴリ選択 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {(["all", "basic", "accounting", "tax"] as const).map((cat) => {
          let label = "すべて";
          if (cat === "basic") label = "基本・調達比較";
          if (cat === "accounting") label = "会計処理・中小企業特例";
          if (cat === "tax") label = "税制優遇・即時償却";

          return (
            <button
              key={cat}
              id={`faq-cat-${cat}`}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* FAQアコーディオン */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const globalIdx = faqs.findIndex(f => f.question === faq.question);
          return (
            <div
              key={globalIdx}
              id={`faq-item-${globalIdx}`}
              className="border border-gray-150 rounded-lg hover:border-gray-350 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex justify-between items-center text-left p-4 focus:outline-none cursor-pointer"
              >
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500 mt-1 flex-shrink-0" />
                  <span className="font-semibold text-gray-800 text-sm md:text-base pr-4">
                    {faq.question}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 pt-0 border-t border-gray-100 bg-slate-50 rounded-b-lg">
                  <div className="my-2">
                    {faq.answer}
                  </div>
                  <div className="flex justify-end mt-3">
                    <span className="text-[10px] font-mono tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                      {faq.category === "basic" ? "基本" : faq.category === "tax" ? "税制優遇" : "会計・中小指針"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 flex items-start gap-3">
        <Shield className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-indigo-950 space-y-1">
          <p className="font-bold">免責事項（ディスクレイマー）</p>
          <p className="leading-relaxed">
            当エージェントが提供するシミュレーション結果、及び財務診断等の情報は一般的なリース制度解説・試算であり、実際のリース契約取引や適用可否を法的に保証するものではありません。各中小企業における税務申告・会計処理の適用に際しては、最終的に管轄税務署、ならびに顧問税理士・公認会計士へご相談いただけますようお願いいたします。
          </p>
        </div>
      </div>
    </div>
  );
}
