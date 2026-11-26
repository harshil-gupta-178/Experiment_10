const STORAGE_KEY = 'experiment10_dynamic_items';
const pageStartTime = Date.now();
const DEFAULT_ITEMS = [
  { id: 1, text: 'Deploy application to Heroku or AWS' },
  { id: 2, text: 'Connect frontend to backend REST API' }
];

function getApiUrl(endpoint) {
  if (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000')) {
    return 'http://127.0.0.1:3000' + endpoint;
  }
  return endpoint;
}

function fetchJson(url, options) {
  return fetch(url, options).then(response => {
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    return response.json();
  });
}

function getLocalItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (_) {
    // Ignore storage errors and fall back to defaults.
  }
  return DEFAULT_ITEMS.slice();
}

function saveLocalItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (_) {
    // Ignore storage errors in restricted browsing modes.
  }
}

function renderItems(items, useLocalFallback) {
  const list = document.getElementById('itemList');
  list.innerHTML = '';

  items.forEach(item => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = item.text;

    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.type = 'button';
    btn.textContent = 'Delete';
    btn.addEventListener('click', () => deleteItem(item.id, useLocalFallback));

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function showFallbackStatus() {
  const uptime = Math.floor((Date.now() - pageStartTime) / 1000);
  const statusEl = document.getElementById('status');
  statusEl.textContent = 'Static Preview (No Node.js Server)';
  statusEl.style.color = '#d97706';
  document.getElementById('serverTime').textContent = new Date().toLocaleTimeString();
  document.getElementById('uptime').textContent = uptime + ' seconds';
  document.getElementById('port').textContent = window.location.port || '443 (GitHub Pages)';
}

function loadStatus() {
  fetchJson(getApiUrl('/api/status'))
    .then(data => {
      const statusEl = document.getElementById('status');
      statusEl.textContent = data.status;
      statusEl.style.color = '#28a745';
      document.getElementById('serverTime').textContent = data.serverTime;
      document.getElementById('uptime').textContent = data.uptime;
      document.getElementById('port').textContent = data.port;
    })
    .catch(showFallbackStatus);
}

function loadItems() {
  fetchJson(getApiUrl('/api/items'))
    .then(items => renderItems(items, false))
    .catch(() => renderItems(getLocalItems(), true));
}

document.getElementById('itemForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('itemText');
  const text = input.value.trim();
  if (!text) return;

  fetchJson(getApiUrl('/api/items'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  })
    .then(() => {
      input.value = '';
      loadItems();
      loadStatus();
    })
    .catch(() => {
      const items = getLocalItems();
      items.push({ id: Date.now(), text: text });
      saveLocalItems(items);
      input.value = '';
      renderItems(items, true);
      showFallbackStatus();
    });
});

function deleteItem(id, useLocalFallback) {
  if (useLocalFallback) {
    const items = getLocalItems().filter(item => item.id !== id);
    saveLocalItems(items);
    renderItems(items, true);
    return;
  }

  fetchJson(getApiUrl('/api/items/' + id), {
    method: 'DELETE'
  })
    .then(loadItems)
    .catch(() => {
      const items = getLocalItems().filter(item => item.id !== id);
      saveLocalItems(items);
      renderItems(items, true);
    });
}

document.getElementById('refreshBtn').addEventListener('click', loadStatus);

loadStatus();
loadItems();
