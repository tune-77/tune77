import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK server-side safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("⚠️ GEMINI_API_KEY is not set. AI Features will be unavailable.");
  }
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
}

// 1. API: Custom AI chat endpoint for SME Lease advice
app.post("/api/chat", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "GoogleGenAI is not initialized. Please ensure GEMINI_API_KEY is configured in Secrets.",
    });
  }

  const { messages, companyProfile, equipmentDetails } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format." });
  }

  // System instruction detailing Japanese SME lease finance knowledge
  const systemInstruction = `
あなたは日本の中小企業（SME）のリースファイナンス、税制優遇、および設備調達に特化した超プロフェッショナルな「リース財務コンサルタントAIエージェント」です。
ユーザーは中小企業の経営者、財務・経理担当者、または税理士です。

以下の日本のリース取引に関する法制度、税制、および実務知識を基に、正確で、実践的かつ具体的、そして丁寧な日本語で回答してください。

■ 重要知識・前提条件：
1. ファイナンス・リース (Finance Lease)
   - フルペイアウト（物件取得コスト、金利、保険等すべてカバー）かつ原則中途解約不可（ノンキャンセラブル）。
   - 「所有権移転ファイナンス・リース」と「所有権移転外ファイナンス・リース」に分かれる。
   - 所有権移転外リースでは、耐用年数に関わらず「リース期間定額法」で減価償却（リース期間を耐用年数とする）ができる。

2. 中小企業の特例 (SME Lease Accounting Rules)
   - 日本の「中小企業の会計に関する指針」に基づき、中小企業はファイナンス・リース取引であっても通常の賃貸借取引（オペレーティングリース同様）として「賃借料（支払リース料）」として全額損金経費処理（オフバランス処理）が認められている。貸借対照表に負債や資産を計上（オンバランス化）する必要がなく、会計・経理処理を極めてシンプルに保てる（※利息相当額や減価償却の面倒な計算を省略可能）。

3. オペレーティング・リース (Operating Lease)
   - ファイナンス・リース以外の取引。車両、工作機械、PCなどで残価（残存価値）を設定して、物件価値の一部のみをリース料として支払う。
   - ファイナンス・リースに比べて月額の支払額を安く抑えられる。
   - リース終了時に「返却」「再リース」「買取り（残価精算）」等を選択可能。

4. 税制優遇制度 (SME Tax Incentives)
   - 「中小企業投資促進税制」：一定の要件を満たすリース取引において、基準取得価額の30%の特別償却または7%（特定の場合は10%）の税額控除が適用可能。※リース企業から「A類」「B類」などのリース証書（リース工業会発行）を取得する必要がある。
   - 「中小企業経営強化税制」：中小企業等経営強化法に基づき、経営力向上計画の認定を受けることで「即時償却（100％減価償却）」または10%（資本金3000万円超のアカデミックな中小企業等は7%）の税額控除が選択可能。リース取引でも適用可能（取得価額相当分に対して税額控除）。

5. リース vs 銀行融資 vs 自己資金（cash）の比較基準
   - 自己資金：金利負担ゼロ。しかし、資金流動性（運転資金/キャッシュフロー）を圧迫するリスク。
   - 銀行融資：調達コストは金融機関金利（年0.5%〜2.5%程度）でリースより一般的に低いが、融資枠（借入限度額）を消費し、担保や個人保証を求められることが多い。また自社での資産計上（オンバランス）、固定資産税の支払、動産総合保険の手続き、毎年の減価償却業務などの負担が発生。
   - リース：初期費用ほぼゼロ。金融枠（銀行融資枠）を温存できるため運転資金に余裕ができる。固定資産税の納税申告・動産総合保険の手続きをリース会社が代行。支払リース料が毎月均等、経費処理（オフバランス）が可能。実質金利・手数料を足した「リース料率」は、融資よりやや高くなる。

■ 顧客背景の考慮：
- 業種や決算状況（黒字・赤字・創業期）、検討中の設備（工作機械、ITシステム、商用車、店舗の内装等）に合わせて、
  「自己資金」「銀行融資」「ファイナンスリース」「オペレーティングリース」のどれが最も向いているかを親身になって整理してあげてください。
- 創業期や赤字企業の場合、銀行融資の審査は厳しいが、リース会社は物件自体に担保価値を見出せるため、審査に通りやすいケースもあることなどを説明してください。

■ 回答のトーン：
- 誠実で信頼できる、プロフェッショナルかつ温かみのある日本語を使用。
- 専門用語には簡単な解説を添えて、理解しやすくする。
- 財務的な意思決定（リースか購入か）を多角的な視点（キャッシュフロー、税金、事務手続き、陳腐化リスク）から客観的に比較できるようにアドバイスする。
- 法的な断定（「絶対に税理士に認められます」等）は避け、「一般的な中小企業特例の要件を満たす場合はこうなる」「最終的には顧問税理士とご確認ください」との適切なディスクレイマー（免責事項）を入れる。

現在の会社プロファイル:
${JSON.stringify(companyProfile || "未設定")}

検討中の設備:
${JSON.stringify(equipmentDetails || "未設定")}
`;

  try {
    // We map client messages to Google GenAI schema
    const formattedContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini active chat error:", error);
    res.status(500).json({ error: error?.message || "Geminiでエラーが発生しました。" });
  }
});

