import React, { useState } from "react";
import FinanceCalculator from "./components/FinanceCalculator";
import SuitabilityDiagnosis from "./components/SuitabilityDiagnosis";
import ConsultingAgent from "./components/ConsultingAgent";
import DocumentGenerator from "./components/DocumentGenerator";
import FAQReference from "./components/FAQReference";
import { CompanyProfile, EquipmentDetails, CalculationResults } from "./types";
import { 
  Bot, 
  Calculator, 
  Stethoscope, 
  FileText, 
  BookOpen, 
  Building, 
  Cpu, 
  TrendingUp, 
  Coins, 
  ShieldCheck, 
  Info,
  Menu,
  X
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"simulator" | "diagnosis" | "chat" | "documents" | "knowledge">("simulator");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Consolidated global state for SME profiles (can be shared between tabs)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    companyName: "ニシハラ精密金型有限会社",
    industry: "製造業（精密機械・加工等）",
    yearsInBusiness: 6,
    financialStatus: "黒字（安定）",
    cashPosition: "通常（キャッシュ維持したい）",
    location: "大阪府東大阪市",
  });

  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentDetails>({
    type: "工作機械・製造設備",
    name: "高精密ワイヤー放電加工機 FA-30",
    cost: 15000000, // 1,500,0000 JPY
    usefulLife: 7, // 7 years useful life
    purpose: "海外クライアント向け超微細金型の受注獲得に伴う加工精度の刷新",
    isObsolescenceFast: false,
  });

  const [calcResults, setCalcResults] = useState<CalculationResults | null>(null);

  const formatYenValue = (val: number) => {
    return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 }).format(val);
  };

  const navItems = [
    { id: "simulator", label: "財務シミュレーター", icon: Calculator },
    { id: "diagnosis", label: "AI適合度診断", icon: Stethoscope },
    { id: "chat", label: "AI相談コンサル室", icon: Bot },
    { id: "documents", label: "稟議書・見積依頼書作成", icon: FileText },
    { id: "knowledge", label: "特例・税制ガイド", icon: BookOpen },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      
      {/* メインヘッダー */}
      <header className="bg-indigo-950 text-white border-b border-indigo-900 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* ロゴ・タイトル */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-650 flex items-center justify-center border border-indigo-500 shadow-inner">
                <Cpu className="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <h1 className="text-sm md:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                  SMEリース・ファイナンス支援エージェント
                </h1>
                <p className="text-[10px] text-indigo-300 mt-1 uppercase tracking-wider font-semibold font-mono hidden sm:block">
                  Japan SME Custom Lease Advisor
                </p>
              </div>
            </div>

            {/* 現在の会社・設備簡易インジケータ */}
            <div className="hidden lg:flex items-center gap-4 bg-indigo-900/50 px-4 py-1.5 rounded-lg border border-indigo-800/80 text-xs">
              <div className="flex items-center gap-1.5 border-r border-indigo-850 pr-4">
                <Building className="w-3.5 h-3.5 text-indigo-300" />
                <span className="text-gray-300 font-medium">{companyProfile.companyName || "未登録"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-300 font-medium">対象設備:</span>
                <span className="text-emerald-300 font-semibold">{equipmentDetails.name || "未登録"}</span>
                <span className="text-white bg-indigo-800 px-1.5 py-0.5 rounded text-[10px] font-mono">
                  {formatYenValue(equipmentDetails.cost)}
                </span>
              </div>
            </div>

            {/* モバイルメニューボタン */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                id="mobile-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-indigo-200 hover:text-white p-2"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* サブインジケータ (モバイル向け) */}
      <div className="lg:hidden bg-indigo-900 text-white/90 px-4 py-2 text-[10px] md:text-xs flex justify-between items-center border-b border-indigo-950">
        <span className="truncate max-w-[40%] font-medium">🏢 {companyProfile.companyName}</span>
        <span className="truncate max-w-[50%] font-bold text-emerald-300">⚙️ {equipmentDetails.name} ({formatYenValue(equipmentDetails.cost)})</span>
      </div>

      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col lg:flex-row px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* サイドバーナビゲーション / モバイルドロワー */}
        <nav className={`lg:w-64 flex-shrink-0 lg:block ${sidebarOpen ? "block" : "hidden"} lg:static fixed inset-0 top-24 lg:top-auto z-20 bg-slate-50 lg:bg-transparent p-4 lg:p-0`}>
          <div className="space-y-1.5 bg-white lg:bg-transparent rounded-xl border border-gray-200 lg:border-none p-4 lg:p-0 shadow-sm lg:shadow-none">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block px-3 mb-2">
              メニューカテゴリ
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs md:text-sm font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "bg-white lg:bg-white border lg:border border-gray-200 lg:border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? "text-indigo-100" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* ナビゲーション下の財務情報ボード */}
            <div className="mt-8 p-4 bg-white border border-gray-200 rounded-xl space-y-3.5 shadow-xs">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-gray-500 block border-b border-gray-150 pb-1.5">
                財務プロフィール指標
              </span>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">営業年数:</span>
                  <span className="font-bold text-gray-800">{companyProfile.yearsInBusiness}年</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">最近の収支:</span>
                  <span className="font-bold text-emerald-700">{companyProfile.financialStatus}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">キャッシュ戦略:</span>
                  <span className="font-bold text-indigo-700 truncate max-w-[60%]" title={companyProfile.cashPosition}>
                    {companyProfile.cashPosition.split("（")[0]}
                  </span>
                </div>
              </div>

              {calcResults && (
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block">
                    試算中のリース料率 (参考)
                  </span>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">お支払期間:</span>
                    <span className="font-bold text-gray-800">{calcResults.leaseTermYears}年間</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">月額目安料率:</span>
                    <span className="font-mono font-bold text-indigo-700">{calcResults.leaseRateFactor}%</span>
                  </div>
                  <div className="flex justify-between text-xs bg-slate-50 p-1.5 rounded">
                    <span className="text-[10px] text-gray-500">月額リース料:</span>
                    <span className="font-bold text-indigo-900">{formatYenValue(calcResults.monthlyLeaseFee)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* セキュリティバッジ */}
            <div className="mt-4 p-3 bg-slate-50 border border-gray-200 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="text-[10px] text-gray-500 leading-normal">
                <span className="font-bold text-gray-850 block">サーバー安全接続</span>
                Gemini API接続はバックエンド側で暗号化・安全管理されています。
              </div>
            </div>
          </div>
        </nav>

        {/* メイン編集コンテンツ */}
        <main className="flex-1 min-w-0">
          {activeTab === "simulator" && (
            <div className="space-y-6">
              {/* コラム：中小企業のリース制度の概略 */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Coins className="w-6 h-6 text-indigo-700" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-indigo-950 text-sm md:text-base">
                    なぜ「日本の設備投資」でリースリース取引が選ばれるのか？
                  </h3>
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    日本の中小企業は、<strong>「中小企業投資促進税制（最大10%控除）」</strong>や、一定の認定計画による<strong>「100%即時償却（経営強化税制）」</strong>を余すところなくリースでも併用できます。また、支払金をそのまま全額経費計上（オフバランス化）できるため、自己資本比率を維持したまま、機動的に最先端の型・工作機械やITシステムを更新できるようになります。
                  </p>
                </div>
              </div>

              <FinanceCalculator 
                initialCost={equipmentDetails.cost} 
                initialTerm={equipmentDetails.usefulLife}
                onCalculationChange={(res) => {
                  setCalcResults(res);
                  setEquipmentDetails(prev => ({
                    ...prev,
                    cost: res.totalCashPaid, // Cost syncs instantly
                  }));
                }}
              />
            </div>
          )}

          {activeTab === "diagnosis" && (
            <SuitabilityDiagnosis
              companyProfile={companyProfile}
              setCompanyProfile={setCompanyProfile}
              equipmentDetails={equipmentDetails}
              setEquipmentDetails={setEquipmentDetails}
            />
          )}

          {activeTab === "chat" && (
            <ConsultingAgent
              companyProfile={companyProfile}
              equipmentDetails={equipmentDetails}
            />
          )}

          {activeTab === "documents" && (
            <DocumentGenerator
              companyProfile={companyProfile}
              equipmentDetails={equipmentDetails}
              calculationResults={calcResults}
            />
          )}

          {activeTab === "knowledge" && (
            <FAQReference />
          )}
        </main>

      </div>

      {/* フッター */}
      <footer className="bg-slate-900 text-gray-400 text-xs py-8 border-t border-slate-800 flex-shrink-0 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-semibold text-gray-300">
              © 2026 日本中小企業リースファイナンス支援エージェント
            </span>
            <div className="flex gap-4">
              <span className="text-gray-500">日本全国の中小企業のデジタル化・省力化資本調達を応援します</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

