import { delay, http, HttpResponse } from 'msw';

import { MOCK_API, MOCK_USER } from '../config';
import { checkSession } from '../guards';

export const userHandlers = [
  http.get(`${MOCK_API}/v1/me`, async () => {
    await delay();
    const sessionError = checkSession();
    if (sessionError) return sessionError;

    const { id, email, first_name, last_name } = MOCK_USER;
    return HttpResponse.json({
      id,
      email,
      first_name,
      last_name,
      name: `${first_name} ${last_name}`,
    });
  }),
];
