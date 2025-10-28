import { LANGS, translateText } from './js/translate.js';
import { startMic, speakText } from './js/speech.js';
import { initOCR } from './js/ocr.js';
import { initConversation } from './js/conversation.js';

const sourceSel = document.getElementById('sourceLang');
const targetSel = document.getElementById('targetLang');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

const micBtn = document.getElementById('micBtn');
const speakBtn = document.getElementById('speakBtn');
const copyBtn = document.getElementById('copyBtn');
const imageBtn = document.getElementById('imageBtn');
const conversationBtn = document.getElementById('conversationBtn');

const imagePane = document.getElementById('imagePane');
const conversationPane = document.getElementById('conversationPane');
const swapBtn = document.getElementById('swapBtn');

function fillLangs() {
  LANGS.forEach(({ code, name }) => {
    const opt1 = new Option(name, code);
    const opt2 = new Option(name, code);
    sourceSel.add(opt1); targetSel.add(opt2);
  });
  sourceSel.value = 'vi'; targetSel.value = 'en';
}
fillLangs();

swapBtn.addEventListener('click', () => {
  [sourceSel.value, targetSel.value] = [targetSel.value, sourceSel.value];
});

document.getElementById('installBtn')?.addEventListener('click', () => {
  // đơn giản: các trình duyệt sẽ tự hiển thị prompt; có thể bắt sự kiện beforeinstallprompt nếu muốn tuỳ biến
});

document.getElementById('imageUrl').addEventListener('keyup', e => {
  if (e.key === 'Enter') document.getElementById('loadUrlBtn').click();
});

imageBtn.addEventListener('click', () => {
  imagePane.hidden = !imagePane.hidden;
  if (!imagePane.hidden) initOCR(sourceSel, targetSel, translateText);
});

conversationBtn.addEventListener('click', () => {
  conversationPane.hidden = !conversationPane.hidden;
  if (!conversationPane.hidden) initConversation(translateText);
});

micBtn.addEventListener('click', () => startMic(sourceSel.value, inputText));
speakBtn.addEventListener('click', () => speakText(outputText.textContent, targetSel.value));
copyBtn.addEventListener('click', () => navigator.clipboard.writeText(outputText.textContent));

async function runTranslate() {
  const txt = inputText.value.trim();
  if (!txt) return;
  outputText.textContent = 'Đang dịch...';
  try {
    const res = await translateText(txt, sourceSel.value, targetSel.value);
    outputText.textContent = res;
  } catch (e) {
    outputText.textContent = 'Lỗi dịch: ' + e.message;
  }
}
inputText.addEventListener('input', () => {
  // debounce đơn giản
  clearTimeout(window.__t);
  window.__t = setTimeout(runTranslate, 400);
});
``
