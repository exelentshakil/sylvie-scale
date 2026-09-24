/**
 * Dual-Provider AI Engine for Security Control & Compliance Evaluation
 * Zero-dependency native HTTP fetch implementation:
 * Primary: OpenAI gpt-4o-mini
 * Fallback: Google Gemini gemini-2.0-flash
 * Offline / Local: Deterministic Rule Engine
 */

import { scanAndSanitizePrompt } from './llm-firewall';

export type ComplianceCategory =
  | 'Access Control & IAM'
  | 'Data Encryption & Privacy'
  | 'Vulnerability & Secrets Management'
  | 'Disaster Recovery & Backups'
  | 'DevOps & CI/CD Security'
  | 'Security Questionnaires'
  | 'General Security Discussion'
  | 'Suspicious Activity / Potential Exploit';

export interface OpportunityAnalysisResult {
  category: ComplianceCategory;
  opportunityScore: number; // Represents auditor readiness score (1-10)
  switchingIntent: boolean; // Represents gap detected (true = gap exists)
  reasoning: string;
  suggestedResponse: string; // Represents generated remediation policy/steps
  provider: 'OPENAI' | 'GEMINI' | 'DETERMINISTIC_RULES';
  model: string;
  latencyMs: number;
  matchedKeywords: string[];
  firewallStatus: {
    passed: boolean;
    piiRedacted: boolean;
    riskScore: number;
  };
}

export interface ClassifyParams {
  title: string;
  content: string;
  platform: string;
  author: string;
  brandList?: string[];
  complaintKeywords?: string[];
  highIntentPhrases?: string[];
  promptTone?: string;
  simulatedOutage?: boolean; // For chaos testing
}

const DEFAULT_BRANDS = ['Vanta', 'Drata', 'AWS', 'RDS', 'Vercel', 'Supabase'];
const DEFAULT_COMPLAINTS = ['secret leak', 'no backup', 'missing RLS', 'unencrypted', 'hardcoded key', 'no MFA'];
const DEFAULT_HIGH_INTENT = ['audit gap', 'failed compliance', 'missing control', 'compliance bypass', 'unsecured api'];

