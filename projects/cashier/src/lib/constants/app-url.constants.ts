export const CASHIER = {
  CASHIER_DETAILS: '/api/v1/user/account/info/cashierIonic',
  REDEEMABLE_BALANCE: '/api/v1/redeem/user/redeemableBalance',
  CASHIER_INIT_DATA: '/api/v1/website/cashierInitData',
  USER_RELEASE_UNIT: '/api/v1/user/user-release-unit',
  FAQ_LIST: '/api/v1/cms/faq/list',
  BONUSES_INFO: '/api/v1/cms/vip_terms_api',
  RELOAD_FREE_ROLL: '/api/v1/user/claim/reload-freeroll',
  TRANSACTION_HISTORY_CASH: '/api/v1/user/history/transaction',
  TRANSACTION_STATUS: '/api/v1/redeem/{redeemId}/status',
  DOWNLOAD_URL: '/api/v1/{val}?type={type}&dateRange={range}&isDownloadable=true&token={token}',
  CANCEL_REQUEST: '/api/v1/redeem/cancel',
  TICKET_OFFERS: '/api/v1/bonus/ticket-offers/offers',
  TICKET_INFO: '/api/v1/user/ticket/info',
  BONUS_HISTORY: '/api/v1/bonus/bonusExpiry/user/bonusHistory',
  PURCHASE_NOW_WITH_SUFFICIENT_BALANCE: '/api/v1/bonus/ticket-offers/claimTktOffer',
  DOWNLOAD_BONUS_URL:
    '/api/v1/bonus/bonusExpiry/user/bonusHistory?dateRange={range}&isDownload=true&token={token}',
  SCRATCH_CODE_APPLY: '/api/v1/bonus/scratchcode/scratchcodeapply',
  PURCHASE_AMOUNT_OPTIONS: '/api/v1/purchase/purchase-amount-options',
  PRE_TRANSACTION_CHECK: '/api/v1/purchase/preTransactionCheck',
  INITIATE_PURCHASE: '/api/v1/purchase/initiatePurchaseV1',
  NEW_PROFILE: '/api/v1/user/profileNew',
  KYC_DETAILS: '/api/v1/redeem/user/kyc/status',
  OFFER_LIST: '/api/v1/bonus/userText',
  APPLY_DEPOSIT_CODE: '/api/v1/bonus/code/bonusvalidate',
  WITHDRAWAL_INFO_TDS_CALC: '/api/v1/redeem/user/tds',
  REDEEM_BANK_PROCESS: '/api/v1/redeem/processApi',
  DEFAULT_BANK: '/api/v1/redeem/user/bank/default',
  WITHHELD_DEPOSIT_LIST: '/api/v1/redeem/holdAmount/userHoldAmountDetails',
  WITHHELD_POLICY: 'https://www.adda52.com/compliance',
  PAYMENT_TXN_STATUS: '/api/v1/purchase/appResponse',
  BANK_LIST: '/api/v1/redeem/user/bank/list',
  GET_SAVED_CARDS: '/api/v1/purchase/saved-cards',
  KNOW_MORE: '/api/v1/cms/faq/list?section=withdraw'
};
