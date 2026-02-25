"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react"
import type { AuditLogEntry, SeverityLevel } from "@/lib/aegis-store"
import { cn } from "@/lib/utils"

interface AuditLogTableProps {
  logs: AuditLogEntry[]
}

const severityConfig: Record<
  SeverityLevel,
  { label: string; className: string }
> = {
  CRITICAL: {
    label: "Critical",
    className: "bg-critical/15 text-critical border border-critical/20",
  },
  HIGH: {
    label: "High",
    className: "bg-chart-3/15 text-chart-3 border border-chart-3/20",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-primary/15 text-primary border border-primary/20",
  },
  LOW: {
    label: "Low",
    className: "bg-muted text-muted-foreground border border-border",
  },
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [search, setSearch] = useState("")
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | "ALL">(
    "ALL"
  )
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(0)
  const perPage = 10

  const filtered = logs
    .filter((log) => {
      if (severityFilter !== "ALL" && log.severity !== severityFilter)
        return false
      if (search) {
        const s = search.toLowerCase()
        return (
          log.piiType.toLowerCase().includes(s) ||
          log.destination.toLowerCase().includes(s) ||
          log.source.toLowerCase().includes(s)
        )
      }
      return true
    })
    .sort((a, b) => {
      const diff =
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      return sortDir === "desc" ? -diff : diff
    })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice(page * perPage, (page + 1) * perPage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="glass-panel rounded-xl"
    >
      {/* Table header bar */}
      <div className="flex flex-col gap-3 border-b border-border/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">Audit Logs</h3>
          <p className="text-xs text-muted-foreground">
            {filtered.length} entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              className="w-32 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          {/* Severity filter */}
          <div className="flex items-center gap-1 rounded-lg bg-secondary/60 px-2 py-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value as SeverityLevel | "ALL")
                setPage(0)
              }}
              className="cursor-pointer bg-transparent text-xs text-foreground outline-none"
            >
              <option value="ALL">All</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/50 text-left text-muted-foreground">
              <th className="px-5 py-3 font-medium">
                <button
                  onClick={() =>
                    setSortDir((d) => (d === "desc" ? "asc" : "desc"))
                  }
                  className="flex items-center gap-1 transition-colors hover:text-foreground"
                >
                  Timestamp
                  {sortDir === "desc" ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronUp className="h-3 w-3" />
                  )}
                </button>
              </th>
              <th className="px-5 py-3 font-medium">Severity</th>
              <th className="px-5 py-3 font-medium">PII Type</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">
                Masked Data
              </th>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="hidden px-5 py-3 font-medium lg:table-cell">
                Source
              </th>
              <th className="px-5 py-3 font-medium">Destination</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((log) => {
              const sev = severityConfig[log.severity]
              return (
                <tr
                  key={log.id}
                  className="border-b border-border/30 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-5 py-3 font-mono text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold",
                        sev.className
                      )}
                    >
                      {sev.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-foreground">{log.piiType}</td>
                  <td className="hidden px-5 py-3 font-mono text-muted-foreground md:table-cell">
                    {log.maskedData}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        log.action === "Blocked"
                          ? "text-critical"
                          : "text-success"
                      )}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                    {log.source}
                  </td>
                  <td className="px-5 py-3 text-foreground">
                    {log.destination}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 px-5 py-3">
          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-md bg-secondary/60 px-3 py-1 text-xs text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-md bg-secondary/60 px-3 py-1 text-xs text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
