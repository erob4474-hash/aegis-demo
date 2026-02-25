// Structure logique simplifiée pour brancher v0 au Backend
import React, { useState, useEffect } from 'react';

const API_URL = "http://localhost:8000";

export default function AegisApp() {
  const [user, setUser] = useState(null); // { username, role }
  const [view, setView] = useState('login'); // login, chat, admin
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [policy, setPolicy] = useState('');
  const [logs, setLogs] = useState([]);

  // Login Logic
  const handleLogin = async (username, password) => {
    const res = await fetch(`${API_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.status === 'success') {
      setUser({ username, role: data.role });
      setView(data.role === 'admin' ? 'admin' : 'chat');
      if (data.role === 'admin') fetchAdminData();
    }
  };

  // Secure Chat Logic
  const sendMessage = async () => {
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);

    const res = await fetch(`${API_URL}/v1/secure-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input, provider: 'ollama', username: user.username })
    });
    const data = await res.json();

    if (data.status === 'blocked') {
      setMessages(prev => [...prev, { role: 'system', content: `🛡️ BLOQUÉ : ${data.message}`, type: 'error' }]);
    } else {
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    }
    setInput('');
  };

  // Admin Data Fetch
  const fetchAdminData = async () => {
    const res = await fetch(`${API_URL}/v1/admin/stats`);
    const data = await res.json();
    setLogs(data.logs);
    setPolicy(data.current_policy);
  };

  // Render Logic (v0 UI Components go here)
  if (view === 'login') return <LoginUI onLogin={handleLogin} />;
  if (view === 'admin') return <AdminDashboard logs={logs} policy={policy} onUpdatePolicy={updatePolicy} />;
  return <ChatUI messages={messages} onSend={sendMessage} input={input} setInput={setInput} />;
}