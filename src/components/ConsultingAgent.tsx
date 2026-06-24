import React, { useState, useRef, useEffect } from "react";
import { CompanyProfile, EquipmentDetails, Message } from "../types";
import { MessageSquare, Send, Bot, User, CornerDownLeft, Sparkles, AlertCircle, HelpCircle } from "lucide-react";

interface ConsultingAgentProps {
  companyProfile: CompanyProfile;
  equipmentDetails: EquipmentDetails;
}

export default function ConsultingAgent({ companyProfile, equipmentDetails }: ConsultingAgentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `はじめまして！日本の中小企業に特化した「リース財務AIエージェント」です。
現在、設備投資（リース検討など）に関する悩みをご相談いただけます。

【検討中の想定物件】
・対象機器: ${equipmentDetails.name || "未指定"} (${equipmentDetails.type})
・想定価格: ${new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(equipmentDetails.cost)}

【貴社プロフィール】
・業種: ${companyProfile.industry} (およそ設立 ${companyProfile.yearsInBusiness} 年)
・財務状況: ${companyProfile.financialStatus}

上記のパラメータをバックグラウンドで考慮しながらお答えいたします。
「リース料を低く交渉するポイント」「即時償却税制(経営強化)の手続き」「銀行ローンとの細かい比較」など、何でも聞いてください。`,
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested tags to click
  const promptChips = [
    "創業1年目でもリース審査は通る？",
    "リース料率を下げる交渉ポイント",
    "中小企業経営強化税制の100%即時償却とは",
    "物件をリースアップ（終了）した後はどうなる？",
    "中途解約するとどのような違約金が出る？",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInputValue("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          companyProfile,
          equipmentDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("AIエージェントへの接続に失敗しました。");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "エラーが発生しました。時間を置いて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[650px] overflow-hidden">
      
      {/* エージェントヘッダー */}
      <div className="bg-indigo-900 px-6 py-4 flex items-center justify-between text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-750 border border-indigo-500 flex items-center justify-center shadow-inner">
            <Bot className="w-5 h-5 text-indigo-100 placeholder-indigo" />
          </div>
          <div>
            <span className="text-[10px] bg-indigo-805 text-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold font-mono block w-fit">
              SME FINANCE AGENT
            </span>
            <h2 className="text-sm md:text-base font-bold text-indigo-50 leading-tight">
              中堅・中小リース財務相談コンサルAI
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-indigo-200 text-xs">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="hidden sm:inline">24時間稼働・日本税制準拠</span>
        </div>
      </div>

      {/* チャット履歴表示部 */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-4">
        {messages.map((msg, index) => {
          const isBot = msg.role === "assistant";
          return (
            <div
              key={index}
              id={`chat-msg-${index}`}
              className={`flex gap-3 max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${
                  isBot
                    ? "bg-indigo-100 border-indigo-200 text-indigo-700"
                    : "bg-indigo-600 border-indigo-500 text-white"
                }`}
              >
                {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div>
                <div
                  className={`p-3.5 rounded-2xl shadow-sm text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                    isBot
                      ? "bg-white border border-gray-150 text-gray-800 rounded-tl-none"
                      : "bg-indigo-600 text-white rounded-tr-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border bg-indigo-150 border-indigo-200 text-indigo-700 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl border border-gray-150 bg-white shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200" />
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-300" />
              </div>
              <span className="text-xs text-gray-500">最適な回答を作成中...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* サジェストチップス & 入力バー */}
      <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
        
        {/* チップス */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              id={`chip-${idx}`}
              type="button"
              disabled={loading}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300 text-[11px] text-gray-600 transition cursor-pointer whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* 入力フォーム */}
        <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2">
          <input
            id="chat-user-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={loading}
            placeholder="ここにリース財務に関する疑問を入力（例：経営強化法証明書の発行手続きなど）"
            className="flex-1 pl-4 pr-12 py-3 border border-gray-300 rounded-xl bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputValue.trim() || loading}
            className={`p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center justify-center flex-shrink-0 cursor-pointer ${
              (!inputValue.trim() || loading) ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        
        <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            具体的な金額や財務状況をシミュレーターで登録すると。より詳細な診断になります。
          </span>
          <span className="hidden md:inline font-mono text-[9px]">
            [Enter]で送信
          </span>
        </div>
      </div>
    </div>
  );
}
