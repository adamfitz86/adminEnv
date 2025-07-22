import React, { useState, KeyboardEvent, FormEvent, useEffect } from 'react';
import { css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import '@atlaskit/css-reset';

// Import Atlaskit components
import Button from '@atlaskit/button/new';
import Tabs, { Tab, TabList, TabPanel } from '@atlaskit/tabs';
import Textfield from '@atlaskit/textfield';
import DynamicTable from '@atlaskit/dynamic-table';
import ModalDialog, { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';

// Import Atlaskit icons
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import TrashIcon from '@atlaskit/icon/glyph/trash';
import EditIcon from '@atlaskit/icon/glyph/edit';

// Import Atlaskit logos
import { ConfluenceIcon } from '@atlaskit/logo';
import { JiraIcon } from '@atlaskit/logo';
import { BitbucketIcon } from '@atlaskit/logo';
import { TrelloIcon } from '@atlaskit/logo';

// Import navigation system components for top nav only
import { CreateButton, Search } from '@atlaskit/navigation-system/top-nav-items';

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
  backgroundColor: token('elevation.surface'),
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${token('space.300', '24px')}`,
  borderBottom: `1px solid ${token('color.border')}`,
  zIndex: 10,
  justifyContent: 'space-between', // Better space distribution
});

const topNavBrandStyles = css({
  color: token('color.text'),
  fontSize: '18px',
  fontWeight: 600,
  flex: '1 1 0',
  display: 'flex',
  justifyContent: 'flex-start',
  minWidth: '200px', // Ensure minimum space
});

const topNavMiddleStyles = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: token('space.200', '16px'),
  flex: '0 0 auto', // Don't grow or shrink, use natural size
  
  // Make the search component wider
  '& > * > *:first-child': {
    minWidth: '500px',
  },
});

const searchStyles = css({
  minWidth: '500px',
  width: '500px',
  
  // Target the search input directly
  '& input': {
    minWidth: '450px !important',
    width: '450px !important',
  },
  
  // Target any container elements
  '& > *': {
    minWidth: '500px',
    width: '500px',
  },
});

const createButtonStyles = css({
  flexShrink: 0,
  flexGrow: 0,
  width: 'auto',
  
  // Ensure the CreateButton doesn't stretch
  '& > *': {
    width: 'auto !important',
    minWidth: 'auto !important',
  },
});

const topNavUserAreaStyles = css({
  flex: '1 1 0',
  display: 'flex',
  alignItems: 'center',
  gap: token('space.200', '16px'),
  justifyContent: 'flex-end',
  minWidth: '200px', // Ensure minimum space
});

const avatarStyles = css({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: token('color.background.accent.blue.subtle'),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: token('color.text'),
  fontSize: '14px',
  fontWeight: 600,
});

// Main content area with sidebar
const mainLayoutStyles = css({
  display: 'flex',
  flex: 1,
  height: 'calc(100vh - 56px)', // Subtract top nav height
});

const sidebarStyles = css({
  width: '280px',
  backgroundColor: token('elevation.surface'),
  borderRight: `1px solid ${token('color.border')}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
});

const sidebarNavStyles = css({
  padding: token('space.200', '16px'),
  flex: 1,
});

const navItemStyles = css({
  display: 'block',
  width: '100%',
  padding: `${token('space.150', '12px')} ${token('space.200', '16px')}`,
  marginBottom: token('space.050', '4px'),
  border: 'none',
  backgroundColor: 'transparent',
  color: token('color.text'),
  fontSize: '14px',
  fontWeight: 500,
  textAlign: 'left',
  cursor: 'pointer',
  borderRadius: token('border.radius.100'),
  transition: 'background-color 0.2s ease',
  
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered'),
  },
  
  '&:active': {
    backgroundColor: token('color.background.neutral.subtle.pressed'),
  },
});

const activeNavItemStyles = css({
  backgroundColor: token('color.background.selected'),
  color: token('color.text.selected'),
  fontWeight: 600,
  
  '&:hover': {
    backgroundColor: token('color.background.selected.hovered'),
  },
});

