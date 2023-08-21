import { ScreenId, SideMenu } from 'projects/shared/src/public-api';

export const sideMenus: SideMenu[] = [
  {
    menuTitle: 'Lobby',
    menuIcon: 'HouseLine.svg',
    menuIconFill: 'HouseLine-fill.svg',
    route: ScreenId.LOBBY
  },
  {
    menuTitle: 'Challenges',
    menuIcon: 'Trophy.svg',
    menuIconFill: 'Trophy-fill.svg',
    route: ScreenId.TROPHY
  },
  {
    menuTitle: 'Rewards',
    menuIcon: 'gift.svg',
    menuIconFill: 'gift-fill.svg',
    route: ScreenId.REWARDS
  },
  {
    menuTitle: 'Leaderboard',
    menuIcon: 'Crown.svg',
    menuIconFill: 'Crown-fill.svg',
    route: ScreenId.LEADERBOARD
  },
  {
    menuTitle: 'Invite & Earn',
    menuIcon: 'Sparkle.svg',
    menuIconFill: 'Sparkle-fill.svg',
    route: ScreenId.INVITE
  },
  {
    menuTitle: 'Promotions',
    menuIcon: 'Promotions.svg',
    menuIconFill: 'Promotions-fill.svg',
    route: ScreenId.PROMOTIONS
  },
  {
    menuTitle: 'My Stats',
    menuIcon: 'ChartBar.svg',
    menuIconFill: 'ChartBar-fill.svg',
    route: ScreenId.MY_STATS
  },
  {
    menuTitle: 'Hand History',
    menuIcon: 'ClockCounterClockwise.svg',
    menuIconFill: 'ClockCounterClockwise-fill.svg',
    route: ScreenId.HAND_HISTORY
  },
  {
    menuTitle: 'Replayer',
    menuIcon: 'UserRectangle.svg',
    menuIconFill: 'UserRectangle-fill.svg',
    route: ScreenId.REPLAYER
  },
  {
    menuTitle: 'Search Player',
    menuIcon: 'search-player.svg',
    menuIconFill: 'search-player-fill.svg',
    route: ScreenId.SEARCH_PLAYER
  },
  {
    menuTitle: 'Tournaments',
    menuIcon: 'UserRectangle.svg',
    menuIconFill: 'UserRectangle-fill.svg',
    route: ScreenId.TOURNAMENTS
  },
  {
    menuTitle: 'How to play',
    menuIcon: 'Question.svg',
    menuIconFill: 'Question-fill.svg',
    route: ScreenId.HOW_TO_PLAY
  },
  {
    menuTitle: 'Responsible Gaming',
    menuIcon: 'PokerChip.svg',
    menuIconFill: 'PokerChip-fill.svg',
    route: ScreenId.RESPONSIBLE_GAMING
  },
  {
    menuTitle: 'Contact Us',
    menuIcon: 'contactus.svg',
    menuIconFill: 'contactus-fill.svg',
    route: ScreenId.CONTACT_US
  }
];