// 2. API: Structured Lease Suitability Diagnostic & Recommendations
app.post("/api/diagnose", async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: "GoogleGenAI is not initialized.",
    });
  }

  const { companyProfile, equipmentDetails } = req.body;

  const prompt = `
以下の情報をもとに、日本の中中小企業（SME）の設備導入におけるリースファイナンスの「適合度診断」「審査準備のアドバイス」「税制優遇の適用可能性」を詳細に分析してください。

■ 企業プロフィール:
- 会社名/通称：${companyProfile.companyName || "未設定"}
- 業種：${companyProfile.industry}
- 設立年数：${companyProfile.yearsInBusiness}年
- 決算状況：${companyProfile.financialStatus}
- 資金（キャッシュ）の余裕度：${companyProfile.cashPosition}

■ 導入検討スケジュール & 設備詳細:
- 設備の種類：${equipmentDetails.type}
- 設備名称：${equipmentDetails.name || "未指定"}
- 想定総額（円）：${equipmentDetails.cost}円
- 耐用年数想定：${equipmentDetails.usefulLife}年
- 技術陳腐化（陳腐化が早いか、長く使えるか）：${equipmentDetails.isObsolescenceFast ? "陳腐化が非常に早い（IT機器など）" : "長く使える（工作機械・特殊な設備など）"}

出力形式は必ず、中小企業経営者がすぐに理解してアクションを起こせるように、以下の項目を含むマークダウンフォーマットで返してください。

1. **総合サマリー (リース適合度判定)**
   - リース、銀行融資、自己資金購入のどれが第1・第2推奨になるかの結論
   - 各手段の評価 (5つ星満点: ★★★★★)
2. **リースを組むメリット・デメリットの具体的解説**
   - 今回の設備特徴や企業の決算状況を踏まえた特記
3. **適用できる可能性のある優遇税制・補助金**
   - 中小企業投資促進税制、中小企業経営強化税制、ものづくり補助金などのうち、今回適用可能なものとその要件
4. **リース審査に向けた対策・必要書類チェックリスト**
   - 創業年数や決算状況を踏まえた、審査通過のアドバイス（連帯保証人の有無や準備する決算書の期間など）
5. **推奨されるリース期間と目安リース料率設計**
   - 適正なリース期間（一般的に耐用年数の70%〜120%など税法上の基準を盛り込む）と、日本の現在のリース市場を踏まえたおよそのリース料率(%)や月額リース料の適正目安（※「審査状況や市場動向で変動する」旨のみ注記）。
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    res.json({ diagnosis: response.text });
  } catch (error: any) {
    console.error("Gemini diagnosis error:", error);
    res.status(500).json({ error: error?.message || "診断エラーが発生しました。" });
  }
});

// 3. API: Document Template Generator (Liaison Sheet or Proposal Draft)
app.post("/api/generate-docs", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "GoogleGenAI is not initialized." });
  }

  const { docType, companyProfile, equipmentDetails, dataResults } = req.body;

  let docPrompt = "";
  if (docType === "proposal") {
    docPrompt = `
日本の一般的な中小企業向けに、社内で設備リース導入を説得するための「社内設備導入起案書（稟議書）の下書きテンプレート」をプロフェッショナルなビジネス日本語で作成してください。

■ 背景・データ:
- 企業名: ${companyProfile.companyName || "弊社"}
- 設備: ${equipmentDetails.name} (金額: ${IntegerToYen(equipmentDetails.cost)})
- リース料想定: 月額 ${IntegerToYen(dataResults?.monthlyLeaseFee || 0)} (期間: ${dataResults?.leaseTermYears || equipmentDetails.usefulLife}年、リース料率: ${dataResults?.leaseRateFactor || "適正値"}%)
- 目的: ${equipmentDetails.purpose || "業務効率化・経営力向上"}
- リースを選択する主な稟議メリット: 中小企業特例によるオフバランス経費処理、銀行融資枠の温存、動産総合保険付帯による災害リスクヘッジ、事務負担軽減。

構成：
1. 起案日・起案者・起案趣旨（宛先は代表取締役社長等）
2. 導入の目的と背景
3. リース導入と購入・融資の比較検証結果（なぜリースなのかの財務的理由）
4. 導入費用および契約内容の概要
5. 想定される財務効果・税制メリット（中小企業経営強化税制等の減税効果含む）
6. 稟議の決裁を仰ぐ文面
`;
  } else {
    docPrompt = `
リース会社に見積を依頼する際に、正確な条件を伝えて好条件（低いリース料率など）を引き出すための「リース見積依頼チェックシート 兼 仕様伝達書」をプロフェッショナルな日本語で作成してください。

■ 背景・データ:
- 企業名: ${companyProfile.companyName || "未設定"}
- 検討設備: ${equipmentDetails.type} (${equipmentDetails.name || "未指定"}, 金額想定: ${IntegerToYen(equipmentDetails.cost)})
- 要望リース期間: ${dataResults?.leaseTermYears || equipmentDetails.usefulLife}年
- 適用したい税制特例：中小企業投資促進税制または経営強化税制（リース証明書の発行を希望する旨を記載）
- 対象地域：${companyProfile.location || "日本国内"}

構成：
1. 見積依頼書の文面（リース会社の担当者向け）
2. 設備基本スペックと取得希望日
3. 希望リース条件（期間、支払サイクル、保守メンテナンス区分（メンテループ用等））
4. リース会社へ提供予定の審査必要書類一式
5. リース証明書（証明書A類型/B類型など）発行の要請について。
`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: docPrompt,
      config: {
        temperature: 0.4,
      },
    });
    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Gemini document generation error:", error);
    res.status(500).json({ error: error?.message || "文書生成エラーが発生しました。" });
  }
});

function IntegerToYen(num: number) {
  return new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }).format(num);
}

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
