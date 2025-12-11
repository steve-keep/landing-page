import React, { useState } from 'react';
import Tabs from './components/Tabs';
import Burnley from './components/Burnley';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('burnley');

  return (
    <div className="container">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'burnley' && <Burnley />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
}

export default App;
