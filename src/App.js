import React, { useState } from 'react';
import Tabs from './components/Tabs';
import Burnley from './components/Burnley';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('burnley');
  const [settingsKey, setSettingsKey] = useState(0);

  const handleSettingsSave = () => {
    setSettingsKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'burnley' && <Burnley key={settingsKey} />}
        {activeTab === 'settings' && <Settings onSave={handleSettingsSave} />}
      </div>
    </div>
  );
}

export default App;
