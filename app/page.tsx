"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Shield } from "lucide-react"
import { SidebarNav, type TabId } from "@/components/sidebar-nav"
import { KPICards } from "@/components/kpi-cards"
import { ActivityChart } from "@/components/activity-chart"
import { PiiBreakdownChart } from "@/components/pii-breakdown"
import { LiveFeed } from "@/components/live-feed"
import { PolicyEditor } from "@/components/policy-editor"
import { AuditLogTable } from "@/components/audit-log-table"
import { SystemHealth } from "@/components/system-health"
import {
  DEFAULT_POLICY,
  generateChartData,
  generateAuditLogs,
  generateActivityFeed,
  getKPIData,
  getPiiBreakdown,
} from "@/lib/aegis-store"

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function AegisDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview")
  const [policy, setPolicy] = useState(DEFAULT_POLICY)

  // Generate data once with useMemo
  const chartData = useMemo(() => generateChartData(), [])
  const auditLogs = useMemo(() => generateAuditLogs(), [])
  const activityFeed = useMemo(() => generateActivityFeed(), [])
  const kpiData = useMemo(() => getKPIData(), [])
  const piiBreakdown = useMemo(() => getPiiBreakdown(), [])

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 border-b border-border/50 bg-card px-4 py-3 lg:hidden">
        <div className="rounded-lg bg-primary/15 p-1.5">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <h1 className="text-sm font-bold tracking-tight text-foreground">
          Aegis
        </h1>
        <span className="text-[10px] text-muted-foreground">
          DLP Mission Control
        </span>
      </div>

      {/* Sidebar */}
      <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 lg:p-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* Page header */}
                <div className="mb-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    Dashboard
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Real-time DLP monitoring and analytics
                  </p>
                </div>

                {/* KPIs */}
                <KPICards data={kpiData} />

                {/* Charts row */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <ActivityChart data={chartData} />
                  </div>
                  <PiiBreakdownChart data={piiBreakdown} />
                </div>

                {/* Live feed */}
                <LiveFeed events={activityFeed} />
              </motion.div>
            )}

            {activeTab === "policy" && (
              <motion.div
                key="policy"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                <div className="mb-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    Policy Engine
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Edit and deploy DLP rules to the Rust agent
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <PolicyEditor
                      policy={policy}
                      onPolicyChange={setPolicy}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    {/* Quick reference */}
                    <div className="glass-panel rounded-xl p-5">
                      <h3 className="mb-3 text-sm font-medium text-foreground">
                        Rule Syntax
                      </h3>
                      <div className="space-y-2 text-xs">
                        {[
                          {
                            cmd: "REDACT",
                            desc: "Mask matching PII patterns",
                            color: "text-success",
                          },
                          {
                            cmd: "BLOCK",
                            desc: "Prevent prompt from sending",
                            color: "text-critical",
                          },
                          {
                            cmd: "LOG",
                            desc: "Record for compliance audit",
                            color: "text-primary",
                          },
                        ].map((r) => (
                          <div
                            key={r.cmd}
                            className="flex items-start gap-2 rounded-lg bg-secondary/40 p-2.5"
                          >
                            <code
                              className={`font-mono font-semibold ${r.color}`}
                            >
                              {r.cmd}
                            </code>
                            <span className="text-muted-foreground">
                              {r.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active rules count */}
                    <div className="glass-panel rounded-xl p-5">
                      <h3 className="mb-1 text-sm font-medium text-foreground">
                        Active Rules
                      </h3>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          {policy.split("\n").filter((l) => l.trim()).length}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          rules configured
                        </span>
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>REDACT rules</span>
                          <span className="font-mono text-success">
                            {
                              policy
                                .split("\n")
                                .filter((l) =>
                                  l.trim().startsWith("REDACT")
                                ).length
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>BLOCK rules</span>
                          <span className="font-mono text-critical">
                            {
                              policy
                                .split("\n")
                                .filter((l) =>
                                  l.trim().startsWith("BLOCK")
                                ).length
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>LOG rules</span>
                          <span className="font-mono text-primary">
                            {
                              policy
                                .split("\n")
                                .filter((l) =>
                                  l.trim().startsWith("LOG")
                                ).length
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "audit" && (
              <motion.div
                key="audit"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                <div className="mb-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    Audit Logs
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Complete history of PII interceptions and blocked prompts
                  </p>
                </div>

                <AuditLogTable logs={auditLogs} />
              </motion.div>
            )}

            {activeTab === "health" && (
              <motion.div
                key="health"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                <div className="mb-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    System Health
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Agent telemetry and connected extensions
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <SystemHealth />
                  <LiveFeed events={activityFeed} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
