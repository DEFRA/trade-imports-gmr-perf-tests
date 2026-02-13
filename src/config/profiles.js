const BTMS_RATE = 10000;
const IPAFFS_RATE = 22000;

const config = {
  load: {
    scenarios: {
      // 10000 (daily) iterations of the user journey (average volume of traffic), averaged over 10 mins
      btms: {
        exec: 'customsDeclaration',
        executor: 'constant-arrival-rate',
        duration: '10m',
        preAllocatedVUs: __ENV.PRE_ALLOCATED_VUS || 1,
        rate: BTMS_RATE,
        timeUnit: '1d',
      },
      // 22000 (daily) iterations of the user journey (average volume of traffic), averaged over 10 mins
      ipaffs: {
        exec: 'importPreNotification',
        executor: 'constant-arrival-rate',
        duration: '10m',
        preAllocatedVUs: __ENV.PRE_ALLOCATED_VUS || 1,
        rate: IPAFFS_RATE,
        timeUnit: '1d',
      },
    },
    thresholds: {
      http_req_duration: ['p(90)<2500'],
      http_req_failed: ['rate<0.01'],
    },
  },
  stress: {
    scenarios: {
      // 10000 (daily) iterations of the user journey (average volume of traffic) multiplied by STRESS_FACTOR (default 100), averaged over 10 mins
      btms: {
        exec: 'customsDeclaration',
        executor: 'constant-arrival-rate',
        duration: '10m',
        preAllocatedVUs: __ENV.PRE_ALLOCATED_VUS || 3,
        rate: BTMS_RATE * (__ENV.STRESS_FACTOR || 100),
        timeUnit: '1d',
      },
      // 22000 (daily) iterations of the user journey (average volume of traffic) multiplied by STRESS_FACTOR (default 100), averaged over 10 mins
      ipaffs: {
        exec: 'importPreNotification',
        executor: 'constant-arrival-rate',
        duration: '10m',
        preAllocatedVUs: __ENV.PRE_ALLOCATED_VUS || 3,
        rate: IPAFFS_RATE * (__ENV.STRESS_FACTOR || 100),
        timeUnit: '1d',
      },
    },
    thresholds: {
      http_req_duration: ['p(90)<2500'],
      http_req_failed: ['rate<0.01'],
    },
  },
  spike: {
    scenarios: {
      // Ramp up to SPIKE_VUS (default 100) virtual users in 1 min with each virtual user completing as many iterations of the user journey as possible
      btms: {
        exec: 'customsDeclaration',
        executor: 'ramping-vus',
        stages: [
          {duration: '1m', target: 1 * (__ENV.SPIKE_VUS || 100)},
          {duration: '30s', target: 0},
        ],
      },
      // Ramp up to SPIKE_VUS (default 100) virtual users in 1 min with each virtual user completing as many iterations of the user journey as possible
      ipaffs: {
        exec: 'importPreNotification',
        executor: 'ramping-vus',
        stages: [
          {duration: '1m', target: 1 * (__ENV.SPIKE_VUS || 100)},
          {duration: '30s', target: 0},
        ],
      },
    },
    thresholds: {
      http_req_duration: ['p(90)<2500'],
      http_req_failed: ['rate<0.01'],
    },
  },
  smoke: {
    scenarios: {
      // 1 iteration of the user journey for validation purposes
      btms: {
        exec: 'customsDeclaration',
        executor: 'per-vu-iterations',
        vus: 1,
        iterations: 1,
      },
      // 1 iteration of the user journey for validation purposes
      ipaffs: {
        exec: 'importPreNotification',
        executor: 'per-vu-iterations',
        vus: 1,
        iterations: 1,
      },
    },
    thresholds: {
      http_req_duration: ['p(90)<2500'],
      http_req_failed: ['rate<0.01'],
    },
  },
};

export const profile = config[__ENV.PROFILE] || config['smoke'];
