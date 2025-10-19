import { createWorker } from 'tesseract.js';

(async () => {
  const worker = await createWorker({ logger: m => console.log(m) });
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('./info.png');
  console.log(text);
  await worker.terminate();
})();