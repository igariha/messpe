import React, { useState } from 'react'
import { ArrowLeftRight, Play, Terminal } from 'lucide-react'
import {
  Badge,
  Card,
  SectionHeader,
  SimulationNotice,
} from '../components/ui'
import { AI_AGENTS_DATA } from '../data/mockData'
import type { AgentId } from '../types/messpe'

export const AIAgentsPage: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('menu-agent')
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0)
  const [simulationLog, setSimulationLog] = useState<
    {
      agent: string
      channel: string
      input: string
      output: string
      orchestratorMessage: string
      timestamp: string
    }[]
  >([
    {
      agent: 'Student Feedback Agent',
      channel: 'messpe.orchestrator/feedback-nlp',
      input:
        'Batch of 4 dinner reviews mentioning "chapati queue", "slow between 8:15-8:35 PM".',
      output:
        'Cluster Detected: Service / Peak Flow Bottleneck. Auto-drafted Admin Recommendation: Open second chapati warmer at Counter 2.',
      orchestratorMessage:
        '[Feedback Agent -> Admin Panel] Created High-Priority operational recommendation #ar-2.',
      timestamp: 'Today · 09:42 AM',
    },
  ])

  const activeAgent =
    AI_AGENTS_DATA.find((a) => a.id === selectedAgentId) ?? AI_AGENTS_DATA[0]

  const currentScenario =
    activeAgent.sampleScenarios[selectedScenarioIdx] ??
    activeAgent.sampleScenarios[0]

  const handleSelectAgent = (id: AgentId) => {
    setSelectedAgentId(id)
    setSelectedScenarioIdx(0)
  }

  const handleRunSimulation = () => {
    setSimulationLog((prev) => [
      {
        agent: activeAgent.name,
        channel: activeAgent.centralChannel,
        input: currentScenario.input,
        output: currentScenario.output,
        orchestratorMessage: currentScenario.orchestratorMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      },
      ...prev.slice(0, 4),
    ])
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Multi-Agent System"
        title="Five Specialized AI Agents Behind Messpe"
        subtitle="Inspect how Messpe decomposes hostel mess operations into five focused agents that exchange structured signals through a central orchestrator."
      />

      <SimulationNotice label="Simulated AI Demonstration" tone="sage">
        This page demonstrates Messpe&apos;s multi-agent workflow using{' '}
        <strong>local deterministic simulations</strong>. No external LLM APIs,
        keys, or cloud inference calls are required during presentation.
      </SimulationNotice>

      {/* Architecture Overview: Central Messpe System Communication */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-lg font-medium text-[#252822]">
              Central System Communication Architecture
            </h2>
            <p className="text-xs text-[#5A5E54]">
              Click any agent node to inspect its input/output contract and run a
              live scenario.
            </p>
          </div>
          <Badge tone="forest">Event-Driven State Bus (Simulated)</Badge>
        </div>

        {/* Clean Structural Hub-and-Spoke Diagram */}
        <div className="p-4 sm:p-5 rounded bg-[#FAF9F5] border border-[#E2DFD5] space-y-4">
          {/* Central Orchestrator Bar */}
          <div className="p-3.5 rounded bg-[#254C3A] text-[#F7F5EF] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[#DCE5D9]">
                Core Coordination Layer
              </div>
              <div className="text-sm font-semibold">
                Central Messpe Orchestrator &amp; Shared State Store
              </div>
            </div>
            <div className="text-[11px] text-[#DCE5D9] tabular-nums">
              Syncs: Weekly Menu · Quality Logs · Feedback Queue · Waste
              Forecasts · Admin Panel
            </div>
          </div>

          {/* 5 Agent Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {AI_AGENTS_DATA.map((agent, index) => {
              const selected = agent.id === selectedAgentId
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => handleSelectAgent(agent.id)}
                  className={`text-left p-3 rounded border transition-colors cursor-pointer flex flex-col justify-between gap-2.5 ${
                    selected
                      ? 'bg-[#ECF1EA] border-[#254C3A] ring-1 ring-[#254C3A]'
                      : 'bg-white border-[#E2DFD5] hover:border-[#254C3A]/45'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[10px] font-semibold text-[#6B6F64] mb-1">
                      <span>AGENT 0{index + 1}</span>
                      <span className="w-2 h-2 rounded-full bg-[#254C3A]" />
                    </div>
                    <div className="text-xs font-semibold text-[#252822] leading-snug">
                      {agent.name}
                    </div>
                    <div className="text-[11px] text-[#5A5E54] mt-1">
                      {agent.shortRole}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#EFECE3] flex items-center gap-1 text-[10px] text-[#254C3A] font-medium truncate">
                    <ArrowLeftRight className="w-3 h-3 shrink-0" />
                    <span className="truncate">
                      {agent.centralChannel.split('/')[1]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Selected Agent Deep Dive & Interactive Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Agent Specification */}
        <Card className="lg:col-span-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#254C3A]">
                Agent Specification
              </div>
              <h2 className="font-serif text-xl font-medium text-[#252822] mt-0.5">
                {activeAgent.name}
              </h2>
            </div>
            <Badge tone="sage">{activeAgent.status}</Badge>
          </div>

          <p className="text-xs text-[#5A5E54] leading-relaxed">
            {activeAgent.responsibility}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded bg-[#FAF9F5] border border-[#E2DFD5]">
              <div className="text-[10px] uppercase text-[#7D8176]">
                System Channel
              </div>
              <div className="font-mono text-[11px] text-[#252822] mt-0.5 truncate">
                {activeAgent.centralChannel}
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#FAF9F5] border border-[#E2DFD5]">
              <div className="text-[10px] uppercase text-[#7D8176]">
                Last Heartbeat
              </div>
              <div className="text-xs font-medium text-[#252822] mt-0.5">
                {activeAgent.lastRun}
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-[#EFECE3]">
            <div className="text-xs font-semibold text-[#252822]">
              Baseline Input / Output Contract
            </div>
            <div className="p-3 rounded bg-[#FAF9F5] border border-[#E2DFD5] text-xs space-y-1">
              <div className="text-[10px] font-semibold uppercase text-[#7D8176]">
                Example Input
              </div>
              <p className="text-[#252822]">{activeAgent.exampleInput}</p>
            </div>
            <div className="p-3 rounded bg-[#ECF1EA]/70 border border-[#C7D5C3] text-xs space-y-1">
              <div className="text-[10px] font-semibold uppercase text-[#254C3A]">
                Example Output
              </div>
              <p className="text-[#252822]">{activeAgent.exampleOutput}</p>
            </div>
          </div>
        </Card>

        {/* Interactive Scenario Simulator */}
        <Card className="lg:col-span-6 flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-medium text-[#252822]">
                  Interactive Agent Scenario Runner
                </h2>
                <p className="text-xs text-[#5A5E54]">
                  Trigger a simulated message cycle with the Central Messpe
                  System
                </p>
              </div>
              <Terminal className="w-4 h-4 text-[#254C3A]" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeAgent.sampleScenarios.map((sc, idx) => (
                <button
                  key={sc.label}
                  type="button"
                  onClick={() => setSelectedScenarioIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                    selectedScenarioIdx === idx
                      ? 'bg-[#254C3A] text-[#F7F5EF] border-[#254C3A]'
                      : 'bg-[#FAF9F5] text-[#5A5E54] border-[#E2DFD5] hover:border-[#254C3A]/40'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            <div className="p-3 rounded bg-[#FAF9F5] border border-[#E2DFD5] text-xs space-y-1.5">
              <div className="text-[10px] font-semibold uppercase text-[#7D8176]">
                Scenario Payload
              </div>
              <p className="text-[#252822] leading-relaxed">
                {currentScenario.input}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRunSimulation}
              className="w-full py-2 text-xs font-medium bg-[#254C3A] hover:bg-[#1D3D2E] text-[#F7F5EF] rounded inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              Simulate {activeAgent.name} Execution
            </button>
          </div>

          {/* Live Orchestrator Message Feed */}
          <div className="space-y-2 pt-3 border-t border-[#EFECE3]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5A5E54]">
              Central Messpe Orchestrator Log
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {simulationLog.map((entry, idx) => (
                <div
                  key={`${entry.timestamp}-${idx}`}
                  className="p-3 rounded bg-[#252822] text-[#F7F5EF] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#DCE5D9]">
                    <span className="font-semibold">{entry.agent}</span>
                    <span className="tabular-nums">{entry.timestamp}</span>
                  </div>
                  <p className="text-[#EFECE3] leading-relaxed">
                    {entry.output}
                  </p>
                  <div className="pt-1 border-t border-[#3A3E35] font-mono text-[10px] text-[#A9C2B3]">
                    {entry.orchestratorMessage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Directory Table of All 5 Agents */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2DFD5]">
          <h2 className="font-serif text-lg font-medium text-[#252822]">
            Agent Responsibilities Matrix
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-[#E2DFD5] text-[11px] font-semibold uppercase tracking-wider text-[#5A5E54]">
                <th className="py-2.5 px-5">Agent</th>
                <th className="py-2.5 px-4">Responsibility</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-5">Central System Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE3] text-xs">
              {AI_AGENTS_DATA.map((a) => (
                <tr key={a.id} className="bg-white">
                  <td className="py-3 px-5 font-semibold text-[#252822] whitespace-nowrap">
                    {a.name}
                  </td>
                  <td className="py-3 px-4 text-[#5A5E54]">
                    {a.responsibility}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge tone="sage">{a.status}</Badge>
                  </td>
                  <td className="py-3 px-5 font-mono text-[11px] text-[#5A5E54] whitespace-nowrap">
                    {a.centralChannel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
