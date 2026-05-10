document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Video Toggle Logic ---
    const videoBtn = document.getElementById('toggleVideoBtn');
    const videoCard = document.getElementById('videoCard');
    const videoIframe = document.getElementById('videoIframe');

    videoBtn?.addEventListener('click', () => {
        const isHidden = window.getComputedStyle(videoCard).display === 'none';
        
        if (isHidden) {
            videoCard.style.display = 'block';
            videoBtn.innerHTML = '<i class="fas fa-times-circle"></i> Hide Video';
        } else {
            videoCard.style.display = 'none';
            videoBtn.innerHTML = '<i class="fas fa-play-circle"></i> See Video';
            
            // Stop video when hiding by resetting src
            const currentSrc = videoIframe.src;
            videoIframe.src = '';
            videoIframe.src = currentSrc;
        }
    });

    // --- 2. Dropdown Logic ---

    // Dropdown Logic
    const icon = document.getElementById('accountIcon');
    const dropdown = document.getElementById('accountDropdown');
    const themeSelect = document.getElementById('theme-selector');

    icon.onclick = (e) => { e.stopPropagation(); dropdown.classList.toggle('active'); };
    dropdown.onclick = (e) => e.stopPropagation();
    document.onclick = () => dropdown.classList.remove('active');



        // Theme Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeSelect.value = savedTheme;
    themeSelect.onchange = (e) => {
        document.body.setAttribute('data-theme', e.target.value);
        localStorage.setItem('theme', e.target.value);
    };


    // --- 4. User Session Display ---
    const sessionData = localStorage.getItem("current_user_session");
    if(sessionData) {
        const user = JSON.parse(sessionData);
        const nameDisplay = document.querySelector('.user-name-dropdown');
        const gradeDisplay = document.querySelector('.user-grade-dropdown');
        const avatarDisplay = document.querySelector('.user-avatar');

        if(nameDisplay) nameDisplay.textContent = user.name;
        if(gradeDisplay) gradeDisplay.textContent = `Grade ${user.grade}`;
        if(avatarDisplay) avatarDisplay.textContent = user.name.charAt(0).toUpperCase();
    }

    injectGeneralChat();
});

// Navigation Functions
function goBack() {
    window.history.back();
}

function logout() {
    localStorage.removeItem("current_user_session");
    window.location.href = '../../../../profile.html';
}

