import React from "react";

const TrelloConnectModal = ({ isOpen, onClose, onSave, apiKey, apiSecret, token, setApiKey, setApiSecret, setToken }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2">
      <div className="bg-white dark:bg-brand-dark-secondary p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Connect to Trello</h2>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your Trello API Key"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">API Secret</label>
          <input
            type="text"
            value={apiSecret}
            onChange={e => setApiSecret(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your Trello API Secret"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Token</label>
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your Trello Token"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 w-full sm:w-auto">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto">Save</button>
        </div>
      </div>
    </div>
  );
};

export default TrelloConnectModal;
