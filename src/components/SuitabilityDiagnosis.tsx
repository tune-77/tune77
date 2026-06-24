import React, { useState } from "react";
import { CompanyProfile, EquipmentDetails } from "../types";
import { Stethoscope, CheckCircle, ArrowRight, Loader2, Sparkles, Building, Briefcase, ChevronRight, FileSpreadsheet, ShieldX } from "lucide-react";

interface SuitabilityDiagnosisProps {
  companyProfile: CompanyProfile;
  setCompanyProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  equipmentDetails: EquipmentDetails;
  setEquipmentDetails: React.Dispatch<React.SetStateAction<EquipmentDetails>>;
}

export default function SuitabilityDiagnosis({
  companyProfile,
  setCompanyProfile,
  equipmentDetails,
  setEquipmentDetails,
}: SuitabilityDiagnosisProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [diagnosisReport, setDiagnosisReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDiagnosisReport(null);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyProfile, equipmentDetails }),
      });

      if (!response.ok) {
        throw new Error("診断に失敗しました。サーバーエラー。");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setDiagnosisReport(data.diagnosis);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "診断エラーが発生しました。時間を置いて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    "製造業（精密機械・加工等）",
    "建設・建築・土木業",
    "飲食業・食品サービス",
    "IT・ソフトウェア・通信",
    "医療法人・クリニック・歯科",
    "小売・電気商業・卸売業",
    "物流・運輸・自動車販売",
    "美容・サービス・その他",
  ];

  const financialStatuses = [
    "黒字（安定）",
    "創業期・スタートアップ",
    "赤字・債務超過",
    "損益トントン",
  ] as const;

  const cashPositions = [
    "潤沢（手元資金に余裕あり）",
    "通常（キャッシュ維持したい）",
    "逼迫（手元資金を減らしたくない）",
  ] as const;

  const equipmentTypes = [
    "IT機器（PC・サーバー等）",
    "工作機械・製造設備",
    "商用車両（トラック・営業車等）",
    "店舗内装・厨房機器",
    "オフィス什器・コピー機",
    "その他（医療機器等）",
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <Stethoscope className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">リース適合度・審査傾向のAI総合診断</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        自社の財務状況と導入予定の設備を入力するだけで、リース導入の適性や審査通過の難易度、および日本の推奨補助金や優遇税制（即時償却など）の可能性を自動AIシミュレーション診断します。
      </p>

      <form onSubmit={handleDiagnose} className="space-y-6">
        
        {/* 1. 企業プロファイル情報 */}
        <div className="bg-slate-50 p-5 rounded-xl border border-gray-150 space-y-4">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 border-b border-gray-200 pb-2">
            <Building className="w-4 h-4 text-indigo-600" />
            <span>ステップ 1: 自社の企業・財務プロフィール</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                会社名 / 屋号 (任意)
              </label>
              <input
                id="profile-company-name"
                type="text"
                value={companyProfile.companyName}
                onChange={(e) => setCompanyProfile({ ...companyProfile, companyName: e.target.value })}
                placeholder="例: 株式会社サトウ精密"
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                本社所在地 (都府県)
              </label>
              <input
                id="profile-company-location"
                type="text"
                value={companyProfile.location}
                onChange={(e) => setCompanyProfile({ ...companyProfile, location: e.target.value })}
                placeholder="例: 東京都"
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                業種カテゴリ
              </label>
              <select
                id="profile-company-industry"
                value={companyProfile.industry}
                onChange={(e) => setCompanyProfile({ ...companyProfile, industry: e.target.value })}
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                営業年数 (設立からの経過年数)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="profile-company-years"
                  type="number"
                  min="0"
                  max="100"
                  value={companyProfile.yearsInBusiness}
                  onChange={(e) => setCompanyProfile({ ...companyProfile, yearsInBusiness: Math.max(0, Number(e.target.value)) })}
                  className="w-24 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-xs text-gray-600">年間</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                最近の代表的な決算・収支状況
              </label>
              <div className="space-y-1.5">
                {financialStatuses.map((status) => (
                  <label key={status} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      id={`financialStatus-${status}`}
                      type="radio"
                      name="financialStatus"
                      checked={companyProfile.financialStatus === status}
                      onChange={() => setCompanyProfile({ ...companyProfile, financialStatus: status })}
                      className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                手元現預金・キャッシュの戦略
              </label>
              <div className="space-y-1.5">
                {cashPositions.map((pos) => (
                  <label key={pos} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      id={`cashPosition-${pos}`}
                      type="radio"
                      name="cashPosition"
                      checked={companyProfile.cashPosition === pos}
                      onChange={() => setCompanyProfile({ ...companyProfile, cashPosition: pos })}
                      className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span>{pos}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 設備情報 */}
        <div className="bg-slate-50 p-5 rounded-xl border border-gray-150 space-y-4">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2 border-b border-gray-200 pb-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <span>ステップ 2: 導入検討中の設備・物件情報</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                設備カテゴリ
              </label>
              <select
                id="equipment-type"
                value={equipmentDetails.type}
                onChange={(e) => setEquipmentDetails({ ...equipmentDetails, type: e.target.value as any })}
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {equipmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                具体的な設備・メーカー・型番
              </label>
              <input
                id="equipment-name"
                type="text"
                value={equipmentDetails.name}
                onChange={(e) => setEquipmentDetails({ ...equipmentDetails, name: e.target.value })}
                placeholder="例: マシニングセンタ VM-5 (碌々産業)"
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                見積想定総額 (円・税抜)
              </label>
              <input
                id="equipment-cost"
                type="number"
                value={equipmentDetails.cost}
                onChange={(e) => setEquipmentDetails({ ...equipmentDetails, cost: Math.max(100000, Number(e.target.value)) })}
                placeholder="金額を入力"
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                法定耐用年数 (目安)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="equipment-life"
                  type="number"
                  min="2"
                  max="50"
                  value={equipmentDetails.usefulLife}
                  onChange={(e) => setEquipmentDetails({ ...equipmentDetails, usefulLife: Math.max(2, Number(e.target.value)) })}
                  className="w-24 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <span className="text-xs text-gray-600">年間</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              今回の設備導入の主たる目的 / 期待効果
            </label>
            <input
              id="equipment-purpose"
              type="text"
              value={equipmentDetails.purpose}
              onChange={(e) => setEquipmentDetails({ ...equipmentDetails, purpose: e.target.value })}
              placeholder="例: 製造ラインの自動化による納期短縮と人的ミス削減"
              className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer pt-1">
              <input
                id="obsolescence"
                type="checkbox"
                checked={equipmentDetails.isObsolescenceFast}
                onChange={(e) => setEquipmentDetails({ ...equipmentDetails, isObsolescenceFast: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer"
              />
              <div>
                <span className="font-semibold block text-gray-900">技術陳腐化スピードが速い製品ですか？</span>
                <span className="text-[10px] text-gray-500 block leading-relaxed">
                  ※IT機器や測定器のように、3〜5年で新しい上位機種が出て価値が急落する可能性が高い物件の場合にチェックしてください。
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* 診断実行ボタン */}
        <div className="flex justify-end shadow-sm">
          <button
            id="diagnose-submit-btn"
            type="submit"
            disabled={loading}
            className={`cursor-pointer px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-2 ${
              loading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>適合診断書を作成中... (約10秒)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-indigo-200" />
                <span>AI適合度・審査シミュレーション開始</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* エラーメッセージ */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
          <ShieldX className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 診断結果レポート */}
      {diagnosisReport && (
        <div className="mt-8 border border-indigo-200 bg-indigo-50/20 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-indigo-100 pb-3 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-indigo-900 text-lg">リース総合診断レポート</h3>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-gray-800 space-y-4">
            {diagnosisReport.split("\n").map((line, i) => {
              // Basic header rendering logic for pretty display
              if (line.startsWith("###")) {
                return (
                  <h5 key={i} className="font-bold text-indigo-950 text-sm md:text-base border-l-4 border-indigo-600 pl-2 mt-4 mb-2">
                    {line.replace("###", "").trim()}
                  </h5>
                );
              } else if (line.startsWith("##")) {
                return (
                  <h4 key={i} className="font-extrabold text-indigo-900 text-base md:text-lg border-b border-indigo-200 pb-1.5 mt-5 mb-3">
                    {line.replace("##", "").trim()}
                  </h4>
                );
              } else if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.") || line.startsWith("5.")) {
                return (
                  <h4 key={i} className="font-bold text-indigo-900 text-base mt-5 mb-2 bg-indigo-100/30 px-3 py-1.5 rounded">
                    {line}
                  </h4>
                );
              } else if (line.startsWith("-") || line.startsWith("*")) {
                return (
                  <li key={i} className="ml-4 list-disc text-xs md:text-sm text-gray-700 list-inside my-1 leading-relaxed">
                    {line.substring(2).trim()}
                  </li>
                );
              } else {
                return <p key={i} className="text-xs md:text-sm text-gray-700 whitespace-pre-wrap">{line}</p>;
              }
            })}
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-indigo-100 pt-4">
            <span className="text-[10px] text-gray-400">※およそ現在の中小企業向け税制に基づいた分析結果です。</span>
          </div>
        </div>
      )}
    </div>
  );
}
