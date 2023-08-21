export const Paths = Object.freeze({
  assetsPath: 'assets/',
  imagePath: 'assets/images/'
});

export const ToastTime = Object.freeze({
  NOTIFICATION: 3000,
  TOAST_TIMER: 5000,
  COUNT_DOWN_TIMER: 1000
});

export enum ScreenId {
  LOBBY = 'lobby',
  TROPHY = 'trophy',
  REWARDS = 'rewards',
  REWARDS_SHOP = 'rewards/shop',
  LEADERBOARD = 'leaderboard',
  INVITE = 'invite-earn',
  PROMOTIONS = 'promotions',
  MY_STATS = 'my-stats',
  HAND_HISTORY = 'hand-history',
  REPLAYER = 'replayer',
  HOW_TO_PLAY = 'how-to-play',
  RESPONSIBLE_GAMING = 'responsible-gaming',
  CONTACT_US = 'contact-us',
  ADD_CASH = 'addcash',
  RAZOR_PAY = 'addcash/razor-pay'
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
    INVALID_SIGNUPCODE: 1015
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

export const Cashier = {
  SUCCESS: 200,
  LAST_3_MONTHS: 1031,
  COUPON_ALREADY_USED: 1007,
  INVALID_COUPON_CODE: 1008,
  AMOUNT_INSUFFICIENT: 1025,
  MAX_LIMIT_EXCEED: 1035,
  FAILED: 1000,
  STATIC_INDEX: 1
};

export const ContactUs = {
  SUCCESS: 200,
  FAILED: 1000,
  EMAIL_NOT_VERIFIED: 419,
  FILES_REQUIRED: 1001,
  DESCRIPTION_REQUIRED: 1001
};

export const Avatar = {
  avatar: [
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

export const REGEX_EXPRESSIONS = {
  EXTRACT_NUMBER_1: /,/g,
  EXTRACT_NUMBER_2: /\s/g
};

export const CashierConstants = {
  myOffers: 'MY_OFFERS',
  enteredAmount: '5,00,000',
  ngnxPokerDesktop: 'ngxpokerdesk',
  modeOfPayment: 'online',
  default_tab: 'All',
  type: 'all',
  close: 'close',
  component: 'TransactionDetailsComponent',
  component2: 'TransactionFilterComponent',
  filter: 'filter',
  withdraw: 'withdraw',
  enterCode: 'enterCode',
  offerList: 'offerList',
  successFlag: 'success',
  errorFlag: 'error',
  confirmDialogFrom: 'CANCEL_TRANSACTION',
  cashier: 'CASHIER',
  claim_free_chips: 'CLAIM_FREE_CHIPS',
  verification: 'verification',
  verified: 'verified',
  vertical: 'vertical',
  Approved: 'Approved',
  bankDetails: 'Bank Details',
  two: '2',
  three: '3',
  pending: 'pending',
  cancelled: 'cancelled',
  transferred: 'transferred',
  approved: 'approved',
  pending_bank: 'pending_bank',
  failed: 'failed',
  requestReceived: 'Request Received',
  remark: 'May take upto 2 hours',
  remarkMax: 'May take upto 2 hours',
  approval: 'Approval*',
  approvalCap: 'Approval',
  bankTransfer: 'Bank Transfer',
  failedCap: 'Failed',
  bankPending: 'Pending with your Bank',
  cancelledCap: 'Cancelled',
  hold: 'On Hold',
  redeemVoucher: 'REDEEM_VOUCHER',
  kycCompleted: 'KYC_COMPLETED'
};

export const ContactUsConstants = {
  close: 'close',
  successFlag: 'success',
  errorFlag: 'error',
  verification: 'verification',
  verified: 'verified'
};
