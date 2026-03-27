import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, BarChart3, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/add', icon: Plus, label: '추가' },
    { path: '/analytics', icon: BarChart3, label: '분석' },
    { path: '/settings', icon: Settings, label: '설정' }
  ];

  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <Icon size={24} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;