const contentStyles = css({
  flex: 1,
  padding: token('space.400', '32px'),
  backgroundColor: token('elevation.surface'),
  overflow: 'auto',
});

const cardStyles = css({
  padding: token('space.300'),
  backgroundColor: token('elevation.surface.raised'),
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
  const [editingUrlId, setEditingUrlId] = useState<number | null>(null);
  const [selectedSiteForEdit, setSelectedSiteForEdit] = useState<number | null>(null);
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);
  const [siteIndexToRevert, setSiteIndexToRevert] = useState<number | null>(null);
  const [defaultUrls, setDefaultUrls] = useState([
    'https://api.github.com',
    'https://api.atlassian.com',
    'https://jsonplaceholder.typicode.com',
    'https://httpbin.org',
    'https://api.openweathermap.org',
    'https://api.stripe.com',
    'https://api.twilio.com',
    'https://api.slack.com',
    'https://graph.microsoft.com',
    'https://api.dropbox.com',
    'https://api.spotify.com',
    'https://api.twitter.com',
    'https://api.linkedin.com',
    'https://api.facebook.com',
    'https://api.instagram.com',
    'https://api.youtube.com',
    'https://api.google.com',
    'https://api.amazon.com',
    'https://api.salesforce.com',
    'https://api.hubspot.com'
  ]);

  // Site-specific URL lists for each site
  const [siteUrls, setSiteUrls] = useState<{[key: number]: string[]}>({
    0: [...defaultUrls],
    1: [...defaultUrls],
    2: [...defaultUrls],
    3: [...defaultUrls],
  });

  const [editingSiteUrlId, setEditingSiteUrlId] = useState<number | null>(null);

  const [siteLists, setSiteLists] = useState([
    {
      name: 'Production Site',
      url: 'prod.example.com',
      servers: 3,
      status: 'Active',
      product: 'confluence'
    },
    {
      name: 'Staging Site', 
      url: 'staging.example.com',
      servers: 2,
      status: 'Active',
      product: 'jira'
    },
    {
      name: 'Development Site',
      url: 'dev.example.com', 
      servers: 1,
      status: 'Active',
      product: 'bitbucket'
    },
    {
      name: 'Testing Site',
      url: 'test.example.com',
      servers: 2,
      status: 'Inactive',
      product: 'trello'
    }
  ]);

  const [siteStatusOverrides, setSiteStatusOverrides] = useState<{[key:number]: 'inherited'|'custom'}>({});

  // Debug modal state changes
  useEffect(() => {
    console.log('Modal state changed - isRevertModalOpen:', isRevertModalOpen);
  }, [isRevertModalOpen]);

  // Helper function to get the appropriate logo for each product
  const getProductLogo = (product: string) => {
    switch (product) {
      case 'confluence':
        return <ConfluenceIcon appearance="brand" size="small" />;
      case 'jira':
        return <JiraIcon appearance="brand" size="small" />;
      case 'bitbucket':
        return <BitbucketIcon appearance="brand" size="small" />;
      case 'trello':
        return <TrelloIcon appearance="brand" size="small" />;
      default:
        return <ConfluenceIcon appearance="brand" size="small" />;
    }
  };

  const handleUrlClick = (index: number) => {
    setEditingUrlId(index);
  };

  const handleUrlChange = (index: number, newValue: string) => {
    const updatedUrls = [...defaultUrls];
    updatedUrls[index] = newValue;
    setDefaultUrls(updatedUrls);
  };

  const handleUrlSave = () => {
    setEditingUrlId(null);
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUrlSave();
    }
    if (e.key === 'Escape') {
      setEditingUrlId(null);
    }
  };

  const handleTextfieldChange = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const target = e.target as HTMLInputElement;
    handleUrlChange(index, target.value);
  };

  const handleAddUrl = () => {
    const newUrls = [...defaultUrls, ''];
    setDefaultUrls(newUrls);
    setEditingUrlId(newUrls.length - 1);
  };

  const handleDeleteUrl = (index: number) => {
    const newUrls = defaultUrls.filter((_, i) => i !== index);
    setDefaultUrls(newUrls);
    // If we were editing the deleted row, clear the editing state
    if (editingUrlId === index) {
      setEditingUrlId(null);
    }
    // If we were editing a row after the deleted one, adjust the index
    if (editingUrlId !== null && editingUrlId > index) {
      setEditingUrlId(editingUrlId - 1);
    }
  };

  // Site list handler for navigation
  const handleEditSite = (index: number) => {
    setSelectedSiteForEdit(index);
    setSelectedItem('site-edit');
  };

  const handleBackToMCPSettings = () => {
    setSelectedSiteForEdit(null);
    setSelectedItem('mcp-settings');
    // Set the tab to Site Overrides when returning
    setTimeout(() => {
      const tabs = document.querySelectorAll('[role="tab"]');
      if (tabs && tabs.length > 1) {
        (tabs[1] as HTMLElement).click();
      }
    }, 0);
  };

  const handleAddSite = () => {
    const newSite = {
      name: '',
      url: '',
      servers: 0,
      status: 'Active',
      product: 'confluence'
    };
    const newSites = [...siteLists, newSite];
    setSiteLists(newSites);
  };

  // Site-specific URL handlers
  const handleSiteUrlClick = (siteIndex: number, urlIndex: number) => {
    setEditingSiteUrlId(siteIndex * 1000 + urlIndex); // Use unique ID for each site+url combo
  };

  const handleSiteUrlChange = (siteIndex: number, urlIndex: number, newValue: string) => {
    const updatedSiteUrls = { ...siteUrls };
    if (!updatedSiteUrls[siteIndex]) {
      updatedSiteUrls[siteIndex] = [];
    }
    updatedSiteUrls[siteIndex] = [...updatedSiteUrls[siteIndex]];
    updatedSiteUrls[siteIndex][urlIndex] = newValue;
    setSiteUrls(updatedSiteUrls);
  };

  const handleSiteUrlSave = () => {
    setEditingSiteUrlId(null);
  };

  const handleSiteUrlKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditingSiteUrlId(null);
    } else if (e.key === 'Escape') {
      setEditingSiteUrlId(null);
    }
  };

  const handleSiteTextfieldChange = (siteIndex: number, urlIndex: number) => (e: FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    handleSiteUrlChange(siteIndex, urlIndex, target.value);
  };

  const handleAddSiteUrl = (siteIndex: number) => {
    const updatedSiteUrls = { ...siteUrls };
    if (!updatedSiteUrls[siteIndex]) {
      updatedSiteUrls[siteIndex] = [];
    }
    const newUrls = [...updatedSiteUrls[siteIndex], 'https://'];
    updatedSiteUrls[siteIndex] = newUrls;
    setSiteUrls(updatedSiteUrls);
    // Set editing mode for the new URL
    setEditingSiteUrlId(siteIndex * 1000 + (newUrls.length - 1));
  };

  const handleDeleteSiteUrl = (siteIndex: number, urlIndex: number) => {
    const updatedSiteUrls = { ...siteUrls };
    if (updatedSiteUrls[siteIndex]) {
      updatedSiteUrls[siteIndex] = updatedSiteUrls[siteIndex].filter((_, i) => i !== urlIndex);
      setSiteUrls(updatedSiteUrls);
    }
  };

  const handleRevertToOrgDefaults = (siteIndex: number) => {
    setSiteIndexToRevert(siteIndex);
    setIsRevertModalOpen(true);
  };

  const handleConfirmRevert = () => {
    if (siteIndexToRevert !== null) {
      const updatedSiteUrls = { ...siteUrls };
      updatedSiteUrls[siteIndexToRevert] = [...defaultUrls];
      setSiteUrls(updatedSiteUrls);
    }
    setIsRevertModalOpen(false);
    setSiteIndexToRevert(null);
  };

  const handleCancelRevert = () => {
    setIsRevertModalOpen(false);
    setSiteIndexToRevert(null);
  };

  // Helper to check if a site is inherited from org
  const isSiteInherited = (siteIndex: number) => {
    const siteUrlsForIndex = siteUrls[siteIndex] || [];
    return (
      siteUrlsForIndex.length === defaultUrls.length &&
      siteUrlsForIndex.every((url, i) => url === defaultUrls[i])
    );
  };

  // Update all inherited site lists when org allow list changes
  useEffect(() => {
    setSiteUrls((prevSiteUrls) => {
      const updated: {[key: number]: string[]} = { ...prevSiteUrls };
      Object.keys(updated).forEach((key) => {
        const idx = Number(key);
        const urls = prevSiteUrls[idx] || [];
        // Only update if the site is currently inherited from org (matches the previous org list exactly)
        if (
          urls.length === prevSiteUrls[0].length &&
          urls.every((url, i) => url === prevSiteUrls[0][i])
        ) {
          updated[idx] = [...defaultUrls];
        }
      });
      return updated;
    });
  }, [defaultUrls]);

  const navItems = [
    { id: 'home', label: 'Dashboard' },
    { id: 'users', label: 'Users' },
    { id: 'mcp-settings', label: 'MCP Server Settings' },
    { id: 'settings', label: 'Settings' },
    { id: 'reports', label: 'Reports' },
  ];

  const renderContent = () => {
    switch (selectedItem) {
      case 'home':
        return (
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your admin dashboard. Here you can manage all aspects of your application.</p>
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
      case 'mcp-settings':
        return (
          <div>
            <h1>MCP Server Settings</h1>
            <p>Configure and manage Model Context Protocol server settings and connections.</p>
            <div css={css({ marginTop: token('space.400') })}>
              <Tabs id="mcp-settings-tabs" defaultSelected={selectedSiteForEdit !== null ? 1 : 0}>
                <TabList>
                  <Tab>Org allow list</Tab>
                  <Tab>Site Overrides</Tab>
                </TabList>
                <TabPanel>
                  <div css={css({ marginTop: token('space.300') })}>
                    <div css={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' })}>
                      <div>
                        <h4 css={css({ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', margin: 0 })}>Org allow list</h4>
                        <p css={css({ margin: 0, marginTop: '12px' })}>Below is the list of allowed sites set by default in your organisation.</p>
                      </div>
                      <Button appearance="default" onClick={handleAddUrl}>Add URL</Button>
                    </div>
                    <div css={css({ 
                      width: '100%',
                      '& table': {
                        width: '100% !important',
                        minWidth: '800px',
                      }
                    })}>
                      {defaultUrls.length === 0 ? (
                        <div css={css({
                          textAlign: 'center',
                          padding: token('space.400', '32px'),
                          color: token('color.text.subtle'),
                          fontSize: '16px',
                          border: `1px solid ${token('color.border')}`,
                          borderRadius: token('border.radius.200'),
                          backgroundColor: token('elevation.surface.raised'),
                        minWidth: '735px',
                        maxWidth:'735px',

                        })}>
                          No URLs have been added
                        </div>
                      ) : (
                        <DynamicTable
                          head={{
                            cells: [
                              { key: 'url', content: 'URL', isSortable: false, width: 45 },
                              { key: 'status', content: 'Status', isSortable: false, width: 20 },
                              { key: 'lastUpdated', content: 'Last Updated', isSortable: false, width: 25 },
                              { key: 'actions', content: '', isSortable: false, width: 10 },
                            ],
                          }}
                          rows={defaultUrls.map((url, index) => ({
                            key: `url-${index}`,
                            cells: [
                              {
                                key: 'url',
                                content: editingUrlId === index ? (
                                  <Textfield
                                    value={url}
                                    onChange={(e) => handleTextfieldChange(e, index)}
                                    onBlur={handleUrlSave}
                                    onKeyDown={handleUrlKeyPress}
                                    autoFocus
                                    isCompact
                                  />
                                ) : (
                                  <span 
                                    onClick={() => handleUrlClick(index)}
                                    css={css({ 
                                      cursor: 'pointer',
                                      '&:hover': {
                                        backgroundColor: token('color.background.neutral.subtle.hovered'),
                                      },
                                    })}
                                  >
                                    {url}
                                  </span>
                                ),
                              },
                              {
                                key: 'status',
                                content: (
                                  <span css={css({ 
                                    color: token('color.text.success'), 
                                    fontWeight: 500 
                                  })}>
                                    Active
                                  </span>
                                ),
                              },
                              {
                                key: 'lastUpdated',
                                content: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                              },
                              {
                                key: 'actions',
                                content: (
                                  <Button
                                    appearance="default"
                                    iconBefore={TrashIcon}
                                    onClick={() => handleDeleteUrl(index)}
                                    aria-label="Delete URL"
                                    css={css({ minWidth: 'auto', padding: '4px 8px' })}
                                  >
                                    &nbsp;
                                  </Button>
                                ),
                              },
                            ],
                          }))}
                          testId="default-urls-table"
                        />
                      )}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div css={css({ marginTop: token('space.300') })}>
                    <div css={css({ marginBottom: '24px' })}>
                      <h4 css={css({ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', margin: 0 })}>Site Overrides</h4>
                      <p css={css({ margin: 0, marginTop: '12px' })}>Set allow lists at a site level, these override your organisation's defaults.</p>
                    </div>
                    <div css={css({ 
                      width: '100%',
                      '& table': {
                        width: '100% !important',
                        minWidth: '800px',
                      }
                    })}>
                      {siteLists.length === 0 ? (
                        <div css={css({
                          textAlign: 'center',
                          padding: token('space.400', '32px'),
                          color: token('color.text.subtle'),
                          fontSize: '16px',
                          border: `1px solid ${token('color.border')}`,
                          borderRadius: token('border.radius.200'),
                          backgroundColor: token('elevation.surface.raised'),
                          minWidth: '735px',
                          maxWidth:'735px',
                        })}>
                          No sites have been added
                        </div>
                      ) : (
                        <DynamicTable
                          head={{
                            cells: [
                              { key: 'name', content: 'Site Name', isSortable: false, width: 25 },
                              { key: 'url', content: 'URL', isSortable: false, width: 30 },
                              { key: 'status', content: 'Status', isSortable: false, width: 20 },
                              { key: 'actions', content: 'Allowed', isSortable: false, width: 10 },
                            ],
                          }}
                          rows={siteLists.map((site, index) => {
                            // Determine if siteUrls for this site matches defaultUrls
                            const siteUrlsForIndex = siteUrls[index] || [];
                            const isCustom =
                              siteUrlsForIndex.length !== defaultUrls.length ||
                              siteUrlsForIndex.some((url, i) => url !== defaultUrls[i]);
                            const statusValue = siteStatusOverrides[index] || (isCustom ? 'custom' : 'inherited');
                            // Handler for row click (except select)
                            const handleRowClick = (e: React.MouseEvent) => {
                              // Prevent navigation if clicking inside the select dropdown
                              if ((e.target as HTMLElement).closest('.site-status-select')) return;
                              handleEditSite(index);
                            };
                            return {
                              key: `site-${index}`,
                              onClick: handleRowClick,
                              cells: [
                                {
                                  key: 'name',
                                  content: (
                                    <div css={css({ display: 'flex', alignItems: 'center', gap: token('space.100', '8px') })}>
                                      {getProductLogo(site.product)}
                                      <span>{site.name}</span>
                                    </div>
                                  ),
                                },
                                {
                                  key: 'url',
                                  content: <span>{site.url}</span>,
                                },
                                {
                                  key: 'status',
                                  content: (
                                    <div className="site-status-select">
                                      <Select
                                        inputId={`site-status-${index}`}
                                        options={[
                                          { label: 'Inherited from org', value: 'inherited' },
                                          { label: 'Custom', value: 'custom' },
                                        ]}
                                        value={{ label: statusValue === 'custom' ? 'Custom' : 'Inherited from org', value: statusValue }}
                                        onChange={(option) => handleSiteStatusChange(index, option?.value as 'inherited'|'custom')}
                                        isSearchable={false}
                                        menuPlacement="auto"
                                        appearance="subtle"
                                        styles={{
                                          control: (base: any) => ({ ...base, minWidth: 180, fontWeight: 500 }),
                                          singleValue: (base: any) => ({ ...base, fontWeight: 500 }),
                                        }}
                                      />
                                    </div>
                                  ),
                                },
                                {
                                  key: 'actions',
                                  content: (
                                    <span css={css({ fontWeight: 500 })}>
                                      {siteUrlsForIndex.length} URL{siteUrlsForIndex.length === 1 ? '' : 's'}
                                    </span>
                                  ),
                                },
                              ],
                            };
                          })}
                          testId="site-lists-table"
                        />
                      )}
                    </div>
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        );
      case 'site-edit':
        const siteToEdit = selectedSiteForEdit !== null ? siteLists[selectedSiteForEdit] : null;
        if (!siteToEdit) {
          return <div>Site not found</div>;
        }
        return (
          <div>
            <div css={css({ marginBottom: token('space.400', '32px')})}>
              <Button
                appearance="subtle"
                onClick={handleBackToMCPSettings}
                css={css({ 
                  padding: 0, 
                  fontSize: '14px',
                  color: token('color.link'),
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                  },
                })}
              >
                ← Back to MCP Server Settings
              </Button>
            </div>
            <div css={css({ display: 'flex', alignItems: 'center', gap: token('space.200', '16px'), marginBottom: token('space.300', '24px') })}>
              {getProductLogo(siteToEdit.product)}
              <h1 css={css({ margin: 0 })}>Edit {siteToEdit.name}</h1>
            </div>
            <div css={css({ marginTop: token('space.300') })}>
              <div css={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' })}>
                <div>
                  <h4 css={css({ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px', margin: 0 })}>Site Overrides</h4>
                  <p css={css({ margin: 0, marginTop: '12px' })}>Configure the allowed URLs specifically for {siteToEdit.name}.</p>
                </div>
                <div css={css({ display: 'flex', gap: token('space.200', '16px') })}>
                  <Button 
                    appearance="subtle"
                    type="button"
                    onClick={() => handleRevertToOrgDefaults(selectedSiteForEdit!)}
                  >
                    Revert to org defaults
                  </Button>
                  <Button appearance="default" onClick={() => handleAddSiteUrl(selectedSiteForEdit!)}>Add URL</Button>
                </div>
              </div>
              <div css={css({ 
                width: '100%',
                '& table': {
                  width: '100% !important',
                  minWidth: '800px',
                }
              })}>
                {(!siteUrls[selectedSiteForEdit!] || siteUrls[selectedSiteForEdit!].length === 0) ? (
                  <div css={css({
                    textAlign: 'center',
                    padding: token('space.400', '32px'),
                    color: token('color.text.subtle'),
                    fontSize: '16px',
                    border: `1px solid ${token('color.border')}`,
                    borderRadius: token('border.radius.200'),
                    backgroundColor: token('elevation.surface.raised'),
                    minWidth: '735px',
                    maxWidth:'735px',
                    margin: '0 auto'
                  })}>
                    No URLs have been added
                  </div>
                ) : (
                  <DynamicTable
                    head={{
                      cells: [
                        { key: 'url', content: 'URL', isSortable: false, width: 60 },
                        { key: 'status', content: 'Status', isSortable: false, width: 15 },
                        { key: 'lastUpdated', content: 'Last Updated', isSortable: false, width: 15 },
                        { key: 'actions', content: '', isSortable: false, width: 10 },
                      ],
                    }}
                    rows={(siteUrls[selectedSiteForEdit!] || []).map((url: string, index: number) => ({
                      key: `site-url-${selectedSiteForEdit}-${index}`,
                      cells: [
                        {
                          key: 'url',
                          content: editingSiteUrlId === selectedSiteForEdit! * 1000 + index ? (
                            <Textfield
                              value={url}
                              onChange={handleSiteTextfieldChange(selectedSiteForEdit!, index)}
                              onKeyDown={handleSiteUrlKeyPress}
                              onBlur={handleSiteUrlSave}
                              autoFocus
                              placeholder="Enter URL"
                              css={css({ width: '100%' })}
                            />
                          ) : (
                            <span
                              onClick={() => handleSiteUrlClick(selectedSiteForEdit!, index)}
                              css={css({ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } })}
                            >
                              {url}
                            </span>
                          ),
                        },
                        {
                          key: 'status',
                          content: (
                            <span css={css({ color: token('color.text.success'), fontWeight: 500 })}>
                              Active
                            </span>
                          ),
                        },
                        {
                          key: 'lastUpdated',
                          content: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                        },
                        {
                          key: 'actions',
                          content: (
                            <Button
                              appearance="default"
                              iconBefore={TrashIcon}
                              onClick={() => handleDeleteSiteUrl(selectedSiteForEdit!, index)}
                              aria-label="Delete URL"
                              css={css({ minWidth: 'auto', padding: '4px 8px' })}
                            >
                              &nbsp;
                            </Button>
                          ),
                        },
                      ],
                    }))}
                    testId="site-urls-table"
                  />
                )}
              </div>
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
            <p>View analytics and generate reports.</p>
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

  const handleSiteStatusChange = (siteIndex: number, newValue: 'inherited'|'custom') => {
    setSiteStatusOverrides((prev) => ({ ...prev, [siteIndex]: newValue }));
    if (newValue === 'inherited') {
      setSiteUrls((prev) => ({ ...prev, [siteIndex]: [...defaultUrls] }));
    } else if (newValue === 'custom') {
      setSiteUrls((prev) => {
        // If already custom, keep as is; otherwise, copy org defaults
        const current = prev[siteIndex] || [];
        const isAlreadyCustom = current.length !== defaultUrls.length || current.some((url, i) => url !== defaultUrls[i]);
        return {
          ...prev,
          [siteIndex]: isAlreadyCustom ? current : [...defaultUrls],
        };
      });
    }
  };

  return (
    <div css={appStyles}>
      {/* Top Navigation */}
      <div css={topNavStyles}>
        <div css={topNavBrandStyles}>
          Admin MCP
        </div>
        
        {/* Middle section with Search and Create */}
        <div css={topNavMiddleStyles}>
          <div css={searchStyles}>
            <Search label="Search" />
          </div>
          <div css={createButtonStyles}>
            <CreateButton>Create</CreateButton>
          </div>
        </div>
        
        <div css={topNavUserAreaStyles}>
          <Button
            appearance="subtle"
            iconBefore={NotificationIcon}
            aria-label="Notifications"
          >
            &nbsp;
          </Button>
          <Button
            appearance="subtle"
            iconBefore={QuestionIcon}
            aria-label="Help"
          >
            &nbsp;
          </Button>
          <div css={avatarStyles}>
            AF
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div css={mainLayoutStyles}>
        {/* Side Navigation */}
        <div css={sidebarStyles}>
          <nav css={sidebarNavStyles}>
            {navItems.map((item) => (
              <button
                key={item.id}
                css={[
                  navItemStyles,
                  selectedItem === item.id && activeNavItemStyles
                ]}
                onClick={() => setSelectedItem(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div css={contentStyles}>
          {renderContent()}
        </div>
      </div>

      {/* Revert to Org Defaults Confirmation Modal - always mounted at root */}
      {isRevertModalOpen && (
        <ModalDialog
          onClose={handleCancelRevert}
          width="small"
          testId="danger-modal"
        >
          <ModalHeader>
            <ModalTitle>Revert to organization defaults?</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p>
              This will replace all site-specific URLs with your organization's default URL list. 
              Any custom URLs configured for this site will be lost.
            </p>
            <p>
              <strong>This action cannot be undone.</strong>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button appearance="subtle" onClick={handleCancelRevert}>
              Cancel
            </Button>
            <Button appearance="danger" onClick={handleConfirmRevert}>
              Revert to defaults
            </Button>
          </ModalFooter>
        </ModalDialog>
      )}
    </div>
  );
};

export default App;
