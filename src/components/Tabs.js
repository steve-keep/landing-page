import React from 'react';

function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="tab">
      <button
        className={`tablinks ${activeTab === 'burnley' ? 'active' : ''}`}
        onClick={() => setActiveTab('burnley')}
      >
        Burnley FC
      </button>
      <button
        className={`tablinks ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => setActiveTab('settings')}
      >
        Settings
      </button>
    </div>
  );
}

export default Tabs;
