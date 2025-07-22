import React, { useState } from 'react';
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';

// Main app layout with top navigation
const appStyles = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
});

// Top navigation styles
const topNavStyles = css({
  height: '56px',
  backgroundColor: token('color.background.brand.bold'),
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${token('space.300', '24px')}`,
  borderBottom: `1px solid ${token('color.border')}`,
  zIndex: 10,
});

const topNavBrandStyles = css({
  color: token('color.text.inverse'),
  fontSize: '18px',
  fontWeight: 600,
  marginRight: token('space.400', '32px'),
});

const topNavItemsStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: token('space.200', '16px'),
  flex: 1,
});

const topNavItemStyles = css({
  color: token('color.text.inverse'),
  backgroundColor: 'transparent',
  border: 'none',
  padding: token('space.150', '12px'),
  borderRadius: token('border.radius.100'),
  cursor: 'pointer',
  fontSize: '14px',
  textDecoration: 'none',
  
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const topNavUserAreaStyles = css({
  display: 'flex',
  alignItems: 'center',
  gap: token('space.200', '16px'),
  marginLeft: 'auto',
});

const avatarStyles = css({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: token('color.background.accent.blue.subtle'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: token('color.text.inverse'),
  fontSize: '14px',
  fontWeight: 600,
});

// Main content area with sidebar
const mainContentStyles = css({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
});

const sidebarStyles = css({
  width: '240px',
  backgroundColor: token('color.background.neutral.subtle'),
  borderRight: `1px solid ${token('color.border')}`,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: token('space.200', '16px'),
});

const navStyles = css({
  padding: token('space.200', '16px'),
  flex: 1,
});

const navItemStyles = css({
  display: 'block',
  width: '100%',
  padding: token('space.150', '12px'),
  marginBottom: token('space.050', '4px'),
  border: 'none',
  backgroundColor: 'transparent',
  color: token('color.text'),
  textAlign: 'left',
  cursor: 'pointer',
  borderRadius: token('border.radius.100'),
  textDecoration: 'none',
  
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered'),
  },
});

const activeNavItemStyles = css({
  backgroundColor: token('color.background.selected'),
  color: token('color.text.selected'),
  
  '&:hover': {
    backgroundColor: token('color.background.selected.hovered'),
  },
});

const contentStyles = css({
  flex: 1,
  padding: token('space.400', '32px'),
  backgroundColor: token('color.background.neutral'),
  overflow: 'auto',
});

const cardStyles = css({
  padding: token('space.300'),
  backgroundColor: token('color.background.neutral.subtle'),
  borderRadius: token('border.radius.200'),
  border: `1px solid ${token('color.border')}`,
});

const gridStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: token('space.300'),
  marginTop: token('space.400'),
});

const listStyles = css({
  listStyle: 'none',
  padding: 0,
});

const listItemStyles = css({
  padding: token('space.200'),
  borderBottom: `1px solid ${token('color.border')}`,
});

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState('home');
  const [selectedTopNavItem, setSelectedTopNavItem] = useState('projects');

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: '🏠' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'reports', label: 'Reports', icon: '📊' },
  ];

  const topNavItems = [
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'teams', label: 'Teams', icon: '👥' },
    { id: 'marketplace', label: 'Marketplace', icon: '🛒' },
  ];

  const renderContent = () => {
    switch (selectedItem) {
      case 'home':
        return (
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your admin dashboard. Here you can manage all aspects of your application.</p>
            <div css={css({
              display: 'flex',
              alignItems: 'center',
              gap: token('space.200'),
              marginBottom: token('space.400'),
              padding: token('space.200'),
              backgroundColor: token('color.background.accent.blue.subtle'),
              borderRadius: token('border.radius.200'),
              border: `1px solid ${token('color.border')}`,
            })}>
              <span css={css({ fontSize: '20px' })}>ℹ️</span>
              <div>
                <strong>Current Section:</strong> {topNavItems.find(item => item.id === selectedTopNavItem)?.label || 'Projects'}
              </div>
            </div>
            <div css={gridStyles}>
              <div css={cardStyles}>
                <h3>Total Users</h3>
                <p css={css({ fontSize: '24px', fontWeight: 600 })}>1,234</p>
              </div>
              <div css={cardStyles}>
                <h3>Active Sessions</h3>
                <p css={css({ fontSize: '24px', fontWeight: 600 })}>567</p>
              </div>
              <div css={cardStyles}>
                <h3>Active Projects</h3>
                <p css={css({ fontSize: '24px', fontWeight: 600 })}>23</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div>
            <h1>User Management</h1>
            <p>Manage users, roles, and permissions from this section.</p>
            <div css={css({ marginTop: token('space.400') })}>
              <h3>Recent Users</h3>
              <ul css={listStyles}>
                <li css={listItemStyles}>
                  John Doe - john@example.com - Project Manager
                </li>
                <li css={listItemStyles}>
                  Jane Smith - jane@example.com - Developer
                </li>
                <li css={listItemStyles}>
                  Bob Johnson - bob@example.com - Designer
                </li>
              </ul>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1>Settings</h1>
            <p>Configure application settings and preferences.</p>
            <div css={css({ marginTop: token('space.400') })}>
              <h3>Application Settings</h3>
              <div css={cardStyles}>
                <label css={css({ display: 'block', marginBottom: token('space.200') })}>
                  <input type="checkbox" css={css({ marginRight: token('space.100') })} />
                  Enable notifications
                </label>
                <label css={css({ display: 'block', marginBottom: token('space.200') })}>
                  <input type="checkbox" css={css({ marginRight: token('space.100') })} />
                  Auto-save changes
                </label>
                <label css={css({ display: 'block' })}>
                  <input type="checkbox" css={css({ marginRight: token('space.100') })} />
                  Dark mode
                </label>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div>
            <h1>Reports</h1>
            <p>View analytics and generate reports for {topNavItems.find(item => item.id === selectedTopNavItem)?.label}.</p>
            <div css={css({ marginTop: token('space.400') })}>
              <h3>Available Reports</h3>
              <ul css={listStyles}>
                <li css={css({ 
                  ...cardStyles,
                  marginBottom: token('space.200'),
                })}>
                  📈 User Activity Report
                </li>
                <li css={css({ 
                  ...cardStyles,
                  marginBottom: token('space.200'),
                })}>
                  💰 Revenue Report
                </li>
                <li css={css({ 
                  ...cardStyles,
                })}>
                  🔍 System Performance Report
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div css={appStyles}>
      {/* Top Navigation */}
      <nav css={topNavStyles}>
        <div css={topNavBrandStyles}>
          Admin MCP
        </div>
        <div css={topNavItemsStyles}>
          {topNavItems.map((item) => (
            <button
              key={item.id}
              css={[
                topNavItemStyles,
                selectedTopNavItem === item.id && css({
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  fontWeight: 600,
                })
              ]}
              onClick={() => setSelectedTopNavItem(item.id)}
            >
              <span css={css({ marginRight: token('space.075') })}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div css={topNavUserAreaStyles}>
          <button css={topNavItemStyles}>
            🔔
          </button>
          <button css={topNavItemStyles}>
            ❓
          </button>
          <div css={avatarStyles}>
            AF
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div css={mainContentStyles}>
        {/* Side Navigation */}
        <aside css={sidebarStyles}>
          <nav css={navStyles}>
            {navItems.map((item) => (
              <button
                key={item.id}
                css={[navItemStyles, selectedItem === item.id && activeNavItemStyles]}
                onClick={() => setSelectedItem(item.id)}
              >
                <span css={css({ marginRight: token('space.100') })}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main css={contentStyles}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
