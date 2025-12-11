import React, { useState, useEffect } from 'react';

function Settings({ onSave }) {
  const [workerUrl, setWorkerUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Load settings from localStorage when the component mounts
  useEffect(() => {
    const savedWorkerUrl = localStorage.getItem('workerUrl');
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedWorkerUrl) {
      setWorkerUrl(savedWorkerUrl);
    }
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem('workerUrl', workerUrl);
    localStorage.setItem('apiKey', apiKey);
    alert('Settings saved!');
    if (onSave) {
      onSave();
    }
  };

  return (
    <div id="settings" className="tabcontent" style={{ display: 'block' }}>
      <h3>Settings</h3>
      <p>
        To get your free API key, please register on the{' '}
        <a
          href="https://www.football-data.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          football-data.org
        </a>{' '}
        website.
      </p>
      <div className="setting-item">
        <label htmlFor="worker-url">Cloudflare Worker URL:</label>
        <input
          type="text"
          id="worker-url"
          name="worker-url"
          value={workerUrl}
          onChange={(e) => setWorkerUrl(e.target.value)}
        />
      </div>
      <div className="setting-item">
        <label htmlFor="api-key">API Key:</label>
        <input
          type="text"
          id="api-key"
          name="api-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <button id="save-settings" onClick={handleSaveSettings}>
        Save Settings
      </button>
    </div>
  );
}

export default Settings;
