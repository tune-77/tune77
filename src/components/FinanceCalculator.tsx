import React, { useState, useEffect } from "react";
import { calculateComparison, formatYen, LEASE_RATE_FACTORS } from "../financeUtils";
import { CalculationResults } from "../types";
import { Calculator, HelpCircle, AlertCircle, Info, Landmark, Coins, FileCheck } from "lucide-react";

interface FinanceCalculatorProps {
  initialCost?: number;
  initialTerm?: number;
  onCalculationChange?: (results: CalculationResults) => void;
}

export default function FinanceCalculator({
  initialCost = 10000000, // Default 10M JP Yen (e.g., working machine)
  initialTerm = 5,
  onCalculationChange,
}: FinanceCalculatorProps) {
  const [cost, setCost] = useState<number>(initialCost);
  const [termYears, setTermYears] = useState<number>(initialTerm);
  const [interestRate, setInterestRate] = useState<number>(2.0);
  const [taxRate, setTaxRate] = useState<number>(30);
  const [results, setResults] = useState<CalculationResults | null>(null);

  // Quick preset cost buttons in JPY
  const costPresets = [
    { label: "100万 (PC等)", value: 1000000 },
    { label: "500万 (厨房等)", value: 5000000 },
    { label: "1,000万 (工作機械)", value: 10000000 },
    { label: "3,000万 (高級設備)", value: 30000000 },
  ];

  useEffect(() => {
    const calcResults = calculateComparison(cost, termYears, interestRate, taxRate);
    setResults(calcResults);
    if (onCalculationChange) {
      onCalculationChange(calcResults);
    }
  }, [cost, termYears, interestRate, taxRate]);

  if (!results) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <Calculator className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">リース料率・財務比較シミュレーター</h2>
      </div>

      {/* 2カラム入力レイアウト */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* 左側: 入力フォーム */}
        <div className="space-y-5 bg-slate-50 p-5 rounded-xl border border-gray-100">
          <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-200 pb-2">基本パラメータの設定</h3>
          
          {/* 設備総額 */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5 flex justify-between">
              <span>導入設備の見積総額 (税込)</span>
              <span className="font-mono text-indigo-600 font-bold">{formatYen(cost)}</span>
            </label>
            <div className="relative">
              <input
                id="calc-input-cost"
                type="number"
                min="100000"
                max="500000000"
                step="500000"
                value={cost}
                onChange={(e) => setCost(Math.max(100000, Number(e.target.value)))}
                className="w-full pl-3 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
              />
              <span className="absolute right-3 top-2 text-xs text-gray-400">円</span>
            </div>
            
            {/* プリセットボタン */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {costPresets.map((preset) => (
                <button
                  key={preset.value}
                  id={`preset-${preset.value}`}
                  type="button"
                  onClick={() => setCost(preset.value)}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                    cost === preset.value
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* リース期間 (選択) */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              希望リース期間 (耐用年数に応じて選択)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.keys(LEASE_RATE_FACTORS).map((yearsStr) => {
                const years = Number(yearsStr);
                const isSelected = termYears === years;
                return (
                  <button
                    key={years}
                    id={`term-btn-${years}`}
                    type="button"
                    onClick={() => setTermYears(years)}
                    className={`py-2 rounded-lg text-xs font-semibold text-center border transition cursor-pointer flex flex-col justify-center items-center ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{years}年</span>
                    <span className={`text-[9px] mt-0.5 font-normal ${isSelected ? "text-indigo-100" : "text-gray-400"}`}>
                      {years * 12}ヶ月
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-500 mt-1.5 leading-normal">
              ※月額リース料率は自動設定されます (例: 5年満了時は日本の中小標準で月約 {LEASE_RATE_FACTORS[5]}%)。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* 比較用銀行融資金利 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex justify-between">
                <span>比較用借入金利（年）</span>
                <span className="font-mono text-gray-600">{interestRate}%</span>
              </label>
              <input
                id="calc-input-interest"
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>優良中小: 0.8%</span>
                <span>一般中小: 2.0%</span>
                <span>高い: 5.0%</span>
              </div>
            </div>

            {/* 実効法人税率 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex justify-between">
                <span>実効法人税率</span>
                <span className="font-mono text-gray-600">{taxRate}%</span>
              </label>
              <input
                id="calc-input-tax"
                type="range"
                min="20"
                max="40"
                step="1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>赤字相当: 20%</span>
                <span>中小国定: 30%</span>
                <span>大手水準: 40%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 右側: 試算クイック結果 */}
        <div className="border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              リース試算速報
            </span>
            <div className="mt-3">
              <span className="text-xs text-gray-500 block">月々のお支払リース料（目安）</span>
              <span className="text-3xl md:text-4xl font-extrabold text-indigo-900 tracking-tight font-sans block mt-1">
                {formatYen(results.monthlyLeaseFee)}
                <span className="text-base font-normal text-gray-500 ml-1">/ 月 (税抜)</span>
              </span>
              <div className="flex justify-between text-xs text-gray-500 mt-2 border-b border-gray-100 pb-2">
                <span>月額リース料率: {results.leaseRateFactor}%</span>
                <span>総お支払額 ({termYears}年): {formatYen(results.totalLeasePaid)}</span>
              </div>
            </div>

            {/* 中小特例メリットのアピール事項 */}
            <div className="mt-4 bg-emerald-50/70 rounded-lg p-3.5 border border-emerald-100 text-xs">
              <div className="flex gap-2 items-start">
                <FileCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="text-emerald-950 space-y-1">
                  <p className="font-bold">中小企業の特例：経費（支払賃借料）一括処理が可能</p>
                  <p className="leading-relaxed">
                    本案件は、<strong>中小指針の特例</strong>に該当するため、面倒な固定資産計上を行わず、毎年のリースのお支払金をそのまま「全額経費（損金）」として計上可能です。
                    この経費化による節税額（累計）は <strong>{formatYen(results.taxSavingsLease)}</strong> となり、実質的な経済的コストは <strong>{formatYen(results.netCostLease)}</strong> まで軽減されます。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-[11px] text-gray-400 bg-yellow-50 p-2 rounded border border-yellow-100">
            <AlertCircle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
            <span>※リース料率は設備の種類・リース会社各社の審査によって微少に前後します。</span>
          </div>
        </div>
      </div>

      {/* 3者比較表（リース vs 融資 vs 自己資金） */}
      <h3 className="font-bold text-gray-800 text-sm mb-3">【3大調達手法】キャッシュフロー・実質負担の徹底比較</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-slate-100 border-b border-gray-200">
              <th className="p-3 font-semibold text-gray-700 w-1/4">比較項目</th>
              <th className="p-3 font-semibold text-indigo-700 bg-indigo-50/50 w-1/4">① リース契約 (Expensed)</th>
              <th className="p-3 font-semibold text-gray-700 w-1/4">② 銀行融資・ローンでの購入</th>
              <th className="p-3 font-semibold text-gray-700 w-1/4">③ 自己資金 (Cash) 購入</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* 初期費用 */}
            <tr>
              <td className="p-3 font-medium text-gray-600">初期必要キャッシュ</td>
              <td className="p-3 font-bold text-indigo-700 bg-indigo-50/30">
                0円 <span className="text-[10px] font-normal text-gray-400 block">(月リース料1回目のみ)</span>
              </td>
              <td className="p-3 text-gray-700">
                数十万円〜頭金分 <span className="text-[10px] font-normal text-gray-400 block">(保証料や手数料)</span>
              </td>
              <td className="p-3 font-semibold text-red-600">
                {formatYen(cost)} <span className="text-[10px] font-normal text-gray-400 block">(全額前払い)</span>
              </td>
            </tr>
            {/* 月々のお支払 */}
            <tr>
              <td className="p-3 font-medium text-gray-600">月額支払い (およそ)</td>
              <td className="p-3 font-bold text-indigo-800 bg-indigo-50/30">
                {formatYen(results.monthlyLeaseFee)}
              </td>
              <td className="p-3 text-gray-700">
                {formatYen(Math.round(results.totalLoanPaid / (termYears * 12)))}
                <span className="text-[10px] text-gray-400 block">元利均等返済計上</span>
              </td>
              <td className="p-3 text-gray-500">
                0円 <span className="text-[10px] text-gray-400 block">(初期で全額支払済)</span>
              </td>
            </tr>
            {/* 期間内総支払額 */}
            <tr>
              <td className="p-3 font-medium text-gray-600">期間内額面合計アウトフロー</td>
              <td className="p-3 font-semibold text-gray-700 bg-indigo-50/20">
                {formatYen(results.totalLeasePaid)}
              </td>
              <td className="p-3 text-gray-700">
                {formatYen(results.totalLoanPaid)}
                <span className="text-[10px] text-gray-400 block">(利息負担計上を含む)</span>
              </td>
              <td className="p-3 text-gray-700">
                {formatYen(cost)}
              </td>
            </tr>
            {/* 固定資産税・保険の処理 */}
            <tr>
              <td className="p-3 font-medium text-gray-600">固定資産税・動産総合保険</td>
              <td className="p-3 text-indigo-700 font-medium bg-indigo-50/30">
                リース料に内包 <span className="text-[10px] text-gray-500 block">(自社での納税・諸手続不要)</span>
              </td>
              <td className="p-3 text-gray-700">
                自社負担・自社対応 <span className="text-[10px] text-gray-400 block">(【想定】{formatYen(cost * 0.01 * termYears)}等)</span>
              </td>
              <td className="p-3 text-gray-700">
                自社負担・自社対応 <span className="text-[10px] text-gray-400 block">(【想定】{formatYen(cost * 0.01 * termYears)}等)</span>
              </td>
            </tr>
            {/* 損金・経費化(節税メリット) */}
            <tr className="bg-slate-50/30">
              <td className="p-3 font-medium text-gray-600">お支払累積に伴う節税効果</td>
              <td className="p-3 font-semibold text-emerald-700 bg-indigo-50/20">
                {formatYen(results.taxSavingsLease)}
                <span className="text-[10px] text-gray-500 block">(SME特例による毎月一発経費)</span>
              </td>
              <td className="p-3 text-emerald-700">
                {formatYen(results.taxSavingsLoan)}
                <span className="text-[10px] text-gray-400 block">(減価償却＋支払利息分)</span>
              </td>
              <td className="p-3 text-emerald-700">
                {formatYen(results.taxSavingsCash)}
                <span className="text-[10px] text-gray-400 block">(減価償却費分※利益超過時)</span>
              </td>
            </tr>
            {/* 実質負担額 */}
            <tr className="bg-indigo-50/40">
              <td className="p-3 font-extrabold text-gray-800">実質経済コスト (税引後)</td>
              <td className="p-3 font-extrabold text-indigo-900 bg-indigo-100/50">
                {formatYen(results.netCostLease)}
                <span className="text-[10px] font-normal text-indigo-950 block">(諸々手続き代行の手間削減を含む)</span>
              </td>
              <td className="p-3 font-semibold text-gray-800">
                {formatYen(results.netCostLoan)}
                <span className="text-[10px] text-gray-400 block">(固定資産税等を含む)</span>
              </td>
              <td className="p-3 font-semibold text-gray-800">
                {formatYen(results.netCostCash)}
                <span className="text-[10px] text-gray-400 block">(固定資産税等を含む)</span>
              </td>
            </tr>
            {/* 会計処理・オンバランス */}
            <tr>
              <td className="p-3 font-medium text-gray-600">バランスシート計上 (SME)</td>
              <td className="p-3 font-medium text-emerald-700 bg-indigo-50/30">
                不要 (オフバランス) <span className="text-[10px] text-emerald-950 block">財務指標（自己資本比率）維持</span>
              </td>
              <td className="p-3 text-gray-700">
                必要 (オンバランス) <span className="text-[10px] text-gray-400 block">資産/有利子負債が増え健全比率低下</span>
              </td>
              <td className="p-3 text-gray-700">
                必要 (オンバランス) <span className="text-[10px] text-gray-400 block">キャッシュ減少、固定資産増</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs">
          <span className="font-semibold text-indigo-800 block text-[11px] mb-1">💡 運転キャッシュの保護</span>
          銀行融資枠を使わずに100%全額を支払リースとして分割払いできるため、手元現金を一切減らさず、急な支払いや賞与支給などの手元資金を厚く持てます。
        </div>
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-xs">
          <span className="font-semibold text-emerald-800 block text-[11px] mb-1">⚙️ 手続きのアウトソース</span>
          固定資産を保有すると発生する「固定資産税の納税申告」「動産総合保険の手配・事故時の請求」をリース会社が一切を引き受けます。事務スタッフが不在の中小でも安心です。
        </div>
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs">
          <span className="font-semibold text-amber-800 block text-[11px] mb-1">🔄 陳腐化（入れ替え）対策</span>
          リース契約終了時は「返却」をするだけで新機種入れ替えが簡単です。産業廃棄物としての処分義務やパソコンなどの機密滅却手続きなどのコストも削減できます。
        </div>
      </div>
    </div>
  );
}
