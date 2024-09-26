import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilFile, cilFolderOpen, cilHome } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'File',
    to: '/file',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'File Dashboard',
    to: '/file/dashboard',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Folder',
    to: '/folder',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Folder Dashboard',
    to: '/folder/dashboard',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  }
]

export default _nav
