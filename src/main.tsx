import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App, bootstrap } from 'src/app';

async function main() {
  const { startMockWorker } = await import('src/shared/mocks');
  await startMockWorker();
  bootstrap();

  const root = document.getElementById('root');
  if (!root) throw new Error('#root element is missing');

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void main();
