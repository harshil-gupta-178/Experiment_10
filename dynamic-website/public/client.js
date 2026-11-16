function getApiUrl(endpoint) {
  if (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000')) {
    return 'http://127.0.0.1:3000' + endpoint;
  }
  return endpoint;
}

function loadStatus() {
  fetch(getApiUrl('/api/status'))
    .then(response => response.json())
    .then(data => {
      document.getElementById('status').textContent = data.status;
      document.getElementById('status').style.color = '#28a745';
      document.getElementById('serverTime').textContent = data.serverTime;
      document.getElementById('uptime').textContent = data.uptime;
      document.getElementById('port').textContent = data.port;
    })
    .catch(() => {
      document.getElementById('status').textContent = 'Error (Server Offline)';
      document.getElementById('status').style.color = '#dc3545';
    });
}

function loadItems() {
  fetch(getApiUrl('/api/items'))
    .then(response => response.json())
    .then(items => {
      const list = document.getElementById('itemList');
      list.innerHTML = '';
      items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = '<span>' + item.text + '</span><button class="delete-btn" onclick="deleteItem(' + item.id + ')">Delete</button>';
        list.appendChild(li);
      });
    });
}

document.getElementById('itemForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('itemText');
  const text = input.value.trim();
  if (!text) return;

  fetch(getApiUrl('/api/items'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text })
  })
    .then(response => response.json())
    .then(() => {
      input.value = '';
      loadItems();
      loadStatus();
    });
});

function deleteItem(id) {
  fetch(getApiUrl('/api/items/' + id), {
    method: 'DELETE'
  })
    .then(() => {
      loadItems();
    });
}

document.getElementById('refreshBtn').addEventListener('click', loadStatus);

loadStatus();
loadItems();
