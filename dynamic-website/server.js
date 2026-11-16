const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const startTime = Date.now();
let items = [
  { id: 1, text: 'Deploy application to Heroku or AWS' },
  { id: 2, text: 'Connect frontend to backend REST API' }
];

app.get('/api/status', (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  res.json({
    status: 'Online',
    uptime: uptime + ' seconds',
    serverTime: new Date().toLocaleTimeString(),
    port: PORT
  });
});

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const newItem = {
    id: Date.now(),
    text: text
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

app.delete('/api/items/:id', (req, res) => {
  const id = Number(req.params.id);
  items = items.filter(item => item.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
