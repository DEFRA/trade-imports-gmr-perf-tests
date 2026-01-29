const config = {
  load: {
    scenarios: {
      // n iterations of the user journey over 10 mins (average volume of traffic)
      journey: {
        executor: 'constant-arrival-rate',
        duration: '10m',
        preAllocatedVUs: 1,
        rate: 10,
      },
    },
    thresholds: {
      http_req_duration: ['p(90)<2500'],
      http_req_failed: ['rate<0.01'],
    },
  },
  stress: {
    scenarios: {
      // n iterations of the user journey over 10 mins (average volume of traffic) multiplied by a factor of n
      journey: {
        executor: 'constant-arrival-rate',
        duration: '10m',
        preAllocatedVUs: 1,
        rate: 10,
      },
    },
    thresholds: {
      http_req_duration: ['p(90)<2500'],
      http_req_failed: ['rate<0.01'],
    },
  },
  spike: {
    scenarios: {
      // Ramp up to 100 virtual users in 1 min with each virtual user completing as many iterations of the user journey as possible
      journey: {
        executor: 'ramping-vus',
        stages: [
          {duration: '1m', target: 100},
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
      journey: {
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
