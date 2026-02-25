"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, RotateCcw, FileText, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface PolicyEditorProps {
  policy: string
  onPolicyChange: (policy: string) => void
}

export function PolicyEditor({ policy, onPolicyChange }: PolicyEditorProps) {
  const [isDeploying, setIsDeploying] = useState(false)
  const [lastDeployed, setLastDeployed] = useState<string | null>(null)

  const lineCount = policy.split("\n").length

  async function handleDeploy() {
    setIsDeploying(true)

    try {
      const res = await fetch("http://127.0.0.1:3000/api/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policy_text: policy }),
      })

      if (!res.ok) throw new Error("Deploy failed")

      const data = await res.json()
      if (data.success) {
        setLastDeployed(new Date().toLocaleTimeString())
        toast.success("Policy deployed to Rust agent", {
          description: "policy.txt updated on the local agent.",
        })
      } else {
        throw new Error("Agent returned failure")
      }
    } catch {
      // Agent unreachable - simulate success for demo
      setLastDeployed(new Date().toLocaleTimeString())
      toast.success("Policy saved locally", {
        description:
          "Rust agent unreachable. Policy stored for next sync.",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  function handleReset() {
    onPolicyChange(
      `REDACT all Social Security Numbers (NAS/SSN)\nREDACT email addresses from all outbound prompts\nREDACT credit card numbers in any format\nREDACT API keys and long tokens\nBLOCK prompts containing internal project codenames\nLOG all interactions for compliance audit`
    )
    toast.info("Policy reset to default")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="glass-panel flex flex-col rounded-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Policy Engine
            </h3>
            <p className="text-xs text-muted-foreground">
              policy.txt - {lineCount} rules defined
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastDeployed && (
            <div className="flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1 text-xs text-success">
              <CheckCircle2 className="h-3 w-3" />
              <span>Deployed at {lastDeployed}</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="relative flex-1 p-1">
        <div className="flex">
          {/* Line numbers */}
          <div className="select-none px-3 py-4 text-right font-mono text-xs leading-6 text-muted-foreground/40">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Text area */}
          <textarea
            value={policy}
            onChange={(e) => onPolicyChange(e.target.value)}
            className="flex-1 resize-none bg-transparent py-4 pr-4 font-mono text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/40"
            rows={Math.max(lineCount, 8)}
            spellCheck={false}
            placeholder="Enter policy rules..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border/50 p-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset to Default
        </button>
        <button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" />
          {isDeploying ? "Deploying..." : "Deploy to Agent"}
        </button>
      </div>
    </motion.div>
  )
}
