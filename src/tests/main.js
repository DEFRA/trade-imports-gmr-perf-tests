import {env} from '../config/environment.js';
import {profile} from '../config/profiles.js';
import {htmlReport} from '../lib/k6-reporter-3.0.3.js';
import {textSummary} from '../lib/k6-summary-0.1.0.js';
import {check, group} from 'k6';
import http from 'k6/http';

export const options = profile;

export default function () {
  group('health checks for trade imports gmr services', function () {
    const gmrFinderResponse = http.get(
      `${env.tradeImportsGmrFinderUrl}/health`,
    );
    check(gmrFinderResponse, {'is status 200': (r) => r.status === 200});

    const gmrProcessorResponse = http.get(
      `${env.tradeImportsGmrProcessorUrl}/health`,
    );
    check(gmrProcessorResponse, {'is status 200': (r) => r.status === 200});
  });
}

export function handleSummary(data) {
  return {
    './reports/index.html': htmlReport(data),
    './reports/summary.json': JSON.stringify(data),
    stdout: textSummary(data, {indent: ' ', enableColors: true}),
  };
}
