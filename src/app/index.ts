import { queryClient } from './providers/queryClient';
import { setupHttpClient } from './providers/setupHttpClient';

export { App } from './App';

export const bootstrap = (): void => setupHttpClient(queryClient);
