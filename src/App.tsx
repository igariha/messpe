import React from 'react'
import { Layout } from './components/Layout'
import { MesspeProvider, useMesspe } from './context/MesspeContext'
import { AdminPanelPage } from './pages/AdminPanelPage'
import { AIAgentsPage } from './pages/AIAgentsPage'
import { DashboardPage } from './pages/DashboardPage'
import { MenuPlannerPage } from './pages/MenuPlannerPage'
import { NutritionTrackerPage } from './pages/NutritionTrackerPage'
import { QualityHygienePage } from './pages/QualityHygienePage'
import { StudentFeedbackPage } from './pages/StudentFeedbackPage'
import { WasteManagementPage } from './pages/WasteManagementPage'

const PageRouter: React.FC = () => {
  const { activePage } = useMesspe()

  switch (activePage) {
    case 'dashboard':
      return <DashboardPage />
    case 'menu':
      return <MenuPlannerPage />
    case 'quality':
      return <QualityHygienePage />
    case 'feedback':
      return <StudentFeedbackPage />
    case 'nutrition':
      return <NutritionTrackerPage />
    case 'waste':
      return <WasteManagementPage />
    case 'agents':
      return <AIAgentsPage />
    case 'admin':
      return <AdminPanelPage />
    default:
      return <DashboardPage />
  }
}

export function App() {
  return (
    <MesspeProvider>
      <Layout>
        <PageRouter />
      </Layout>
    </MesspeProvider>
  )
}

export default App
