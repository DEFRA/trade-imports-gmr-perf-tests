import {env} from '../config/environment.js';
import {profile} from '../config/profiles.js';
import {customsDeclarations, importPreNotifications} from '../data/loader.js';
import {htmlReport} from '../lib/k6-reporter-3.0.3.js';
import {textSummary} from '../lib/k6-summary-0.1.0.js';
import {check, group} from 'k6';
import encoding from 'k6/encoding';
import http from 'k6/http';

export const options = profile;

const encodedCredentials = encoding.b64encode('test:test');

export function setup() {
  const response = http.del(
    `${env.tradeImportsGmrFinderUrl}/polling-queue/items`,
    null,
    {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    },
  );
  check(response, {'is status 200': (r) => r.status === 200});
}

export function customsDeclaration() {
  group('send a customs declaration', function () {
    const fixture =
      customsDeclarations[
        Math.floor(Math.random() * customsDeclarations.length)
      ];
    const body = JSON.stringify(fixture);

    const gmrFinderResponse = http.post(
      `${env.tradeImportsGmrFinderUrl}/consumers/data-events-queue`,
      body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
          ResourceType: 'CustomsDeclaration',
        },
      },
    );
    check(gmrFinderResponse, {'is status 202': (r) => r.status === 202});

    const gmrProcessorResponse = http.post(
      `${env.tradeImportsGmrProcessorUrl}/consumers/data-events-queue`,
      body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
          ResourceType: 'CustomsDeclaration',
        },
      },
    );
    check(gmrProcessorResponse, {'is status 202': (r) => r.status === 202});
  });
}

export function importPreNotification() {
  group('send an import pre notification', function () {
    const fixture =
      importPreNotifications[
        Math.floor(Math.random() * importPreNotifications.length)
      ];
    const body = JSON.stringify(fixture);

    const gmrFinderResponse = http.post(
      `${env.tradeImportsGmrFinderUrl}/consumers/data-events-queue`,
      body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
          ResourceType: 'ImportPreNotification',
        },
      },
    );
    check(gmrFinderResponse, {'is status 202': (r) => r.status === 202});

    const gmrProcessorResponse = http.post(
      `${env.tradeImportsGmrProcessorUrl}/consumers/data-events-queue`,
      body,
      {
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
          ResourceType: 'ImportPreNotification',
        },
      },
    );
    check(gmrProcessorResponse, {'is status 202': (r) => r.status === 202});
  });
}

export function handleSummary(data) {
  return {
    './reports/index.html': htmlReport(data),
    './reports/summary.json': JSON.stringify(data),
    stdout: textSummary(data, {indent: ' ', enableColors: true}),
  };
}
