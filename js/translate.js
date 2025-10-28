export const LANGS = [
  { code: 'vi', name: 'Tiếng Việt' }, { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' }, { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文(简体)' }, { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' }, { code: 'es', name: 'Español' },
  // ...bổ sung
];

// ⚠️ KHÔNG đưa key thật vào đây trong sản xuất!
const OPENAI_API_KEY = window.__ENV?.OPENAI_KEY || '';

export async function translateText(text, source, target) {
  if (!OPENAI_API_KEY) throw new Error('Thiếu OPENAI_API_KEY');
  const prompt = `Translate the following ${source} text into ${target}. Keep meaning; preserve formatting.\nTEXT:\n${text}`;
  const body = {
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [
      { role: 'system', content: 'You are a professional translation engine. Deliver only the translated text.' },
      { role: 'user', content: prompt }
    ]
  };
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Authorization':'Bearer ' + OPENAI_API_KEY },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error?.message || 'API error');
  return data.choices[0].message.content.trim();
}
