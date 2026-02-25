"use client"

import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import type { PiiBreakdown } from "@/lib/aegis-store"

interface PiiBreakdownChartProps {
  data: PiiBreakdown[]
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: PiiBreakdown }[]
}) {
  if (!active || !payload || !payload[0]) return null
  const d = payload[0].payload
  return (
    <div className="glass-panel rounded-lg p-3 text-sm">
      <p className="font-medium text-foreground">{d.name}</p>
      <p className="text-muted-foreground">{d.value}% of total</p>
    </div>
  )
}

export function PiiBreakdownChart({ data }: PiiBreakdownChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="glass-panel rounded-xl p-5"
    >
      <h3 className="mb-1 text-sm font-medium text-foreground">
        Risk Distribution
      </h3>
      <p className="mb-4 text-xs text-muted-foreground">
        PII types intercepted
      </p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="font-mono text-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
