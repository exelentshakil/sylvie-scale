/**
 * Million-Dollar Demo Cockpit Configuration Hub
 * Central Schema & Data Provider for Light-Speed Customization.
 *
 * Customized specifically for Sylvie: Fractional CTO for AI Startup
 */

export interface NavItem {
  id: string;
  label: string;
}

export interface MetricItem {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'neutral' | 'down';
  subtext: string;
  badge: string;
}

export interface TableRow {
  id: string;
  entityName: string;
  category: string;
  status: 'active' | 'verified' | 'queued' | 'flagged';
  latency: string;
  provider: string;
  updatedAt: string;
  payload: Record<string, unknown>;
}

export interface SiteConfig {
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  archetype: 'stripe' | 'linear' | 'notion' | 'lovable' | 'bloomberg' | 'apple';
  primaryNav: NavItem[];
  metrics: MetricItem[];
  workflow: {
    badge: string;
    title: string;
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    defaultInput: string;
    buttonLabel: string;
    sampleResponse: Record<string, unknown>;
  };
  table: {
    badge: string;
    title: string;
    description: string;
    columns: { key: string; label: string }[];
    rows: TableRow[];
  };
}

export const siteConfig: SiteConfig = {
  slug: 'sylvie-scale',
  name: 'Sylvie Scale',
  badge: 'v1.0 Fractional CTO Command',
  tagline: 'Strategic Engineering, AI Governance & SOC 2 Compliance Portal',
  description: 'Production-hardened Fractional CTO operations portal tracking Sylvie\'s SOC 2 compliance readiness, model integration evaluation, cloud security controls, and 12-month technical roadmap.',
  archetype: 'stripe',
  primaryNav: [
    { id: 'cockpit', label: 'Fractional CTO Command' },
    { id: 'compliance', label: 'SOC 2 Control Map' },
    { id: 'pipeline', label: 'Live AI Engine' },
  ],
  metrics: [
    {
      id: 'soc2',
      title: 'SOC 2 Readiness',
      value: '84% Complete',
      change: 'Gap Assessment Drafted',
      trend: 'up',
      subtext: 'Platform: Vanta or Drata',
      badge: 'Compliance Track',
    },
    {
      id: 'models',
      title: 'LLM Efficiency & Cost',
      value: 'P99 Latency: 112ms',
      change: 'Zero PII Leak Risk',
      trend: 'up',
      subtext: 'OpenAI and Gemini Failover',
      badge: 'AI Orchestration',
    },
    {
      id: 'devops',
      title: 'Engineering Process',
      value: '100% PR Review Rate',
      change: 'CI/CD Pipeline Online',
      trend: 'up',
      subtext: 'Deployments: <15s to Prod',
      badge: 'DevOps Rigor',
    },
  ],
  workflow: {
    badge: 'Step 1: Compliance Evaluator',
    title: 'Interactive SOC 2 Control & Compliance Policy Generator',
    description: 'Evaluate a security control, secret rotation policy, or AI guardrail strategy. Generate compliant SOC 2 policies and secure architectures instantly.',
    inputLabel: 'Describe a Security Control, AI Data Retention Policy, or Deployment Trigger',
    inputPlaceholder: 'Describe your secret storage, backup schedule, or AI data retention flow...',
    defaultInput: 'We route LLM inference through an inline gateway that tokenizes customer PII. All API keys live as encrypted secrets in Vercel. Database backups run hourly on AWS RDS.',
    buttonLabel: 'Evaluate Compliance Control',
    sampleResponse: {
      status: 'COMPLIANT_SOC2_READY',
      policy_category: 'AI Governance & Secrets Management',
      gap_assessment: 'Passed primary control guidelines. Excellent encryption at rest and transit.',
      recommended_remediation: [
        'Add automated weekly rotation for administrative API keys using Vercel Secret Sync',
        'Document the pre-inference PII tokenization pipeline in your SOC 2 Data Privacy Policy'
      ],
      compliance_telemetry: {
        framework: 'SOC 2 Type I (Common Criteria)',
        trust_services_criteria: 'Security, Confidentiality',
        auditor_readiness_score: '94%',
        automated_evidence_link: 'Vanta or Drata Integration Ready'
      }
    },
  },
  table: {
    badge: 'Technical Debt & Scalability Ledger',
    title: 'Cloud Setup & Codebase Liability Tracker',
    description: 'Blunt technical reviews of cloud setup, access controls, database indexes, and code reliability before scale.',
    columns: [
      { key: 'id', label: 'Control ID' },
      { key: 'entityName', label: 'Asset Name / System' },
      { key: 'category', label: 'Classification' },
      { key: 'status', label: 'Severity Status' },
      { key: 'latency', label: 'Action Taken / Remediation' },
      { key: 'action', label: 'Inspection' },
    ],
    rows: [
      {
        id: 'SEC-101',
        entityName: 'AWS RDS Production Postgres',
        category: 'Secrets Management',
        status: 'verified',
        latency: 'AWS Secrets Manager Rotation',
        provider: 'AWS Secrets Manager',
        updatedAt: 'Active audit',
        payload: {
          control_name: 'Database Access Secrets',
          findings: 'No hardcoded credentials. Vercel env integration verified.',
          vulnerability: 'None detected',
          remediation: 'Automated rotation enabled in AWS Secrets Manager',
          evidence_reference: 'SOC 2 CC6.3 (Access Controls)'
        },
      },
      {
        id: 'AI-202',
        entityName: 'OpenAI / Gemini Hybrid Pipeline',
        category: 'AI Data Privacy & Costs',
        status: 'active',
        latency: 'Inline PII Tokenizer Active',
        provider: 'Model Integration',
        updatedAt: 'Active audit',
        payload: {
          architecture: 'Direct fetch with dual-provider failover',
          pii_leak_risk: 'REDUCED (Inline prompt tokenization enabled)',
          cost_tracking: 'Configured budget limits at $450/month ceiling',
          hallucination_defense: 'Structured output schemas (Zod/Pydantic) enforced',
          data_retention_policy: 'Zero-retention APIs used for customer payload'
        },
      },
      {
        id: 'OPS-303',
        entityName: 'CI/CD & Deploy Pipelines',
        category: 'DevOps Process',
        status: 'verified',
        latency: 'GitHub Actions Protection',
        provider: 'GitHub Actions',
        updatedAt: 'Active audit',
        payload: {
          deploy_target: 'Vercel Staging & Production',
          branch_protection: 'Mandatory 1-peer code review enabled',
          automated_tests: 'Vitest unit tests & Playwright end-to-end active',
          release_strategy: 'Semantic versioning and automated rollback verified'
        },
      },
      {
        id: 'SEC-104',
        entityName: 'User Auth & Multi-Tenancy',
        category: 'Infrastructure Security',
        status: 'flagged',
        latency: 'RLS Migrations Required',
        provider: 'Supabase / Auth0',
        updatedAt: '2 hours ago',
        payload: {
          control_name: 'RLS (Row Level Security)',
          findings: '3 tables missing explicit tenant_id isolation check',
          vulnerability: 'Cross-tenant data exposure liability during scale',
          remediation: 'Add mandatory tenant_id checking RLS policy via migrations',
          status: 'Critical Fix Required Before Scaling'
        },
      },
      {
        id: 'COMP-505',
        entityName: 'Enterprise Security Questionnaire',
        category: 'Investor & Customer Support',
        status: 'queued',
        latency: 'Pre-filled with Vanta AI KB',
        provider: 'Compliance Platform',
        updatedAt: '4 hours ago',
        payload: {
          customer: 'Fortune 500 Financial Corp',
          questionnaire_length: '240 Security Questions',
          compliance_platform: 'Pre-filled using Vanta AI Knowledge Base',
          audit_trail: 'Fractional CTO review pending before submission'
        },
      },
    ],
  },
};
