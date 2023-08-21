export const Paths = Object.freeze({
  assetsPath: 'assets/',
  imagePath: 'assets/images/profile/'
});

export const ToastTime = Object.freeze({
  NOTIFICATION: 3000,
  ONESECOND: 1000,
  HALFSECOND: 500,
  TIME_LEFT_100: 100
});

export enum ScreenId {
  LOBBY = 'lobby',
  TROPHY = 'trophy',
  REWARDS = 'rewards',
  REWARDS_SHOP = 'rewards/shop',
  LEADERBOARDS = 'leaderboards',
  INVITE = 'invite-earn',
  PROMOTIONS = 'promotions',
  MY_STATS = 'my-stats',
  HAND_HISTORY = 'hand-history',
  REPLAYER = 'replayer',
  HOW_TO_PLAY = 'how-to-play',
  RESPONSIBLE_GAMING = 'responsible-gaming',
  CONTACT_US = 'contact-us',
  ADD_CASH = 'addcash'
}

export const APIResponseCode = Object.freeze({
  AUTH: {
    INVALID_CREDENTIALS: 1018,
    INCORRECT_OTP: 1006,
    SUCCESS: 200,
    MULTIPLE_ATTEMPTS: 1036,
    ACCOUNT_NOT_FOUND: 1012,
    ACCOUNT_BLOCKED: 1025,
    REGION_BLOCKED: 502,
    DEVICE_RGISTER_LIMIT: 1050,
    INVALID_DEVICEID: 1001,
    USERNAME_EXIST: 1022,
    INVALID_PROMOCODE: 1140,
    DISPUTE_RAISED_SUCESS: 1032,
    INVALID_SIGNUPCODE: 1015,
    RESTRICTED: 1116,
    INCORRECT_PASSWORD: 1008
  }
});

export const ProfileResponseCode = Object.freeze({
  SUCCESS: 200
});

export const APIResponseCodeProfileDetails = Object.freeze({
  PROFILE_DETAILS: {
    SUCCESS: 200,
    NUMBER_ALREADY_EXIST: 1021,
    ATTEMPT_LIMIT_REACHED: 1044,
    ENTER_CORRECT_OTP: 1006,
    KYC_REJECTED: 1077
  }
});
export const APIResponseCodeHandHistory = Object.freeze({
  HAND_HISTORY: {
    INVALID_CREDENTIALS: 1018,
    INCORRECT_OTP: 1006,
    LOGOUT_SUCCESS: 200,
    MULTIPLE_ATTEMPTS: 1036,
    ACCOUNT_NOT_FOUND: 1012,
    ACCOUNT_BLOCKED: 1025,
    REGION_BLOCKED: 502,
    GET_HISTORY: 202
  }
});

export const Avatar = {
  avatars: [
    'avatar1',
    'avatar2',
    'avatar3',
    'avatar4',
    'avatar5',
    'avatar6',
    'avatar7',
    'avatar8',
    'avatar9',
    'avatar10',
    'avatar11',
    'avatar12',
    'avatar13',
    'avatar14',
    'avatar15',
    'avatar16',
    'avatar17',
    'avatar18',
    'avatar19',
    'avatar20',
    'avatar21',
    'avatar22',
    'avatar23',
    'avatar24',
    'avatar25',
    'avatar26'
  ]
};

export const MAX_VALUE = 999;

export const MAX_LIMIT_VALUE = 99;

export const SettingsConstants = {
  HOT_KEYS_DROPDOWN_LIST: [
    {
      actionTxt: 'Fold',
      character: '',
      keyName: 'ACTION_FOLD'
    },
    {
      actionTxt: 'Check/Call',
      character: '',
      keyName: 'ACTION_CHECK_CALL'
    },
    {
      actionTxt: 'Bet/Raise',
      character: '',
      keyName: 'ACTION_BET_RAISE'
    },
    {
      actionTxt: 'Bet/Raise Shortcut Button 1',
      character: '',
      keyName: 'ACTION_BET_RAISE_BUTTON_1'
    },
    {
      actionTxt: 'Bet/Raise Shortcut Button 2',
      character: '',
      keyName: 'ACTION_BET_RAISE_BUTTON_2'
    },
    {
      actionTxt: 'Bet/Raise Shortcut Button 3',
      character: '',
      keyName: 'ACTION_BET_RAISE_BUTTON_3'
    },
    {
      actionTxt: 'Bet/Raise Shortcut Button 4',
      character: '',
      keyName: 'ACTION_BET_RAISE_BUTTON_4'
    },
    {
      actionTxt: 'Bet/Raise Shortcut Button 5',
      character: '',
      keyName: 'ACTION_BET_RAISE_BUTTON_5'
    },
    {
      actionTxt: 'Bet/Raise Shortcut Button 6',
      character: '',
      keyName: 'ACTION_BET_RAISE_BUTTON_6'
    },
    {
      actionTxt: 'Bet/Raise Shortcut Button 7',
      character: '',
      keyName: 'ACTION_BET_RAISE_BUTTON_7'
    },
    {
      actionTxt: 'Set Bet/Raise Amount to Shortcut Button 1',
      character: '',
      keyName: 'SET_AMOUNT_BET_RAISE_BUTTON_1'
    },
    {
      actionTxt: 'Set Bet/Raise Amount to Shortcut Button 2',
      character: '',
      keyName: 'SET_AMOUNT_BET_RAISE_BUTTON_2'
    },
    {
      actionTxt: 'Set Bet/Raise Amount to Shortcut Button 3',
      character: '',
      keyName: 'SET_AMOUNT_BET_RAISE_BUTTON_3'
    },
    {
      actionTxt: 'Set Bet/Raise Amount to Shortcut Button 4',
      character: '',
      keyName: 'SET_AMOUNT_BET_RAISE_BUTTON_4'
    },
    {
      actionTxt: 'Set Bet/Raise Amount to Shortcut Button 5',
      character: '',
      keyName: 'SET_AMOUNT_BET_RAISE_BUTTON_5'
    },
    {
      actionTxt: 'Set Bet/Raise Amount to Shortcut Button 6',
      character: '',
      keyName: 'SET_AMOUNT_BET_RAISE_BUTTON_6'
    },
    {
      actionTxt: 'Set Bet/Raise Amount to Shortcut Button 7',
      character: '',
      keyName: 'SET_AMOUNT_BET_RAISE_BUTTON_7'
    },
    {
      actionTxt: 'Set Bet/Raise Amount - Slider(Increase)',
      character: '',
      keyName: 'SET_AMOUNT_BET_RAISE_SLIDER_INC'
    },
    {
      actionTxt: 'Set Bet/Raise Amount - Slider(Decrease)',
      character: '',
      keyName: 'SET_AMOUNT_BET_RAISE_SLIDER_DEC'
    }
  ]
};

export const IS_VERIFIED = 'verified';
