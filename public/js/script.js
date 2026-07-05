import { marked } from 'https://cdn.jsdelivr.net/npm/marked@12/lib/marked.esm.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3/dist/purify.es.mjs';
import hljs from 'https://cdn.jsdelivr.net/npm/highlight.js@11/+esm';

marked.setOptions({ breaks: true });

// render markdown → sanitize → syntax-highlight code blocks
function renderMarkdown(el, text) {
  el.innerHTML = DOMPurify.sanitize(marked.parse(text));
  el.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const title = document.getElementById('chat-title');
const avatar = document.getElementById('tutor-avatar');
const statusText = document.getElementById('status-text');
const sendBtn = form.querySelector('button');

const TUTORS = {
  'Hitesh Sir': {
    slug: 'hitesh',
    image: './images/hitesh-sir.jpg',
    catchphrase: '“Haan ji, bolo!”',
    typing: 'jawab soch rahe hai…',
    status: '',
    breakStatus: 'thoda break…',
    chips: [
      'Placement ki taiyari kaise karein?',
      'Cohort vs self-learn — kya better hai?',
      'Confidence kaise laaye coding mein?',
    ],
  },
  'Piyush Sir': {
    slug: 'piyush',
    image: './images/piyush-sir.jpg',
    catchphrase: '“Kya bana rahe ho aaj?”',
    typing: 'architect kar rahe hai…',
    breakStatus: 'build check…',
    status: '',
    chips: [
      'Full stack kahan se seekhu?',
      'Docker aur DevOps seekhni hai — kaise shuru karun?',
      'Impressive portfolio kaise banaye?',
    ],
  },
};

const HITESH_GREETINGS = {
  morning: [
    "Haanji, good morning. Chai bani ya sirf socha hai?",
    "Subah subah bugs dekhne ka apna hi maza hai.",
    "Neend poori hui ya seedha keyboard pe aa gaye?",
    "Alarm snooze karke aaye ho ya fresh ho?",
    "Sabse pehla sawaal, chai kahan hai?",
    "Haanji, fresh dimaag hai, kuch naya seekh lo.",
    "Subah best time hai concepts clear karne ka. Kya lekar baithe ho?",
    "Din shuru, ek chhota target set karo aaj ke liye.",
    "Haanji, batao aaj kis topic pe focus karna hai.",
    "Naya din hai, purani confusion peeche chhodo.",
  ],
  afternoon: [
    "Lunch ke baad code likhna ya neend aa rahi hai?",
    "Haanji, dopahar ka slump hai ya bug mein stuck ho?",
    "Tutorial dekh rahe ho ya kuch bana bhi rahe ho?",
    "Dopahar mein motivation dhoondne aaye ho, sahi jagah ho.",
    "Chai dobara ban gayi ya ek cup mein pura din chalega?",
    "Haanji, batao aaj kaunsa problem solve karna hai.",
    "Aadha din nikal gaya, progress kaisa hai project pe?",
    "Dopahar mein focus bana rakhna hi asli discipline hai.",
    "Kya atka hai, seedha bolo, sort kar lete hain.",
    "Haanji, kaam chal raha hai ya planning mein din nikal gaya?",
  ],
  evening: [
    "Office se aaye ho ya seedha laptop khol liya?",
    "Haanji, evening chai ke saath aaj kaunsa bug fry hoga?",
    "Din bhar ki thakaan, aur ab code bhi. Josh hai kya?",
    "Sham ho gayi, tutorial list lambi hui ya kuch complete hua?",
    "Haanji, aaj ka scene kya hai, seekhna hai ya build karna hai?",
    "Sham ka time hai, din ka hisaab lagao, kya seekha aaj?",
    "Haanji, thoda dhang se baitho, batao kahan atke ho.",
    "Evening mein consistency banaye rakhna hi farak dalta hai.",
    "Kaam khatam karke aaye ho, ab dimaag coding pe lagao.",
    "Haanji, batao aaj ka topic, dhyaan se sunte hain.",
  ],
  night: [
    "Raat ke 12 baje bhi bug zinda hai, himmat hai tumhari.",
    "Haanji, neend se zyada priority bug ko de rahe ho lagta hai.",
    "Itni raat coding, ya Stack Overflow scroll ho raha hai?",
    "Raat wale coder alag hi breed hote hain, batao scene kya hai.",
    "Haanji, chai thandi ho gayi hogi ab, phir bhi lage raho.",
    "Der raat hai, par seekhna kabhi late nahi hota.",
    "Haanji, thoda aaram bhi karo, par pehle batao kahan fase ho.",
    "Raat ko dimaag shant hota hai, concepts clear karne ka sahi time.",
    "Neend important hai, par pehle bata do, kya solve karna hai.",
    "Haanji, der ho gayi hai, jaldi batao problem kya hai.",
  ],
};

const PIYUSH_GREETINGS = {
  morning: [
    "Morning bhai. Coffee done or still booting up?",
    "New day, same bugs waiting. What's the plan?",
    "Fresh morning, fresh commits. What are we pushing today?",
    "Alarm snoozed thrice, still made it here, respect. What's up?",
    "Morning energy is real, use it before meetings kill it.",
    "Good morning. What's the problem statement today?",
    "Let's use this headspace well. What are you building?",
    "Morning's best for deep work, no distractions. What's on your plate?",
    "New day, new target. What are you shipping today?",
    "Let's start clean. What's blocking you right now?",
  ],
  afternoon: [
    "Post lunch coma hitting or you're actually coding?",
    "Afternoon slump is real, but bugs don't rest. What's up?",
    "Still watching tutorials or actually building, bhai?",
    "Half the day gone, coffee two loading. What's the update?",
    "Dopahar mein bhi hustle chalu hai, nice. What are we solving?",
    "What's the current bottleneck? Let's break it down.",
    "Half day down, what's the progress on the project?",
    "Focus dips in the afternoon, discipline is what separates people.",
    "Tell me the exact error, we'll fix it faster.",
    "Consistency through the day beats morning motivation. What's next?",
  ],
  evening: [
    "Office khatam, real coding shift starts now, yes or no?",
    "Evening bugs hit different, what broke this time?",
    "Long day, laptop still open, that's dedication. What's cooking?",
    "Tutorial list getting longer or projects actually shipping?",
    "Evening grind mode on. What are we building tonight?",
    "Good evening. What did you actually learn today, be honest.",
    "End of day check in, what's the status on your project?",
    "Evening consistency is what compounds over months. Plan for tonight?",
    "Let's wrap the day with something shipped. What's left?",
    "What's the bottleneck right now, let's solve it before you log off.",
  ],
  night: [
    "Midnight debugging club, welcome. What's broken?",
    "Sleep can wait, bug can't, that's the mindset huh?",
    "Fifteen Stack Overflow tabs open, classic night coding. What's up?",
    "Still awake and shipping, that's the grind. What's the issue?",
    "Night owls write the best commits apparently. What are we fixing?",
    "Late night but let's make it count. What's the exact problem?",
    "Rest matters too, but first tell me what's stuck.",
    "Quiet hours are good for deep debugging. What's the error?",
    "Don't burn out chasing this at 2am. What's up?",
    "Night session, keep it focused. What needs fixing?",
  ],
};

function getGreeting(personaSlug) {
  const hour = new Date().getHours();
  const period = hour >= 5 && hour < 12 ? 'morning'
    : hour >= 12 && hour < 17 ? 'afternoon'
    : hour >= 17 && hour < 22 ? 'evening'
    : 'night';
  const G = personaSlug === 'hitesh' ? HITESH_GREETINGS : PIYUSH_GREETINGS;
  return G[period][Math.floor(Math.random() * G[period].length)];
}

const selectedTutor = TUTORS[localStorage.getItem('selectedTutor')]
  ? localStorage.getItem('selectedTutor')
  : 'Hitesh Sir';
const tutor = TUTORS[selectedTutor];

// persona-aware chrome
document.body.dataset.persona = tutor.slug;
title.textContent = selectedTutor;
avatar.src = tutor.image;
avatar.alt = selectedTutor;
statusText.textContent = tutor.status;

const statusEl = document.querySelector('.status');
if (!tutor.status && statusEl) statusEl.style.display = 'none';

document.title = `Persona AI — ${selectedTutor}`;

if (history.length === 0) {
  renderWelcome();
} else {
  history.forEach(entry => addMessage(entry.content, entry.role === 'user' ? 'user' : 'bot'));
}

// --- mentor switcher ---
const picker = document.getElementById('picker');
const switchBtn = document.getElementById('switch-btn');

switchBtn.addEventListener('click', () => {
  picker.hidden = false;
  picker.querySelector('.picker-card').focus();
});

function closePicker() {
  picker.hidden = true;
  switchBtn.focus();
}

picker.querySelectorAll('[data-close-picker]').forEach((el) =>
  el.addEventListener('click', closePicker)
);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !picker.hidden) closePicker();
});

