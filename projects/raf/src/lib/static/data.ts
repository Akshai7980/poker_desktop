import {
  HeaderType,
  Languages,
  LeaderBoardMonthData,
  PayoutStatement,
  ReferralTable
} from '../models/models';

export const activeHeader: HeaderType[] = [
  { title: 'username', isSorting: true },
  { title: 'name', isSorting: true },
  { title: 'mobile number', isSorting: false },
  { title: 'registered on', isSorting: true },
  { title: 'pgp earned', isSorting: true },
  { title: 'last played', isSorting: true },
  { title: 'status', isSorting: true },
  { title: 'remind', isSorting: false }
];

export const activeTableData: ReferralTable[] = [
  {
    icon: 'img-icon1.svg',
    username: 'NishantDawn',
    isCampaign: true,
    name: 'Nishant Prajapati',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '10,000',
    last_played: '4 days ago',
    status: 'Active',
    remind: true
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: true,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '5,000',
    last_played: '20 days ago',
    status: 'Active',
    remind: true
  },
  {
    icon: 'img-icon2.png',
    username: 'Bidyut001',
    isCampaign: true,
    name: 'Bidyut Bera',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '10',
    last_played: '10 days ago',
    status: 'Active',
    remind: false
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: false,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '5,000',
    last_played: '20 days ago',
    status: 'Active',
    remind: false
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: false,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '5,000',
    last_played: '20 days ago',
    status: 'Active',
    remind: false
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: true,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '5,000',
    last_played: '20 days ago',
    status: 'Active',
    remind: false
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: true,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '5,000',
    last_played: '20 days ago',
    status: 'Active',
    remind: false
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: true,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '5,000',
    last_played: '20 days ago',
    status: 'Active',
    remind: false
  }
];

export const inactiveHeader: HeaderType[] = [
  { title: 'username', isSorting: true },
  { title: 'name', isSorting: true },
  { title: 'mobile number', isSorting: false },
  { title: 'registered on', isSorting: true },
  { title: 'hands played', isSorting: true },
  { title: 'status', isSorting: true },
  { title: 'remind', isSorting: false }
];

export const droppedHeader: HeaderType[] = [
  { title: 'username', isSorting: true },
  { title: 'name', isSorting: true },
  { title: 'mobile number', isSorting: false },
  { title: 'registered on', isSorting: true },
  { title: 'pgp earned', isSorting: true },
  { title: 'hands played', isSorting: true },
  { title: 'status', isSorting: true }
];

export const inActiveTableData: ReferralTable[] = [
  {
    icon: 'img-icon1.svg',
    username: 'NishantDawn',
    isCampaign: true,
    name: 'Nishant Prajapati',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    hands_played: '4',
    total_hands: '10',
    status: 'Deposited',
    remind: true
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: true,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    hands_played: '6',
    total_hands: '10',
    status: 'Non Depositer',
    remind: true
  },
  {
    icon: 'img-icon2.png',
    username: 'Bidyut001',
    isCampaign: true,
    name: 'Bidyut Bera',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    hands_played: '8',
    total_hands: '10',
    status: 'Deposited',
    remind: true
  },
  {
    icon: 'img-icon1.svg',
    username: 'NishantDawn',
    isCampaign: true,
    name: 'Nishant Prajapati',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    hands_played: '',
    total_hands: '',
    status: 'Deposited',
    remind: true
  },
  {
    icon: 'img-icon2.png',
    username: 'Bidyut001',
    isCampaign: true,
    name: 'Bidyut Bera',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    hands_played: '',
    total_hands: '',
    status: 'Deposited',
    remind: true
  }
];

export const droppedTableData: ReferralTable[] = [
  {
    icon: 'img-icon1.svg',
    username: 'NishantDawn',
    isCampaign: true,
    name: 'Nishant Prajapati',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '10',
    hands_played: '0',
    total_hands: '10',
    status: 'Inactive'
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: true,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '',
    hands_played: '4',
    total_hands: '10',
    status: 'Inactive'
  },
  {
    icon: 'img-icon2.png',
    username: 'Bidyut001',
    isCampaign: true,
    name: 'Bidyut Bera',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '',
    hands_played: '4',
    total_hands: '10',
    status: 'Inactive'
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: true,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '10',
    hands_played: '0',
    total_hands: '10',
    status: 'Inactive'
  },
  {
    icon: 'img-icon1.svg',
    username: 'kavil123',
    isCampaign: true,
    name: 'Avineesh',
    mobile_number: '9XXXXX8347',
    registered_on: '05 Jun, ‘23',
    pgp_earned: '',
    hands_played: '4',
    total_hands: '10',
    status: 'Inactive'
  }
];

export const payoutStatementData: PayoutStatement[] = [
  {
    date: '02 Jun, ‘23',
    cash: '₹ 95,000',
    bonus: '2,000',
    bonusType: 'IB',
    tickets: '12',
    isInfo: true
  },
  {
    date: '02 Jun, ‘23',
    cash: '₹ 95,000',
    bonus: '2,000',
    bonusType: 'IB',
    tickets: '12',
    isInfo: true
  },
  {
    date: '02 Jun, ‘23',
    bonus: '2,000',
    bonusType: 'IB',
    isInfo: false
  },
  {
    date: '02 Jun, ‘23',
    bonus: '3,000',
    bonusType: 'TB',
    isInfo: false
  },
  {
    date: '02 Jun, ‘23',
    cash: '₹ 9000'
  },
  {
    date: '02 Jun, ‘23',
    tickets: '5'
  },
  {
    date: '02 Jun, ‘23',
    crowns: '200'
  }
];
export const supportedLanguages: Languages[] = [
  {
    name: 'English',
    shortCode: 'en'
  },
  {
    name: 'Hindi',
    shortCode: 'hi'
  }
];
export const leaderBoardMonthData: LeaderBoardMonthData[] = [
  {
    rank: 1,
    username: 'Avineesh',
    points: 226
  },
  {
    rank: 2,
    username: 'sycamorevan',
    points: 5000
  },
  {
    rank: 3,
    username: 'minlunch',
    points: 4000
  },
  {
    rank: 4,
    username: 'minlunch',
    points: 2000
  },
  {
    rank: 5,
    username: 'minlunch',
    points: 2000
  },
  {
    rank: 5,
    username: 'minlunch',
    points: 2000
  },
  {
    rank: 5,
    username: 'minlunch',
    points: 2000
  },
  {
    rank: 5,
    username: 'minlunch',
    points: 2000
  }
];
