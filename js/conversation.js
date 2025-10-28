import { startMic, speakText } from './speech.js';
export function initConversation(translateText){
  const micA=document.getElementById('micA');
  const micB=document.getElementById('micB');
  const ta=document.getElementById('transcriptA');
  const tb=document.getElementById('transcriptB');
  const langA=document.getElementById('sourceLang').value;
  const langB=document.getElementById('targetLang').value;
  micA.onclick = async () => {
    const temp = document.createElement('textarea');
    startMic(langA, temp);
    const iv = setInterval(async () => {
      if (temp.value) {
        clearInterval(iv);
        ta.textContent = temp.value;
        const t = await translateText(temp.value, langA, langB);
        tb.textContent = t;
        speakText(t, langB);
      }
    }, 500);
  };
  micB.onclick = async () => {
    const temp = document.createElement('textarea');
    startMic(langB, temp);
    const iv = setInterval(async () => {
      if (temp.value) {
        clearInterval(iv);
        tb.textContent = temp.value;
        const t = await translateText(temp.value, langB, langA);
        ta.textContent = t;
        speakText(t, langA);
      }
    }, 500);
  };
}