function injectGeneralChat() {
    const LOCAL_AI_URL = 'http://127.0.0.1:11434/v1/chat/completions';
    const LOCAL_AI_MODEL = 'llama3.2';
    const REFUSAL_TEXT = "I can only help with school or study-related topics.";

    const topicTitle = document.querySelector('h1')?.textContent?.trim() || 'this chapter';
    const topicSource = [
        document.querySelector('h1')?.textContent || '',
        ...Array.from(document.querySelectorAll('h3, h4')).map((el) => el.textContent || '')
    ].join(' ').toLowerCase();
    const topicKeywords = Array.from(new Set(
        (topicSource.match(/[a-z0-9]{4,}/g) || []).filter((word) => word.length >= 4)
    )).slice(0, 30);

    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (dropdownMenu && !document.getElementById('openGeneralChatBtn')) {
        const btn = document.createElement('button');
        btn.id = 'openGeneralChatBtn';
        btn.className = 'dropdown-item';
        btn.innerHTML = '<i class="fas fa-robot"></i> General Study Chat';
        dropdownMenu.insertBefore(btn, dropdownMenu.firstChild);
    }

    if (!document.getElementById('generalAiPanel')) {
        const style = document.createElement('style');
        style.textContent = `
            .general-ai-panel{position:fixed;right:18px;bottom:18px;width:320px;max-height:430px;display:none;flex-direction:column;background:var(--card-bg);border:1px solid var(--border);border-radius:14px;z-index:1200;box-shadow:0 12px 24px rgba(0,0,0,.2)}
            .general-ai-panel.active{display:flex}
            .general-ai-head{padding:10px 12px;border-bottom:1px solid var(--border);font-weight:700}
            .general-ai-chat{padding:10px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;flex:1}
            .general-ai-msg{padding:8px 10px;border-radius:10px;font-size:13px;line-height:1.35}
            .general-ai-msg.user{background:#e8eefc;align-self:flex-end;max-width:85%}
            .general-ai-msg.bot{background:var(--bg);align-self:flex-start;max-width:95%}
            .general-ai-input-wrap{display:flex;gap:8px;padding:10px;border-top:1px solid var(--border)}
            .general-ai-input-wrap input{flex:1;border:1px solid var(--border);border-radius:10px;padding:8px}
            .general-ai-input-wrap button{border:none;border-radius:10px;background:var(--primary);color:#fff;padding:8px 10px;cursor:pointer}
        `;
        document.head.appendChild(style);

        const panel = document.createElement('div');
        panel.id = 'generalAiPanel';
        panel.className = 'general-ai-panel';
        panel.innerHTML = `
            <div class="general-ai-head">General Study & School Chat</div>
            <div id="generalAiChat" class="general-ai-chat">
                <div class="general-ai-msg bot">You are studying ${topicTitle}. Ask a question related to ${topicTitle} and I will help you with clear study guidance.</div>
            </div>
            <div class="general-ai-input-wrap">
                <input id="generalAiInput" type="text" placeholder="Ask your question..." />
                <button id="generalAiSendBtn" type="button">Send</button>
            </div>
        `;
        document.body.appendChild(panel);
    }

    const openBtn = document.getElementById('openGeneralChatBtn');
    const panel = document.getElementById('generalAiPanel');
    const input = document.getElementById('generalAiInput');
    const sendBtn = document.getElementById('generalAiSendBtn');
    const chat = document.getElementById('generalAiChat');

    function addMsg(text, role) {
        const div = document.createElement('div');
        div.className = `general-ai-msg ${role}`;
        div.textContent = text;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
        return div;
    }

    function solveMathExpression(question) {
        const text = question.toLowerCase().trim();
        const mathExpr = text.replace(/[^0-9+\-*/().\s]/g, '').trim();
        const isExpr = mathExpr.length > 0 && /^[0-9+\-*/().\s]+$/.test(mathExpr) && /[0-9]/.test(mathExpr) && /[+\-*/]/.test(mathExpr);
        if (!isExpr) return null;
        try {
            const result = Function(`"use strict"; return (${mathExpr})`)();
            if (Number.isFinite(result)) {
                return `Math result: ${mathExpr} = ${result}. Ask me if you want full steps.`;
            }
        } catch (_) {}
        return null;
    }

    function isSchoolRelated(question) {
        const text = question.toLowerCase().trim();
        const schoolKeywords = [
            'study', 'school', 'class', 'chapter', 'lesson', 'subject', 'homework', 'assignment', 'project',
            'exam', 'test', 'quiz', 'math', 'algebra', 'geometry', 'trigonometry', 'physics', 'chemistry',
            'biology', 'history', 'geography', 'civics', 'economics', 'english', 'grammar', 'science',
            'equation', 'formula', 'theorem', 'cell', 'atom', 'force', 'velocity', 'acceleration'
        ];
        return topicKeywords.some((kw) => text.includes(kw)) || schoolKeywords.some((kw) => text.includes(kw));
    }

    async function askLocalAI(question) {
        const response = await fetch(LOCAL_AI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: LOCAL_AI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: `You are a learning-focused tutor for high-school students. Keep answers concise and clear. Answer only school or study-related topics. Prioritize the current chapter topic: ${topicTitle}. If the user asks something unrelated to school/study topics, output exactly: "${REFUSAL_TEXT}"`
                    },
                    { role: 'user', content: question }
                ],
                temperature: 0.4,
                max_tokens: 350
            })
        });

        if (!response.ok) {
            throw new Error('Local AI request failed');
        }

        const data = await response.json();
        return data?.choices?.[0]?.message?.content?.trim() || 'Please ask a school-related question.';
    }

    async function handleSend() {
        const q = input.value.trim();
        if (!q) return;

        addMsg(q, 'user');
        input.value = '';

        const mathAnswer = solveMathExpression(q);
        if (mathAnswer) {
            addMsg(mathAnswer, 'bot');
            return;
        }

        if (!isSchoolRelated(q)) {
            addMsg(REFUSAL_TEXT, 'bot');
            return;
        }

        const thinkingMsg = addMsg('Thinking...', 'bot');

        try {
            const answer = await askLocalAI(q);
            thinkingMsg.textContent = answer || REFUSAL_TEXT;
        } catch (_) {
            thinkingMsg.textContent = 'Could not reach local Ollama. Run ollama serve and ollama pull llama3.2, then try again.';
        }

        chat.scrollTop = chat.scrollHeight;
    }

    openBtn?.addEventListener('click', () => panel.classList.toggle('active'));
    sendBtn?.addEventListener('click', handleSend);
    input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
}


