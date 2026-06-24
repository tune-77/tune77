import React, { useState } from "react";
import { CompanyProfile, EquipmentDetails, CalculationResults } from "../types";
import { FileText, Copy, Check, Download, Sparkles, Loader2, FileSpreadsheet, Eye } from "lucide-react";

interface DocumentGeneratorProps {
  companyProfile: CompanyProfile;
  equipmentDetails: EquipmentDetails;
  calculationResults: CalculationResults | null;
}

export default function DocumentGenerator({
  companyProfile,
  equipmentDetails,
  calculationResults,
}: DocumentGeneratorProps) {
  const [docType, setDocType] = useState<"proposal" | "rfp">("proposal");
  const [loading, setLoading] = useState<boolean>(false);
  const [docContent, setDocContent] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setDocContent(null);
    setCopied(false);

    try {
      const response = await fetch("/api/generate-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          companyProfile,
          equipmentDetails,
          dataResults: calculationResults,
        }),
      });

      if (!response.ok) {
        throw new Error("文書の生成に失敗しました。サーバーエラー。");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setDocContent(data.content);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "文書の自動作成中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!docContent) return;
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">リース稟議起案・見積依頼書のAI自動生成</h2>
      </div>

      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        シミュレーションや企業プロファイル設定に基づき、社内での意思決定を通すための<strong>「導入稟議起案書（社内稟議テンプレート）」</strong>、あるいは複数のリース会社から好条件を引き出すための<strong>「リース見積仕様伝達書」</strong>を、日本の標準営業・財務フォーマットで自動生成します。
      </p>

      {/* タイプ選択 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          id="doc-type-proposal"
          type="button"
          onClick={() => {
            setDocType("proposal");
            setDocContent(null);
          }}
          className={`cursor-pointer p-4 rounded-xl border text-left transition flex items-start gap-3.5 ${
            docType === "proposal"
              ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className={`p-2 rounded-lg flex-shrink-0 ${docType === "proposal" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold block text-sm text-gray-850">
              社内起案・稟議書下書きテンプレート
            </span>
            <span className="text-xs text-gray-500 block leading-relaxed mt-1">
              購入・融資との比較検証、中小企業特例によるオフバランス財務メリット、想定減税効果等を網羅した社内承認用の説得文書。
            </span>
          </div>
        </button>

        <button
          id="doc-type-rfp"
          type="button"
          onClick={() => {
            setDocType("rfp");
            setDocContent(null);
          }}
          className={`cursor-pointer p-4 rounded-xl border text-left transition flex items-start gap-3.5 ${
            docType === "rfp"
              ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className={`p-2 rounded-lg flex-shrink-0 ${docType === "rfp" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold block text-sm text-gray-850">
              リース見積条件・仕様確認要求書 (RFP)
            </span>
            <span className="text-xs text-gray-500 block leading-relaxed mt-1">
              設備仕様、希望リース期間、税制優遇証明書の発行要請などを正確に伝え、優良リース会社に見積競争をかけるための文書。
            </span>
          </div>
        </button>
      </div>

      {/* 生成アクション */}
      <div className="flex justify-end mb-6">
        <button
          id="doc-generate-btn"
          onClick={handleGenerate}
          disabled={loading}
          className={`cursor-pointer px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-2 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>AI書士が作成中... (約10秒)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>選択したビジネス文書を下書き自動生成</span>
            </>
          )}
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* 生成テキスト表示 */}
      {docContent && (
        <div className="border border-gray-300 rounded-xl overflow-hidden mt-6 bg-slate-50 relative">
          
          {/* コントロールヘッダー */}
          <div className="bg-slate-200 border-b border-gray-300 px-4 py-2.5 flex justify-between items-center flex-shrink-0">
            <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-gray-500" />
              <span>下書き出力プレビュー</span>
            </span>
            
            <div className="flex gap-2">
              <button
                id="doc-copy-btn"
                onClick={copyToClipboard}
                className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-gray-100 transition shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">コピーしました</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" />
                    <span>クリップボードにコピー</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ドキュメント中身 */}
          <div className="p-5 font-mono text-xs md:text-sm text-gray-800 leading-relaxed max-h-[450px] overflow-y-auto whitespace-pre-wrap select-all bg-white font-sans bg-dot-grid">
            {docContent}
          </div>

          <div className="bg-amber-50 px-5 py-3 border-t border-gray-200 text-[10px] md:text-xs text-amber-900 leading-relaxed">
            <strong>⚠️ カスタマイズ時のヒント:</strong>
            <p className="mt-0.5">
              〇〇となっている箇所や日付・氏名等は、実際の貴社名称や物件の見積内容（リース期間、導入時期など）に合わせて適宜打ち替えてからご利用ください。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
