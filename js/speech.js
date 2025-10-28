// Nhận dạng giọng nói (Web Speech API) - lưu ý: hỗ trợ trình duyệt còn hạn chế
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

export function startMic(langCode, inputEl) {
  if (!SR) { alert('Trình duyệt chưa hỗ trợ SpeechRecognition'); return; }
  const rec = new SR();
  rec.lang = mapLangToBCP47(langCode);
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = (e) => {
    const t = Array.from(e.results).map(r => r[0].transcript).join(' ');
    inputEl.value = t;
    inputEl.dispatchEvent(new Event('input'));
  };
  rec.onerror = (e) => console.error('SR error', e);
  rec.start();
}

export function speakText(text, targetLang) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = mapLangToBCP47(targetLang);
  window.speechSynthesis.speak(utter);
}

// map mã ISO đơn giản sang BCP-47 phổ biến
function mapLangToBCP47(code) {
  const map = { vi:'vi-VN', en:'en-US', ja:'ja-JP', ko:'ko-KR',
                zh:'zh-CN', fr:'fr-FR', de:'de-DE', es:'es-ES' };
  return map[code] || code;
}
``
