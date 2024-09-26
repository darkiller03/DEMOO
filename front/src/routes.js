import React from 'react'
import File from './views/pages/file/File' 
import Folder from './views/pages/folder/Folder' 
import FileDashboard from './views/pages/file/FileDashboard' 
import FolderDashboard from './views/pages/folder/FolderDashboard' 

const Home = React.lazy(() => import ('./views/home/Home'))


const routes = [
  { path: '/', exact: true, name: 'Home', element: Home }, 
  { path: '/file', name: 'File', element: File }, 
  { path: '/file/dashboard', name: 'File Dashboard', element: FileDashboard }, 
  { path: '/folder', name: 'Folder', element: Folder }, 
  { path: '/folder/dashboard', name: 'Folder Dashboard', element: FolderDashboard }, 
]

export default routes
