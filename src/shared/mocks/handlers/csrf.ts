import { delay, http, HttpResponse } from 'msw';

import { MOCK_API } from '../config';
import { mockDb } from '../db';

export const csrfHandlers = [
  http.get(`${MOCK_API}/csrf`, async () => {
    await delay();
    return new HttpResponse(null, {
      status: 204,
      headers: { 'X-CSRF-TOKEN': mockDb.state.csrfToken },
    });
  }),
];
