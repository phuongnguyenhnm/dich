export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/translate' && request.method === 'POST') {
      const { text, source, target } = await request.json();
      const body = {
        model: 'gpt-4o-mini',
        temperature: 0,
        messages: [
          { role: 'system', content: 'You are a professional translation engine. Deliver only the translated text.' },
          { role: 'user', content: `Translate ${source} → ${target}:\n${text}` }
        ]
      };
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify(body)
      });
      const json = await r.json();
      return new Response(JSON.stringify({ translation: json.choices[0].message.content.trim() }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response('OK');
  }
}
