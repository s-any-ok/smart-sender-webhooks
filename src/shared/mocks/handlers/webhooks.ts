import { delay, http, HttpResponse } from 'msw';

import { MOCK_API } from '../config';
import { mockDb } from '../db';
import { asString, checkCsrf, checkSession, readJson } from '../guards';
import { notFound, validationError } from '../responses';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const MAX_NAME_LENGTH = 255;

const toPositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const isHttpUrl = (value: string) => {
  try {
    const { protocol, hostname } = new URL(value);
    return (protocol === 'http:' || protocol === 'https:') && hostname.length > 0;
  } catch {
    return false;
  }
};

const findWebhook = (rawId: string | readonly string[] | undefined) =>
  mockDb.state.webhooks.find((webhook) => String(webhook.id) === rawId);

export const webhookHandlers = [
  http.get(`${MOCK_API}/v1/webhooks`, async ({ request }) => {
    await delay();
    const sessionError = checkSession();
    if (sessionError) return sessionError;

    const params = new URL(request.url).searchParams;
    const page = toPositiveInt(params.get('page'), 1);
    const limit = Math.min(toPositiveInt(params.get('limit'), DEFAULT_LIMIT), MAX_LIMIT);
    const search = (params.get('search') ?? '').trim().toLowerCase();

    const filtered = search
      ? mockDb.state.webhooks.filter((webhook) => webhook.name.toLowerCase().includes(search))
      : mockDb.state.webhooks;
    const offset = (page - 1) * limit;

    return HttpResponse.json({
      data: filtered.slice(offset, offset + limit),
      paging: {
        pages: { current: page, last: Math.max(1, Math.ceil(filtered.length / limit)) },
        results: { total: filtered.length, limitation: limit },
      },
    });
  }),

  http.get(`${MOCK_API}/v1/webhooks/:id`, async ({ params }) => {
    await delay();
    const sessionError = checkSession();
    if (sessionError) return sessionError;

    const webhook = findWebhook(params.id);
    return webhook ? HttpResponse.json(webhook) : notFound('Webhook not found.');
  }),

  http.put(`${MOCK_API}/v1/webhooks/:id`, async ({ request, params }) => {
    await delay();
    const csrfError = checkCsrf(request);
    if (csrfError) return csrfError;
    const sessionError = checkSession();
    if (sessionError) return sessionError;

    const webhook = findWebhook(params.id);
    if (!webhook) return notFound('Webhook not found.');

    const body = await readJson(request);
    const name = asString(body.name).trim();
    const url = asString(body.url).trim();

    const errors: Record<string, string[]> = {};
    if (!name) errors.name = ['The name field is required.'];
    else if (name.length > MAX_NAME_LENGTH) {
      errors.name = [`The name may not be greater than ${MAX_NAME_LENGTH} characters.`];
    }
    if (!url) errors.url = ['The url field is required.'];
    else if (!isHttpUrl(url)) errors.url = ['The url must be a valid URL.'];
    if (Object.keys(errors).length > 0) return validationError(errors);

    Object.assign(webhook, { name, url });
    return HttpResponse.json(webhook);
  }),
];
