import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilStar } from '@coreui/icons';
import { CNavGroup, CNavItem } from '@coreui/react';

const _nav = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/',  // Update path to Home
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Vulnerabilities',
    to: '/vulnerabilities',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  },
];

export default _nav;
