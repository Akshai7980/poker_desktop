export const Leaderboard = {
  SUCCESS: 200,
  NOT_REGISTER: 1003
};

export const RegexExpression = Object({
  knowMoreUrl: `^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' + 
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
    '(\\?[;&a-z\\d%_.~+=-]*)?' + 
    '(\\#[-a-z\\d_]*)?$',
    'i'`
});

export const ConstantValues = {
  TODAY: 'today',
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  LEADERBOARD: 'leaderboard',
  ALL: 'all',
  JOINED: 'joined',
  CGP: 'cgp',
  CGC: 'cgc',
  POY: 'poy',
  TOURNEY: 'tourney',
  LIVE: 'live',
  ERROR_FLAG: 'error',
  SUCCESS_FLAG: 'success'
};

export const MaxValue = {
  INTERVAL: 1000
};
