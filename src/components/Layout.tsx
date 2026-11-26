import React, { useState } from 'react'
import {
  Activity,
  Bot,
  CalendarDays,
  LayoutDashboard,
  Leaf,
  Menu,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { useMesspe } from '../context/MesspeContext'
import type { PageId } from '../types/messpe'

interface NavItem {
  id: PageId
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}

const SidebarContent: React.FC<{
  activePage: PageId
  mainNav: NavItem[]
  adminNav: NavItem[]
  onNav: (id: PageId) => void
  onCloseMobile: () => void
  onResetDemoData: () => void
}> = ({
  activePage,
  mainNav,
  adminNav,
  onNav,
  onCloseMobile,
  onResetDemoData,
}) => (
  <div className="flex flex-col h-full bg-[#F7F5EF] border-r border-[#E2DFD5]">
    {/* Brand */}
    <div className="px-5 py-4 border-b border-[#E2DFD5] flex items-center justify-between">
      <button
        type="button"
        onClick={() => onNav('dashboard')}
        className="flex items-center gap-2.5 text-left cursor-pointer"
      >
        <div className="w-7 h-7 rounded bg-[#254C3A] flex items-center justify-center text-[#F7F5EF] font-serif text-base font-medium">
          M
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-tight text-[#252822] leading-none">
            Messpe
          </div>
          <div className="text-[11px] text-[#6B6F64] mt-0.5">
            Hostel Block B · Mess 02
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={onCloseMobile}
        className="lg:hidden p-1 text-[#5A5E54] hover:text-[#252822]"
        aria-label="Close navigation"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    {/* Nav Links */}
    <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
      <div>
        <p className="px-2.5 mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A8D82]">
          Dining Platform
        </p>
        <div className="space-y-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon
            const active = activePage === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNav(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[13px] transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#DCE5D9] text-[#254C3A] font-medium'
                    : 'text-[#4B4F46] hover:bg-[#EFECE3] hover:text-[#252822]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? 'text-[#254C3A]' : 'text-[#6B6F64]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded ${
                      active
                        ? 'bg-[#254C3A] text-[#F7F5EF]'
                        : 'bg-[#E8E5DC] text-[#5A5E54]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="px-2.5 mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A8D82]">
          Management
        </p>
        <div className="space-y-0.5">
          {adminNav.map((item) => {
            const Icon = item.icon
            const active = activePage === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNav(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-[13px] transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#254C3A] text-[#F7F5EF] font-medium'
                    : 'text-[#4B4F46] hover:bg-[#EFECE3] hover:text-[#252822]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? 'text-[#F7F5EF]' : 'text-[#6B6F64]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded ${
                      active
                        ? 'bg-[#C87859] text-white'
                        : 'bg-[#F7EAE4] text-[#9A4E33]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>

    {/* Footer */}
    <div className="p-3 border-t border-[#E2DFD5] space-y-2.5 bg-[#F3F0E7]">
      <div className="px-2 py-1.5 rounded bg-white border border-[#E2DFD5]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#252822]">
            {activePage === 'admin' ? 'R. Verma (Warden View)' : 'Aarav Sharma'}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#254C3A]" title="Online" />
        </div>
        <p className="text-[11px] text-[#6B6F64] mt-0.5">
          {activePage === 'admin'
            ? 'Mess Administration Console'
            : 'Roll 24CS108 · Veg Plan'}
        </p>
      </div>

      <button
        type="button"
        onClick={onResetDemoData}
        className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[#5A5E54] hover:text-[#252822] hover:bg-[#E8E4D8] rounded border border-[#DFDBD0] transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        Reset Prototype Data
      </button>
    </div>
  </div>
)

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    activePage,
    setActivePage,
    feedbackList,
    issueReports,
    adminRecommendations,
    resetDemoData,
  } = useMesspe()
  const [mobileOpen, setMobileOpen] = useState(false)

  const openIssuesCount = issueReports.filter(
    (i) => i.status !== 'Resolved'
  ).length
  const openFeedbackCount = feedbackList.filter(
    (f) => f.status !== 'Resolved'
  ).length
  const pendingRecs = adminRecommendations.filter(
    (r) => r.status === 'Pending'
  ).length

  const mainNav: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Smart Menu Planner', icon: CalendarDays },
    {
      id: 'quality',
      label: 'Food Quality & Hygiene',
      icon: ShieldCheck,
      badge: openIssuesCount > 0 ? openIssuesCount : undefined,
    },
    {
      id: 'feedback',
      label: 'Student Feedback',
      icon: MessageSquare,
      badge: openFeedbackCount > 0 ? openFeedbackCount : undefined,
    },
    { id: 'nutrition', label: 'Nutrition Tracker', icon: Activity },
    { id: 'waste', label: 'Waste Management', icon: Leaf },
    { id: 'agents', label: 'AI Agents', icon: Bot, badge: '5' },
  ]

  const adminNav: NavItem[] = [
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: SlidersHorizontal,
      badge: pendingRecs > 0 ? pendingRecs : undefined,
    },
  ]

  const pageTitleMap: Record<PageId, string> = {
    dashboard: 'Overview',
    menu: 'Smart Menu Planner',
    quality: 'Food Quality & Hygiene',
    feedback: 'Student Feedback',
    nutrition: 'Nutrition Tracker',
    waste: 'Waste Management',
    agents: 'AI Agents Architecture',
    admin: 'Mess Administration',
  }

  const handleNav = (id: PageId) => {
    setActivePage(id)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex bg-[#F7F5EF] text-[#252822]">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-[248px] shrink-0 sticky top-0 h-screen">
        <SidebarContent
          activePage={activePage}
          mainNav={mainNav}
          adminNav={adminNav}
          onNav={handleNav}
          onCloseMobile={() => setMobileOpen(false)}
          onResetDemoData={resetDemoData}
        />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#252822]/30"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-[264px] max-w-[85vw] h-full z-10">
            <SidebarContent
              activePage={activePage}
              mainNav={mainNav}
              adminNav={adminNav}
              onNav={handleNav}
              onCloseMobile={() => setMobileOpen(false)}
              onResetDemoData={resetDemoData}
            />
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Minimal Top Header */}
        <header className="sticky top-0 z-30 h-14 bg-[#F7F5EF] border-b border-[#E2DFD5] px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 text-[#252822] hover:bg-[#EFECE3] rounded"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-[#5A5E54] truncate">
              <span className="font-medium text-[#252822]">
                {pageTitleMap[activePage]}
              </span>
              <span className="text-[#C5C1B5] hidden sm:inline">/</span>
              <span className="hidden sm:inline text-[#6B6F64]">
                Thursday, 26 Nov · Lunch Service Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleNav('quality')}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#252822] bg-white border border-[#E2DFD5] hover:border-[#254C3A] rounded transition-colors cursor-pointer"
            >
              Report Quality Issue
            </button>
            <button
              type="button"
              onClick={() =>
                handleNav(activePage === 'admin' ? 'dashboard' : 'admin')
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                activePage === 'admin'
                  ? 'bg-[#DCE5D9] text-[#254C3A] border border-[#C7D5C3]'
                  : 'bg-[#254C3A] text-[#F7F5EF] hover:bg-[#1D3D2E]'
              }`}
            >
              {activePage === 'admin' ? 'Student View' : 'Admin Panel'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-[1240px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