picker.querySelectorAll('.picker-card').forEach((card) =>
  card.addEventListener('click', () => {
    const choice = card.dataset.tutor;
    if (choice === selectedTutor) {
      closePicker();
      return;
    }
    localStorage.setItem('selectedTutor', choice);
    localStorage.removeItem('chatHistory');
    window.location.reload();
  })
);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  sendMessage(input.value.trim());
});

// the reply currently being typed (if any) — so a new message can interrupt it
let activeReply = null;

// conversation memory: sent with every request so the mentor remembers
const history = (() => {
  try {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
})();

function saveHistory() {
  try { localStorage.setItem('chatHistory', JSON.stringify(history)); } catch {}
}

// follow-up nudge: if the user goes quiet after a reply, the mentor
// checks in on their own (once, until the user speaks again)
let nudgeTimer = null;
let nudgeUsed = false;

function scheduleNudge() {
  clearTimeout(nudgeTimer);
  if (nudgeUsed) return;
  const delay = 45000 + Math.random() * 45000; // 45-90s, feels random
  nudgeTimer = setTimeout(() => {
    // bad moment? (tab hidden, reply in progress, user mid-typing) — try later
    if (document.hidden || activeReply || input.value.trim() !== '') {
      scheduleNudge();
      return;
    }
    nudgeUsed = true;
    requestReply({ followUp: true });
  }, delay);
}

async function sendMessage(userMsg) {
  if (!userMsg) return;

  clearTimeout(nudgeTimer);
  nudgeUsed = false;

  // WhatsApp-style interruption: user sent a new message while the
  // mentor was still typing — cut that reply where it is and let the
  // model react to being interrupted
  let wasInterrupted = false;
  let partialReply = '';
  if (activeReply) {
    partialReply = activeReply.interrupt();
    wasInterrupted = true;
    // remember what the mentor managed to say before being cut off
    if (partialReply) { history.push({ role: 'assistant', content: partialReply }); saveHistory(); }
  }

  const userRow = addMessage(userMsg, 'user');
  const ticks = userRow.querySelector('.ticks');
  input.value = '';
  history.push({ role: 'user', content: userMsg });
  saveHistory();

  await requestReply({ message: userMsg, wasInterrupted, partialReply, ticks });
}

async function requestReply({ message = '', followUp = false, wasInterrupted = false, partialReply = '', ticks = null }) {
  const typingRow = addTypingIndicator();
  const controller = new AbortController();
  let typer = null;

  const thisReply = {
    interrupt() {
      controller.abort();
      typingRow.remove();
      if (typer) {
        typer.interrupt();
        return typer.getTyped();
      }
      return '';
    },
  };
  activeReply = thisReply;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        message,
        persona: selectedTutor,
        history: history.slice(-16),
        ...(followUp && { followUp: true }),
        ...(wasInterrupted && { interrupted: true, partialReply }),
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      typingRow.remove();
      addMessage(data.reply || 'Kuch gadbad ho gayi — reply nahi mila. Try again?', 'bot');
      return;
    }

    // stream the reply into a human-like typer
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      if (!typer) {
        typingRow.remove();
        // message "seen" — double tick
        if (ticks) {
          ticks.textContent = '✓✓';
          ticks.classList.add('seen');
        }
        typer = createHumanTyper();
      }

      typer.push(chunk);
    }

    if (!typer) {
      typingRow.remove();
      addMessage('Kuch gadbad ho gayi — reply nahi mila. Try again?', 'bot');
    } else {
      typer.end();
      await typer.finished;
      // remember the full reply, then wait to see if the user goes quiet
      history.push({ role: 'assistant', content: typer.getTyped() });
      saveHistory();
      if (followUp) nudgeUsed = true;
      scheduleNudge();
    }
  } catch (err) {
    if (err.name === 'AbortError') return; // superseded by a newer message
    typingRow.remove();
    if (typer) {
      typer.end();
      await typer.finished;
    }
    addMessage('Server se connect nahi ho paya. Check your connection and try again.', 'bot');
  } finally {
    if (activeReply === thisReply) activeReply = null;
    input.focus();
  }
}

