import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = Number(process.env.PORT || 5500);

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const DEFAULT_MODEL =
  process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct';

const ALLOW = (process.env.ALLOWED_ORIGINS || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(express.json({ limit: '512kb' }));

app.use(
  cors({
    origin(origin, cb) {
      if (ALLOW.includes('*') || ALLOW.length === 0) return cb(null, true);
      if (!origin) return cb(null, true);
      if (ALLOW.includes(origin)) return cb(null, true);
      cb(new Error('Origin not allowed'));
    },
  })
);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/v1/chat', async (req, res) => {
  if (!OPENROUTER_KEY) {
    return res
      .status(503)
      .json({ error: 'OPENROUTER_API_KEY is not set on the proxy server.' });
  }

  const { messages, model, temperature = 0.7, max_tokens = 2048 } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://arma.local',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'BNA Study',
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        messages,
        temperature,
        max_tokens,
      }),
    });

    const text = await r.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'Invalid upstream response', detail: text });
    }

    if (!r.ok) {
      return res.status(r.status).json(data.error ? data : { error: data });
    }
    return res.json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || 'Proxy failure' });
  }
});

app.listen(PORT, () => {
  console.log(`Study AI proxy on http://127.0.0.1:${PORT} (health: /health)`);
});
