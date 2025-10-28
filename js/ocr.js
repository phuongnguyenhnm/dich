import Tesseract from 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.esm.min.js';
import { translateText } from './translate.js';
export function initOCR(sourceSel,targetSel){
  const imageFile=document.getElementById('imageFile');
  const imageUrl=document.getElementById('imageUrl');
  const loadUrlBtn=document.getElementById('loadUrlBtn');
  const canvas=document.getElementById('imageCanvas');
  const ocrText=document.getElementById('ocrText');
  const ctx=canvas.getContext('2d');
  function drawImage(img){
    const maxW=canvas.clientWidth||800;
    const scale=Math.min(maxW/img.width,1);
    canvas.width=img.width*scale;
    canvas.height=img.height*scale;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
  }
  async function runOCR(img){
    ocrText.textContent='Đang nhận dạng...';
    const { data } = await Tesseract.recognize(img, sourceSel.value || 'eng', { logger: m => console.log(m) });
    ocrText.textContent = data.text;
    const translated = await translateText(data.text, sourceSel.value, targetSel.value);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
    ctx.fillStyle = '#fff';
    ctx.font = '16px system-ui';
    wrapText(ctx, translated, 12, canvas.height - 54, canvas.width - 24, 18);
  }
  function wrapText(ctx, text, x, y, maxWidth, lineHeight){
    const words = text.split(' ');
    let line = '';
    for(let n=0; n<words.length; n++){
      const testLine = line + words[n] + ' ';
      bbox = ctx.measureText(testLine);
      const width = bbox.width;
      if (width > maxWidth && n>0){
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
  imageFile.onchange = () => {
    const file = imageFile.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = async () => { drawImage(img); await runOCR(img); };
    img.src = URL.createObjectURL(file);
  };
  loadUrlBtn.onclick = () => {
    const url = imageUrl.value.trim();
    if (!url) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => { drawImage(img); await runOCR(img); };
    img.src = url;
  };
}