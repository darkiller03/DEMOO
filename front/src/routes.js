import { element, exact } from 'prop-types'
import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Vulnerabilities = React.lazy(() => import('./views/pages/vuln/Vulnerabilities'))
const VulnerabilitiesFolder = React.lazy(() => import('./views/pages/vuln/VulnerabilitiesFolder'))
// const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const Home = React.lazy(() => import('./views/pages/Home'))
const routes = [
  { path: '/', exact: true, name: 'Home', element: Home },
  { path: '/file/dashboard', exact: true, name: 'Dashboard', element: Dashboard },
  { path: '/folder/dashboard', name: 'DashboardFolder', element: Dashboard },
  { path: 'file/vulnerabilities/dashboard', name: 'Vulnerabilities', element: Vulnerabilities },
  {
    path: 'folder/vulnerabilities/dashboard',
    name: 'Vulnerabilities',
    element: VulnerabilitiesFolder,
  },
  // { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/vulnerabilities/*', name: 'Vulnerabilities', element: Vulnerabilities }, // Updated path
]

export default routes
