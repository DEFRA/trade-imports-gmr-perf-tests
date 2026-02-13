import {SharedArray} from 'k6/data';

export const customsDeclarations = new SharedArray(
  'customs-declarations',
  function () {
    return JSON.parse(open('./customs-declarations.json'));
  },
);

export const importPreNotifications = new SharedArray(
  'import-pre-notifications',
  function () {
    return JSON.parse(open('./import-pre-notifications.json'));
  },
);
