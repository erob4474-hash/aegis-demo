// Simulated data for the Aegis DLP Console
// In production, this would be backed by the Rust agent API at http://127.0.0.1:3000

export const DEFAULT_POLICY = `REDACT all Social Security Numbers (NAS/SSN)
REDACT email addresses from all outbound prompts
REDACT credit card numbers in any format
REDACT API keys and long tokens
BLOCK prompts containing internal project codenames
LOG all interactions for compliance audit`

export type SeverityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"

export interface AuditLogEntry {
  id: string
  timestamp: string
  source: string
  piiType: string
  severity: SeverityLevel
  maskedData: string
  action: "Redacted" | "Blocked"
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
  activePolicyVersion: string
  protectedUsers: number
  systemLatencyMs: number
}

export interface ChartDataPoint {
  time: string
  interceptions: number
  blocked: number
}

export function generateChartData(): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = new Date()
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      interceptions: Math.floor(Math.random() * 45) + 5,
      blocked: Math.floor(Math.random() * 12) + 1,
    })
  }
  return data
}

export function generateAuditLogs(): AuditLogEntry[] {
  const sources = ["Chrome Extension v1.0", "Firefox Extension v0.9", "Edge Extension v1.0"]
  const destinations = ["ChatGPT", "Claude", "Perplexity", "Gemini", "Copilot"]
  const piiTypes: { type: string; severity: SeverityLevel }[] = [
    { type: "SSN/NAS", severity: "CRITICAL" },
    { type: "API Key", severity: "CRITICAL" },
    { type: "Email Address", severity: "HIGH" },
    { type: "Credit Card", severity: "CRITICAL" },
    { type: "Internal Codename", severity: "MEDIUM" },
    { type: "Phone Number", severity: "HIGH" },
    { type: "IP Address", severity: "MEDIUM" },
    { type: "AWS Secret", severity: "CRITICAL" },
  ]
  const maskedExamples: Record<string, string> = {
    "SSN/NAS": "***-**-****",
    "API Key": "sk-****...****",
    "Email Address": "***@***.com",
    "Credit Card": "****-****-****-****",
    "Internal Codename": "[PROJECT_REDACTED]",
    "Phone Number": "(***) ***-****",
    "IP Address": "***.***.***.***",
    "AWS Secret": "AKIA****...****",
  }

  const logs: AuditLogEntry[] = []
  const now = new Date()

  for (let i = 0; i < 50; i++) {
    const pii = piiTypes[Math.floor(Math.random() * piiTypes.length)]
    const minutesAgo = Math.floor(Math.random() * 1440)
    const ts = new Date(now.getTime() - minutesAgo * 60 * 1000)

    logs.push({
      id: `log-${i}`,
      timestamp: ts.toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)],
      piiType: pii.type,
      severity: pii.severity,
      maskedData: maskedExamples[pii.type],
      action: Math.random() > 0.2 ? "Redacted" : "Blocked",
      destination: destinations[Math.floor(Math.random() * destinations.length)],
    })
  }

  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export function generateActivityFeed(): ActivityEvent[] {
  const events: ActivityEvent[] = [
    {
      id: "e1",
      timestamp: new Date().toISOString(),
      message: "SSN detected and redacted in ChatGPT prompt",
      type: "critical",
    },
    {
      id: "e2",
      timestamp: new Date(Date.now() - 30000).toISOString(),
      message: "Policy v2.4 deployed successfully",
      type: "success",
    },
    {
      id: "e3",
      timestamp: new Date(Date.now() - 95000).toISOString(),
      message: "API key pattern intercepted for Claude",
      type: "warning",
    },
    {
      id: "e4",
      timestamp: new Date(Date.now() - 180000).toISOString(),
      message: "New extension connected: Edge Extension v1.0",
      type: "info",
    },
    {
      id: "e5",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      message: "Email address redacted in Perplexity prompt",
      type: "warning",
    },
    {
      id: "e6",
      timestamp: new Date(Date.now() - 420000).toISOString(),
      message: "Credit card number blocked from Gemini",
      type: "critical",
    },
    {
      id: "e7",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      message: "Internal codename detected and redacted",
      type: "warning",
    },
    {
      id: "e8",
      timestamp: new Date(Date.now() - 780000).toISOString(),
      message: "Agent health check passed: 3ms latency",
      type: "success",
    },
  ]
  return events
}

export function getKPIData(): KPIData {
  return {
    totalInterceptions: 1247,
    activePolicyVersion: "v2.4",
    protectedUsers: 38,
    systemLatencyMs: 3,
  }
}

export interface PiiBreakdown {
  name: string
  value: number
  fill: string
}

export function getPiiBreakdown(): PiiBreakdown[] {
  return [
    { name: "SSN/NAS", value: 42, fill: "hsl(var(--chart-4))" },
    { name: "API Keys", value: 23, fill: "hsl(var(--chart-1))" },
    { name: "Emails", value: 18, fill: "hsl(var(--chart-3))" },
    { name: "Credit Cards", value: 11, fill: "hsl(var(--chart-5))" },
    { name: "Other", value: 6, fill: "hsl(var(--chart-2))" },
  ]
}
