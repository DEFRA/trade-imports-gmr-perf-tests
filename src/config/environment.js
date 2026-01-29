export const env = {
  // URL of Trade Imports GMR Finder service, default local
  tradeImportsGmrFinderUrl: __ENV.ENVIRONMENT
    ? `https://trade-imports-gmr-finder.${__ENV.ENVIRONMENT}.cdp-int.defra.cloud`
    : 'http://localhost:3000',
  // URL of Trade Imports GMR Processor service, default local
  tradeImportsGmrProcessorUrl: __ENV.ENVIRONMENT
    ? `https://trade-imports-gmr-finder.${__ENV.ENVIRONMENT}.cdp-int.defra.cloud`
    : 'http://localhost:3001',
};
