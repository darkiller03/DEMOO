import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Vulnerabilities = React.lazy(() => import('./views/pages/vuln/Vulnerabilities'))
const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  { path: '/vulnerabilities/*', name: 'Vulnerabilities', element: Vulnerabilities }, // Updated path
]

export default routes
