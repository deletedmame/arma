(function () {
  function pathSegmentsToRepoRoot() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length && /\.html?$/i.test(parts[parts.length - 1])) parts.pop();
    return parts;
  }

  function rootPrefix() {
    if (typeof window.__STUDY_AI_ROOT__ === 'string') return window.__STUDY_AI_ROOT__;
    var parts = pathSegmentsToRepoRoot();
    return parts.length ? new Array(parts.length + 1).join('../') : '';
  }

  function ensureStudyAiCss() {
    if (document.getElementById('study-ai-stylesheet')) return;
    var prefix = rootPrefix();
    var link = document.createElement('link');
    link.id = 'study-ai-stylesheet';
    link.rel = 'stylesheet';
    link.href = prefix + 'styles/study-ai-panel.css';
    document.head.appendChild(link);
  }

  function proxyBase() {
    if (typeof window.__STUDY_AI_PROXY_BASE__ === 'string' && window.__STUDY_AI_PROXY_BASE__) {
      return window.__STUDY_AI_PROXY_BASE__.replace(/\/$/, '');
    }
    var meta = document.querySelector('meta[name="study-ai-proxy-base"]');
    if (meta && meta.content && meta.content.trim()) {
      return meta.content.trim().replace(/\/$/, '');
    }
    try {
      var ls = localStorage.getItem('studyAiProxyBase');
      if (ls && ls.trim()) return ls.trim().replace(/\/$/, '');
    } catch (_) {}
    return '';
  }

  async function fetchChat(messages, opts) {
    opts = opts || {};
    var base = proxyBase();
    if (!base) {
      throw new Error(
        'Study AI proxy URL is not set. In the browser console run: localStorage.setItem("studyAiProxyBase","http://127.0.0.1:8787") or set window.__STUDY_AI_PROXY_BASE__ / meta[name=study-ai-proxy-base]. Never put OpenRouter keys in the frontend.'
      );
    }

    var r = await fetch(base + '/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages,
        model: opts.model,
        temperature: opts.temperature != null ? opts.temperature : 0.7,
        max_tokens: opts.max_tokens != null ? opts.max_tokens : 1400,
      }),
    });

    var text = await r.text();
    var data;
    try {
      data = JSON.parse(text);
    } catch (_) {
      throw new Error(text || 'Proxy returned non-JSON');
    }
    if (!r.ok) {
      throw new Error(data.error || data.detail || text || 'Proxy error');
    }
    return data;
  }

  function messageContent(data) {
    if (!data) return '';
    if (typeof data.content === 'string') return data.content;
    try {
      return data.choices[0].message.content || '';
    } catch (_) {
      return '';
    }
  }

  function formatInline(text) {
    return String(text || '')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  function mountChapterAssistantIfNeeded() {
    if (document.getElementById('studyAiMounted')) return;
    if (document.getElementById('aiChatBtn')) return;

    var noteBox =
      document.querySelector('#noteScrollBox') || document.querySelector('.note-scroll-box');
    var h1 = document.querySelector('h1');
    if (!noteBox || !h1) return;

    ensureStudyAiCss();
    document.body.setAttribute('data-study-ai-default', '1');

    var title = (h1.textContent || '').trim() || document.title;
    var excerpt = (noteBox.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 2800);

    var systemPrompt =
      'You are ARMA Study Assistant — a concise, supportive tutor for BNA Academy students.\n' +
      'Current page topic: "' +
      title +
      '".\n' +
      (excerpt ? 'Lesson excerpt from the student page:\n"' + excerpt + '"\n' : '') +
      'Answer only with helpful study explanations. Stay on-topic for school subjects. Keep answers clear for teenagers.';

    var history = [{ role: 'system', content: systemPrompt }];
    var maxTurns = 10;

    function escapeHtml(t) {
      return String(t)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.id = 'studyAiMounted';
    fab.className = 'study-ai-chat-btn study-ai-fab';
    fab.title = 'Study Assistant';
    fab.innerHTML = '<i class="fas fa-robot"></i>';

    var panel = document.createElement('div');
    panel.id = 'studyAiPanelShell';
    panel.className = 'study-ai-panel';
    panel.innerHTML =
      '<div class="study-ai-head">' +
      '<span><i class="fas fa-brain"></i> Study assistant</span>' +
      '<button type="button" id="studyAiClose" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="study-ai-chat-stream" id="studyAiStream">' +
      '<div class="study-ai-msg assistant">Ask a question about <strong>' +
      escapeHtml(title) +
      '</strong>.</div>' +
      '</div>' +
      '<div class="study-ai-input-row">' +
      '<input id="studyAiInput" type="text" placeholder="Ask about this chapter…" />' +
      '<button type="button" id="studyAiSend">Send</button>' +
      '</div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var streamEl = panel.querySelector('#studyAiStream');
    var inp = panel.querySelector('#studyAiInput');
    var sendBtn = panel.querySelector('#studyAiSend');
    var closeBtn = panel.querySelector('#studyAiClose');

    function addMsg(role, html) {
      var d = document.createElement('div');
      d.className = 'study-ai-msg ' + role;
      d.innerHTML = html;
      streamEl.appendChild(d);
      streamEl.scrollTop = streamEl.scrollHeight;
    }

    function toggle(force) {
      var on = typeof force === 'boolean' ? force : !panel.classList.contains('study-ai-active');
      panel.classList.toggle('study-ai-active', on);
      if (on) setTimeout(function () {
        inp.focus();
      }, 50);
    }

    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      toggle();
    });
    closeBtn.addEventListener('click', function () {
      toggle(false);
    });
    document.addEventListener('click', function (e) {
      if (!panel.classList.contains('study-ai-active')) return;
      if (panel.contains(e.target) || fab.contains(e.target)) return;
      toggle(false);
    });

    async function send() {
      var msg = inp.value.trim();
      if (!msg) return;
      inp.value = '';
      addMsg('user', formatInline(msg));
      history.push({ role: 'user', content: msg });
      sendBtn.disabled = true;
      inp.disabled = true;
      try {
        var msgs =
          history.length <= maxTurns
            ? history
            : [history[0]].concat(history.slice(-(maxTurns - 1)));
        var raw = await fetchChat(msgs, { max_tokens: 1600, temperature: 0.65 });
        var content = messageContent(raw) || 'Sorry, no reply was returned.';
        history.push({ role: 'assistant', content: content });
        addMsg('assistant', formatInline(content));
      } catch (err) {
        addMsg(
          'assistant',
          formatInline(String(err.message || err)) +
            '<br><br>Set proxy once: localStorage.setItem("studyAiProxyBase","http://127.0.0.1:8787"); then reload. Deploy the proxy from the /server folder with OPENROUTER_API_KEY in server/.env.'
        );
      } finally {
        sendBtn.disabled = false;
        inp.disabled = false;
        inp.focus();
      }
    }

    sendBtn.addEventListener('click', send);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });
  }

  window.StudyAi = {
    rootPrefix,
    proxyBase,
    fetchChat,
    messageContent,
    mountChapterAssistantIfNeeded,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountChapterAssistantIfNeeded);
  } else {
    mountChapterAssistantIfNeeded();
  }
})();