// ---------------------------------------------------------------
// Human-like typewriter: types the streamed reply with jittery
// speed, pauses at punctuation, occasional hesitation, and rare
// typos that get noticed, backspaced, and retyped.
// ---------------------------------------------------------------
const NEAR_KEYS = {
  a: 'sq', b: 'vn', c: 'xv', d: 'sf', e: 'wr', f: 'dg', g: 'fh',
  h: 'gj', i: 'uo', j: 'hk', k: 'jl', l: 'k', m: 'n', n: 'bm',
  o: 'ip', p: 'o', q: 'wa', r: 'et', s: 'ad', t: 'ry', u: 'yi',
  v: 'cb', w: 'qe', x: 'zc', y: 'tu', z: 'x',
};

// misspell a word: swap two inner letters or drop one
function misspell(word) {
  const i = 1 + Math.floor(Math.random() * (word.length - 2));
  if (Math.random() < 0.5) {
    return word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2);
  }
  return word.slice(0, i) + word.slice(i + 1);
}

function createHumanTyper() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rawSleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let target = '';       // full text received from the stream so far
  let pos = 0;           // how far into target we have typed
  let segText = '';      // text shown in the current bubble
  let typedAll = '';     // text finished in earlier bubbles of this reply
  let streamDone = false;
  let interrupted = false;
  let chaiBreakDone = false;
  let burst = 0;
  let resolveFinished;
  const finished = new Promise((r) => (resolveFinished = r));

  // sleeps in small slices so an interruption cuts pauses short
  const sleep = async (ms) => {
    const end = Date.now() + ms;
    while (Date.now() < end && !interrupted) {
      await rawSleep(Math.min(50, end - Date.now()));
    }
  };

  const setStatus = (t) => {
    statusText.textContent = t;
    const el = document.querySelector('.status');
    if (el) el.style.display = '';
  };

  const newBubble = () => {
    const b = addMessage('', 'bot').querySelector('.bubble');
    b.classList.add('streaming');
    return b;
  };

  let bubble = newBubble();

  const render = () => {
    renderMarkdown(bubble, segText);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  const typeChars = async (str, min, max) => {
    for (const ch of str) {
      if (interrupted) return;
      segText += ch;
      render();
      await sleep(min + Math.random() * (max - min));
    }
  };

  const backspaceChars = async (n) => {
    for (let i = 0; i < n; i++) {
      if (interrupted) return;
      segText = segText.slice(0, -1);
      render();
      await sleep(30 + Math.random() * 25);
    }
  };

  async function run() {
    setStatus('typing…');

    while (true) {
      if (interrupted) break;
      if (pos >= target.length) {
        if (streamDone) break;
        await sleep(40); // wait for more chunks
        continue;
      }

      // if the stream is far ahead, quietly speed up to catch up
      const backlog = target.length - pos;
      const speedup = backlog > 400 ? 0.15 : backlog > 150 ? 0.45 : 1;

      // paragraph break → finish this bubble, start a new one (like
      // people replying in 2-3 messages). Never split inside a code block.
      if (
        target.startsWith('\n\n', pos) &&
        segText.length > 80 &&
        backlog > 60 &&
        ((segText.match(/```/g) || []).length % 2 === 0)
      ) {
        bubble.classList.remove('streaming');
        render();
        typedAll += segText + '\n\n';
        pos += 2;
        while (target[pos] === '\n') pos++;
        await sleep(reduceMotion ? 60 : 450 + Math.random() * 450);
        if (interrupted) break;
        bubble = newBubble();
        segText = '';
        continue;
      }

      const next = target[pos];

      if (!reduceMotion && speedup === 1) {
        // one chai break per long reply, at a sentence boundary
        if (!chaiBreakDone && target.length > 380 && pos > 180 && '.!?'.includes(target[pos - 1])) {
          chaiBreakDone = true;
          setStatus(tutor.breakStatus);
          await sleep(1400 + Math.random() * 700);
          setStatus('typing…');
        }

        // word-level correction: type the whole word misspelled,
        // notice it, delete it, retype correctly
        if (
          Math.random() < 0.018 &&
          /[a-z]/i.test(next) &&
          (pos === 0 || /\s/.test(target[pos - 1]))
        ) {
          const m = target.slice(pos).match(/^[A-Za-z]{5,12}/);
          if (m) {
            const word = m[0];
            const wrong = misspell(word);
            await typeChars(wrong, 28, 65);
            setStatus('editing…');
            await sleep(380 + Math.random() * 320); // ...hmm, galat likha
            await backspaceChars(wrong.length);
            setStatus('typing…');
            await sleep(130);
            await typeChars(word, 35, 75);
            pos += word.length;
            continue;
          }
        }

        // rare single-char typo: neighbouring key, backspace, continue
        if (Math.random() < 0.015 && /[a-z]/i.test(next)) {
          const pool = NEAR_KEYS[next.toLowerCase()] || 'aeiou';
          let wrong = pool[Math.floor(Math.random() * pool.length)];
          if (next === next.toUpperCase()) wrong = wrong.toUpperCase();
          wrong += target.slice(pos + 1, pos + 1 + Math.floor(Math.random() * 2));

          await typeChars(wrong, 35, 80);
          setStatus('editing…');
          await sleep(280 + Math.random() * 320);
          await backspaceChars(wrong.length);
          setStatus('typing…');
          await sleep(140);
          continue;
        }

        // occasional mid-sentence hesitation
        if (Math.random() < 0.012) {
          setStatus('soch rahe hai…');
          await sleep(400 + Math.random() * 550);
          setStatus('typing…');
        }
      }

      segText += next;
      pos++;
      render();

      if (reduceMotion) {
        await sleep(3);
        continue;
      }

      // burst typing: a quick run of chars, then a micro-pause
      let delay = (8 + Math.random() * 15) * speedup;
      if (++burst >= 4 + Math.floor(Math.random() * 5)) {
        burst = 0;
        delay += 70 + Math.random() * 130;
      }
      if ('.!?'.includes(next)) delay += 200 + Math.random() * 260;
      else if (next === ',' || next === '\n') delay += 90 + Math.random() * 140;
      await sleep(delay);
    }

    bubble.classList.remove('streaming');
    render();
    // on interruption the next reply's typer owns the status line
    if (!interrupted) {
      setStatus(tutor.status);
      if (!tutor.status) {
        const el = document.querySelector('.status');
        if (el) el.style.display = 'none';
      }
    }
    resolveFinished();
  }

  run();

  return {
    push(text) { target += text; },
    end() { streamDone = true; },
    interrupt() { interrupted = true; streamDone = true; },
    getTyped() { return typedAll + segText; },
    finished,
  };
}

function renderWelcome() {
  const el = document.createElement('div');
  el.className = 'welcome';

  const catchEl = document.createElement('span');
  catchEl.className = 'welcome-catch';
  catchEl.textContent = tutor.catchphrase;

  const sub = document.createElement('p');
  sub.className = 'welcome-sub';
  sub.textContent = getGreeting(tutor.slug);

  const chips = document.createElement('div');
  chips.className = 'chips';
  tutor.chips.forEach((text) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = text;
    chip.addEventListener('click', () => sendMessage(text));
    chips.appendChild(chip);
  });

  el.append(catchEl, sub, chips);
  chatBox.appendChild(el);
}

function addMessage(text, sender) {
  const row = document.createElement('div');
  row.className = `msg-row ${sender}`;

  const wrap = document.createElement('div');
  wrap.className = 'bubble-wrap';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  if (sender === 'bot') {
    // AI replies arrive as markdown — render it, but sanitized
    bubble.classList.add('md');
    renderMarkdown(bubble, text);
  } else {
    bubble.textContent = text;
  }

  const meta = document.createElement('span');
  meta.className = 'meta';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (sender === 'bot') {
    meta.textContent = `${selectedTutor} · ${time}`;
  } else {
    meta.textContent = `${time} `;
    const ticks = document.createElement('span');
    ticks.className = 'ticks';
    ticks.textContent = '✓';
    meta.appendChild(ticks);
  }

  wrap.append(bubble, meta);

  if (sender === 'bot') {
    const img = document.createElement('img');
    img.className = 'msg-avatar';
    img.src = tutor.image;
    img.alt = '';
    row.appendChild(img);
  }

  row.appendChild(wrap);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  return row;
}

function addTypingIndicator() {
  const row = document.createElement('div');
  row.className = 'msg-row bot typing-row';
  row.setAttribute('aria-label', `${selectedTutor} is typing`);

  const img = document.createElement('img');
  img.className = 'msg-avatar';
  img.src = tutor.image;
  img.alt = '';

  const wrap = document.createElement('div');
  wrap.className = 'bubble-wrap';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML =
    `<span class="typing-label"></span><span class="typing"><i></i><i></i><i></i></span>`;
  bubble.querySelector('.typing-label').textContent = tutor.typing;

  wrap.appendChild(bubble);
  row.append(img, wrap);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
  return row;
}