export async function classifyOpportunity(params: ClassifyParams): Promise<OpportunityAnalysisResult> {
  const startTime = Date.now();

  const title = params.title || '';
  const content = params.content || '';
  const combinedText = `${title}\n${content}`;

  // 1. Run Firewall & Security Scan
  const firewall = scanAndSanitizePrompt(combinedText);

  // 2. Keyword Pre-Matching
  const brands = params.brandList || DEFAULT_BRANDS;
  const complaints = params.complaintKeywords || DEFAULT_COMPLAINTS;
  const highIntent = params.highIntentPhrases || DEFAULT_HIGH_INTENT;

  const matchedKeywords: string[] = [];
  const lowerText = combinedText.toLowerCase();

  for (const b of brands) {
    if (lowerText.includes(b.toLowerCase())) matchedKeywords.push(b);
  }
  for (const c of complaints) {
    if (lowerText.includes(c.toLowerCase())) matchedKeywords.push(c);
  }
  for (const h of highIntent) {
    if (lowerText.includes(h.toLowerCase())) matchedKeywords.push(h);
  }

  // 3. Provider Resolution: Check API Keys
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const canUseOpenAI = !!openAiKey && !params.simulatedOutage;
  const canUseGemini = !!geminiKey;

  const promptTone = params.promptTone || 'Professional, precise, constructive Fractional CTO audit voice';

  const systemInstructions = `You are a specialized security and SOC 2 compliance auditor agent acting as a Fractional CTO.
Your task is to analyze security controls, infrastructure setups, and database schemas.

Categories to classify into:
1. "Access Control & IAM" - User authentication, MFA, Row Level Security, role-based controls.
2. "Data Encryption & Privacy" - Encryption at rest or transit, PII redaction, HIPAA compliance.
3. "Vulnerability & Secrets Management" - AWS Secrets Manager, Vercel secrets, hardcoded credentials.
4. "Disaster Recovery & Backups" - Database backups, recovery schedules, multi-region failover.
5. "DevOps & CI/CD Security" - GitHub Actions, branch protection, code review policy, Vitest runs.
6. "Security Questionnaires" - Enterprise questionnaires, vendor evaluations.
7. "General Security Discussion" - Standard architectural setups.
8. "Suspicious Activity / Potential Exploit" - Prompt injections, OWASP LLM risk indicators.

Opportunity Score: 1 to 10 (representing Auditor Readiness Score, where 10 = perfectly compliant, 1 = serious liabilities).
Give low scores (1-4) to any configuration with hardcoded credentials, missing RLS, or missing backup procedures.

Switching Intent (Gap Detected): Set to true if there is a security vulnerability, compliance gap, or manual overhead that needs remediation.

Suggested Response Draft:
Write a precise remediation policy or list of concrete steps.
Tone: ${promptTone}.
Never sound corporate or vague. Give direct engineering advice.

Return ONLY a valid JSON object matching this exact schema:
{
  "category": "Vulnerability & Secrets Management",
  "opportunityScore": 4,
  "switchingIntent": true,
  "reasoning": "Database credentials are hardcoded in environment config without active key rotation.",
  "suggestedResponse": "Migrate database credentials to AWS Secrets Manager immediately. Set up an automated weekly rotation lambda and integrate secrets directly with Vercel environment variables."
}`;

  // 4. Try Primary: OpenAI gpt-4o-mini
  if (canUseOpenAI) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemInstructions },
            {
              role: 'user',
              content: `Platform: ${params.platform || 'Dashboard'}\nAuthor: ${params.author || 'System Operator'}\nPost Title: ${title}\nPost Body: ${firewall.sanitizedInput}`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
          max_tokens: 600,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.choices?.[0]?.message?.content;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return {
            category: parsed.category || 'Vulnerability & Secrets Management',
            opportunityScore: Math.min(10, Math.max(1, Number(parsed.opportunityScore) || 8)),
            switchingIntent: Boolean(parsed.switchingIntent),
            reasoning: parsed.reasoning || 'Evaluated via OpenAI gpt-4o-mini',
            suggestedResponse: parsed.suggestedResponse || '',
            provider: 'OPENAI',
            model: 'gpt-4o-mini',
            latencyMs: Date.now() - startTime,
            matchedKeywords,
            firewallStatus: {
              passed: firewall.passed,
              piiRedacted: firewall.piiRedacted,
              riskScore: firewall.riskScore,
            },
          };
        }
      }
    } catch (err) {
      console.warn('OpenAI classification failed, falling back to Gemini:', err);
    }
  }

  // 5. Try Secondary Fallback: Google Gemini 2.0 Flash
  if (canUseGemini) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemInstructions}\n\nPlatform: ${params.platform}\nAuthor: ${params.author}\nTitle: ${title}\nBody: ${firewall.sanitizedInput}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          return {
            category: parsed.category || 'Vulnerability & Secrets Management',
            opportunityScore: Math.min(10, Math.max(1, Number(parsed.opportunityScore) || 8)),
            switchingIntent: Boolean(parsed.switchingIntent),
            reasoning: parsed.reasoning || 'Evaluated via Google Gemini 2.0 Flash',
            suggestedResponse: parsed.suggestedResponse || '',
            provider: 'GEMINI',
            model: 'gemini-2.0-flash',
            latencyMs: Date.now() - startTime,
            matchedKeywords,
            firewallStatus: {
              passed: firewall.passed,
              piiRedacted: firewall.piiRedacted,
              riskScore: firewall.riskScore,
            },
          };
        }
      }
    } catch (err) {
      console.warn('Gemini classification failed, falling back to deterministic rules:', err);
    }
  }

  // 6. Deterministic Rule Engine Fallback (Instant & 100% reliable offline)
  const isHighIntent = matchedKeywords.some(k => highIntent.includes(k)) || lowerText.includes('failed') || lowerText.includes('missing') || lowerText.includes('vulnerability') || lowerText.includes('unsecured');
  const isSecurityConcern = lowerText.includes('leak') || lowerText.includes('hardcoded') || lowerText.includes('unencrypted') || lowerText.includes('exploit');
  const isComplianceRequest = lowerText.includes('soc') || lowerText.includes('audit') || lowerText.includes('vanta') || lowerText.includes('drata');

  let category: ComplianceCategory = 'General Security Discussion';
  let score = 8;
  let switchingIntent = false;

  if (isHighIntent) {
    category = 'Vulnerability & Secrets Management';
    score = 4;
    switchingIntent = true;
  } else if (isSecurityConcern) {
    category = 'Suspicious Activity / Potential Exploit';
    score = 2;
    switchingIntent = true;
  } else if (isComplianceRequest) {
    category = 'Security Questionnaires';
    score = 6;
    switchingIntent = true;
  } else if (matchedKeywords.length > 0) {
    category = 'Access Control & IAM';
    score = 7;
  }

  const defaultDraft = switchingIntent
    ? `Action Required: Map and evaluate security gaps immediately. Setup automated Secrets Management and MFA enforcement. Ensure all DB operations use Row Level Security.`
    : `Compliance check completed: Configuration aligns with SOC 2 Common Criteria guidelines. Ensure backup restoration tests are documented quarterly.`;

  return {
    category,
    opportunityScore: score,
    switchingIntent,
    reasoning: `Deterministic Rule Engine match: [${matchedKeywords.join(', ') || 'semantic security analysis'}] with ${switchingIntent ? 'vulnerability gap detected' : 'moderate readiness'}.`,
    suggestedResponse: defaultDraft,
    provider: 'DETERMINISTIC_RULES',
    model: 'rule-engine-v1',
    latencyMs: Date.now() - startTime,
    matchedKeywords,
    firewallStatus: {
      passed: firewall.passed,
      piiRedacted: firewall.piiRedacted,
      riskScore: firewall.riskScore,
    },
  };
}
