export const Paths = Object.freeze({
  assetsPath: 'assets/',
  imagePath: 'assets/images/'
});

export enum ResponsibleGameTab {
  CASH = 'cash',
  RG_CASH = 'tl',
  TOURNAMENT = 'tbl',
  SIT_N_GO = 'sbl',
  SELF_EXCLUSION = 'se',
  DEPOSIT_LIMIT = 'dl',
  INFO_FLAG = 'info',
  SUCCESS_FLAG = 'success',
  ERROR_FLAG = 'error',
  ACTIVE_TEMPLATE = 'FORM_TEMP',
  CONF_TEMPLATE = 'CONFIRMATION_TEMP',
  OTP_TEMPLATE = 'OTP_TEMP',
  DAILY_LIMIT = 'dailylimit',
  PROP_AMOUNT = 'amount',
  PROP_COUNT = 'count',
  PER_TRANSACTION = 'PER_TRANSACTION',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  SET_LIMIT = 'set_limit',
  PLAY_ALL = 'play_all',
  RESTRICT_ALL = 'restrict_all',
  SNG = 'SNG',
  BACKSPACE = 'Backspace',
  TOURNAMENT_NAME = 'TOURNAMENT',
  PER_TXN_LIMIT = 'pertxnlimit',
  WEEKLY_LIMIT = 'weeklylimit'
}

export const RESPONSIBLE_GAMING = {
  SUCCESS: 200,
  VALID_OTP: 0,
  NO_CHANGE: 1,
  NOT_VALID: 2,
  ALREADY_UPDATED: 2,
  INVALID_INPUT: 3,
  INVALID_OTP: 4,
  OTP_ATTEMPT_REACHED: 1044,
  ATTEMPT_LEFT: 0,
  MAX_LIMIT_VALUE: 500000,
  MIN_LIMIT_VALUE: 100
};

export const RG_SIT_N_GO = {
  SET_LIMIT: 1,
  PLAY_ALL: 2,
  RESTRICT_ALL: 3,
  BUY_IN_LIMIT_ZERO: 0,
  BUY_IN_LIMIT_ONE: 1,
  LIMIT_ZERO: 0,
  MIN_LIMIT: 100,
  LIMIT_SIX: 6,
  LIMIT_SEVEN: 7
};

export const RG_CASH_TAB = {
  PLAY_ALL: 'Play All (No Restrictions)',
  HOLDEM: 'holdem',
  PLO: 'plo',
  PLO5: 'plo5',
  PLO6: 'plo6',
  CRAZY: 'crazy',
  CASH_BLIND: 'blind',
  CASH_DURATION: 'duration',
  GAME_VARIANTS: ["Hold'em", 'PLO', 'PLO5', 'PLO6', 'Crazy Pineapple'],
  ERROR_FLAG: 'error',
  INFO_FLAG: 'info',
  SUCCESS_FLAG: 'success',
  CASH_LABEL: 'CASH'
};

export const NOTIFICATION_TIME = 3000;

export const REGEX_EXPRESSIONS = {
  EXTRACT_NUMBER: /(\d{2})\*{6}(\d{2})/
};

export const RegexToUnFormatAmount = {
  pattern: /\D/g,
  countPattern: /^0+(?!$)/,
  amountPattern: /[^0-9.-]+/g
};

export const MAX_LIMIT_VALUE = 99;
