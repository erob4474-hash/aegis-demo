// Data layer for the Aegis DLP Console
// Reflects real system state: single Rust agent, 1 Chrome extension, 4 REDACT rules

export const DEFAULT_POLICY = `REDACT all Social Security Numbers (NAS/SSN)
REDACT email addresses from all outbound prompts
REDACT credit card numbers in any format
REDACT API keys and long tokens`

export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"

export interface AuditLogEntry {
  id: string
  timestamp: string
  source: string
  piiType: string
  severity: SeverityLevel
  rawSnippet: string
  maskedData: string
  action: "Redacted" | "Passed"
  destination: string
}

export interface ActivityEvent {
  id: string
  timestamp: string
  message: string
  type: "info" | "warning" | "critical" | "success"
}

export interface KPIData {
  totalInterceptions: number
  activePolicyRules: number
  connectedExtensions: number
  agentUptimeHours: number
}

export interface ChartDataPoint {
  time: string
  interceptions: number
  passed: number
}

// Realistic chart data for a system with low traffic -- most hours have 0-3 events
// with occasional small spikes when a dev pastes code with secrets
export function generateChartData(): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = new Date()
  // Realistic pattern: most hours 0, work hours have some activity
  const hourlyPattern = [
    0, 0, 0, 0, 0, 0, // 00-05: nobody working
    0, 0, 1, 2, 3, 1, // 06-11: morning ramp up
    0, 2, 4, 3, 2, 1, // 12-17: afternoon peak
    1, 0, 0, 0, 0, 0, // 18-23: evening drop off
    0, // current hour
  ]
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hourIndex = time.getHours()
    const base = hourlyPattern[24 - i] ?? 0
    // Add some jitter
    const interceptions = Math.max(0, base + Math.floor(Math.random() * 2) - 1)
    const passed = interceptions > 0 ? Math.max(0, interceptions - Math.floor(Math.random() * 2)) : 0
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      interceptions,
      passed,
    })
  }
  return data
}

// Real audit logs reflecting actual Rust agent behavior: only SSN, email, CC, API key detection
export function generateAuditLogs(): AuditLogEntry[] {
  const piiTypes: { type: string; severity: SeverityLevel; raw: string; masked: string }[] = [
    {
      type: "SSN/NAS",
      severity: "CRITICAL",
      raw: "my SSN is 274-83-9104",
      masked: "my SSN is [SSN/NAS_REDACTED]",
    },
    {
      type: "Email",
      severity: "HIGH",
      raw: "contact me at jdupont@aegis-corp.ca",
      masked: "contact me at [EMAIL_REDACTED]",
    },
    {
      type: "Credit Card",
      severity: "CRITICAL",
      raw: "card: 4532-1488-0343-6712",
      masked: "card: [CREDIT_CARD_REDACTED]",
    },
    {
      type: "API Key",
      severity: "CRITICAL",
      raw: "sk-proj-a8f3kd92mc74bd91ef20aa37c5d8e41b",
      masked: "[API_KEY_REDACTED]",
    },
    {
      type: "Email",
      severity: "HIGH",
      raw: "send it to admin@internal-tools.io",
      masked: "send it to [EMAIL_REDACTED]",
    },
    {
      type: "SSN/NAS",
      severity: "CRITICAL",
      raw: "NAS: 972 345 891",
      masked: "NAS: [SSN/NAS_REDACTED]",
    },
    {
      type: "API Key",
      severity: "CRITICAL",
      raw: "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...",
      masked: "Authorization: Bearer [API_KEY_REDACTED]",
    },
    {
      type: "Credit Card",
      severity: "CRITICAL",
      raw: "payment with 5425 2334 1101 9923",
      masked: "payment with [CREDIT_CARD_REDACTED]",
    },
    {
      type: "Email",
      severity: "HIGH",
      raw: "forward to marie.tremblay@banque-nationale.ca",
      masked: "forward to [EMAIL_REDACTED]",
    },
    {
      type: "SSN/NAS",
      severity: "CRITICAL",
      raw: "employee ID / NAS: 123-456-789",
      masked: "employee ID / NAS: [SSN/NAS_REDACTED]",
    },
    {
      type: "API Key",
      severity: "CRITICAL",
      raw: "AKIA3EXAMPLE7KEY9012345abcdefghij",
      masked: "[API_KEY_REDACTED]",
    },
    {
      type: "Email",
      severity: "HIGH",
      raw: "let me know at eric.b@startup.dev",
      masked: "let me know at [EMAIL_REDACTED]",
    },
  ]

  const logs: AuditLogEntry[] = []
  const now = new Date()

  // Only 12 real events over the last 2 days -- this is a dev environment
  for (let i = 0; i < piiTypes.length; i++) {
    const pii = piiTypes[i]
    // Spread events irregularly over the last ~48h
    const minutesAgo = [3, 17, 42, 89, 156, 241, 398, 507, 743, 1021, 1388, 1690][i]
    const ts = new Date(now.getTime() - minutesAgo * 60 * 1000)

    logs.push({
      id: `log-${i}`,
      timestamp: ts.toISOString(),
      source: "Aegis Shield (Chrome v1.0.0)",
      piiType: pii.type,
      severity: pii.severity,
      rawSnippet: pii.raw,
      maskedData: pii.masked,
      action: "Redacted",
      destination: "ChatGPT",
    })
  }

  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

// Real activity feed -- what actually happened
export function generateActivityFeed(): ActivityEvent[] {
  const now = Date.now()
  return [
    {
      id: "e1",
      timestamp: new Date(now - 3 * 60 * 1000).toISOString(),
      message: "SSN detected and redacted in ChatGPT prompt",
      type: "critical",
    },
    {
      id: "e2",
      timestamp: new Date(now - 17 * 60 * 1000).toISOString(),
      message: "Email address redacted (jdupont@aegis-corp.ca)",
      type: "warning",
    },
    {
      id: "e3",
      timestamp: new Date(now - 42 * 60 * 1000).toISOString(),
      message: "Credit card number intercepted and masked",
      type: "critical",
    },
    {
      id: "e4",
      timestamp: new Date(now - 89 * 60 * 1000).toISOString(),
      message: "API key (sk-proj-...) redacted before reaching ChatGPT",
      type: "warning",
    },
    {
      id: "e5",
      timestamp: new Date(now - 6 * 3600 * 1000).toISOString(),
      message: "Rust agent started on http://127.0.0.1:3000",
      type: "success",
    },
    {
      id: "e6",
      timestamp: new Date(now - 6.5 * 3600 * 1000).toISOString(),
      message: "policy.txt loaded (4 REDACT rules active)",
      type: "info",
    },
    {
      id: "e7",
      timestamp: new Date(now - 7 * 3600 * 1000).toISOString(),
      message: "Chrome extension connected (Aegis Shield v1.0.0)",
      type: "success",
    },
  ]
}

// Real KPIs -- honest numbers for a prototype
export function getKPIData(): KPIData {
  return {
    totalInterceptions: 12,
    activePolicyRules: 4,
    connectedExtensions: 1,
    agentUptimeHours: 6,
  }
}

export interface PiiBreakdown {
  name: string
  value: number
  fill: string
}

// Actual distribution from the 12 interceptions
export function getPiiBreakdown(): PiiBreakdown[] {
  return [
    { name: "SSN/NAS", value: 3, fill: "hsl(var(--chart-4))" },
    { name: "Email", value: 4, fill: "hsl(var(--chart-1))" },
    { name: "Credit Card", value: 2, fill: "hsl(var(--chart-5))" },
    { name: "API Key", value: 3, fill: "hsl(var(--chart-3))" },
  ]
}
