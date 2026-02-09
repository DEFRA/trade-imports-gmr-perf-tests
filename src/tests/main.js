import {env} from '../config/environment.js';
import {profile} from '../config/profiles.js';
import {htmlReport} from '../lib/k6-reporter-3.0.3.js';
import {textSummary} from '../lib/k6-summary-0.1.0.js';
import {check, group} from 'k6';
import http from 'k6/http';

export const options = profile;

export function customsDeclaration() {
  group('send a customs declaration', function () {
    const gmrFinderResponse = http.post(
      `${env.tradeImportsGmrFinderUrl}/consumers/data-events-queue`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ResourceType: 'CustomsDeclaration',
        },
      },
    );
    console.log(gmrFinderResponse);
    check(gmrFinderResponse, {'is status 200': (r) => r.status === 202});

    const gmrProcessorResponse = http.post(
      `${env.tradeImportsGmrProcessorUrl}/consumers/data-events-queue`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ResourceType: 'CustomsDeclaration',
        },
      },
    );
    console.log(gmrProcessorResponse);
    check(gmrProcessorResponse, {'is status 200': (r) => r.status === 202});
  });
}

export function importPreNotification() {
  group('send an import pre notification', function () {
    const gmrFinderResponse = http.post(
      `${env.tradeImportsGmrFinderUrl}/consumers/data-events-queue`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ResourceType: 'ImportPreNotification',
        },
      },
    );
    console.log(gmrFinderResponse);
    check(gmrFinderResponse, {'is status 200': (r) => r.status === 202});

    const gmrProcessorResponse = http.post(
      `${env.tradeImportsGmrProcessorUrl}/consumers/data-events-queue`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          ResourceType: 'ImportPreNotification',
        },
      },
    );
    console.log(gmrProcessorResponse);
    check(gmrProcessorResponse, {'is status 200': (r) => r.status === 202});
  });
}

export function handleSummary(data) {
  return {
    './reports/index.html': htmlReport(data),
    './reports/summary.json': JSON.stringify(data),
    stdout: textSummary(data, {indent: ' ', enableColors: true}),
  };
}
