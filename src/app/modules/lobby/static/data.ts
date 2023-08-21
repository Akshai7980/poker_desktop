import { CashGamesHoldemModel } from 'projects/shared/src/lib/models/common/lobby.model';

export const jsonString: CashGamesHoldemModel[] = [
  {
    name: 'Grind Adda Evening',
    blindsNumerator: 0.1,
    blindsDenominator: 1.25,
    minBuyIn: 2,
    players: 37,
    tablesCount: 24,
    holdemGameDetails: {
      gameDetails: [
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 11,
          totalPlayers: 12,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 4,
          totalPlayers: 8,
          isRIT: false,
          isStraddle: false,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 2,
          totalPlayers: 8,
          isRIT: true,
          isStraddle: false,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 8,
          totalPlayers: 8,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: false,
          isFastFold: false
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 4,
          totalPlayers: 10,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        }
      ]
    },
    isRecommendedTable: true,
    isSelected: false,
    isFavorite: false,
    isRecentlyPlayed: true,
    id: 1,
    rRingVariant: 'Hold’em'
  },
  {
    name: 'Beginner’sTable',
    blindsNumerator: 0.5,
    blindsDenominator: 1,
    minBuyIn: 10,
    players: 26,
    tablesCount: 16,
    holdemGameDetails: {
      gameDetails: [
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 4,
          totalPlayers: 8,
          isRIT: false,
          isStraddle: false,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 8,
          totalPlayers: 8,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 4,
          totalPlayers: 10,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        }
      ]
    },
    isRecommendedTable: true,
    isSelected: false,
    isFavorite: true,
    id: 2,
    rRingVariant: 'Hold’em'
  },
  {
    name: 'Hold’emBluffDeep',
    blindsNumerator: 100,
    blindsDenominator: 200,
    minBuyIn: 2500,
    players: 44,
    tablesCount: 9,
    holdemGameDetails: {
      gameDetails: [
        {
          avgStacks: '1,30,000',
          buyInNumerator: 10,
          buyInDenominator: 40,
          joinedPlayers: 6,
          totalPlayers: 6,
          isRIT: true,
          isStraddle: true,
          isFastFold: false
        },
        {
          avgStacks: '1,30,000',
          buyInNumerator: '2,500',
          buyInDenominator: '5,000',
          joinedPlayers: 6,
          totalPlayers: 6,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        },
        {
          avgStacks: '25,000',
          buyInNumerator: '500',
          buyInDenominator: '2500',
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: false,
          isFastFold: false
        },
        {
          avgStacks: '10,000',
          buyInNumerator: '1,250',
          buyInDenominator: '3,750',
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: false,
          isFastFold: false
        },
        {
          avgStacks: '9,500',
          buyInNumerator: '2,500',
          buyInDenominator: '7,500',
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: true,
          isFastFold: false
        },
        {
          avgStacks: '8750',
          buyInNumerator: '5k',
          buyInDenominator: '20k',
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: true,
          isFastFold: false
        },
        {
          avgStacks: '8750',
          buyInNumerator: '5k',
          buyInDenominator: '20k',
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: true,
          isFastFold: false
        },
        {
          avgStacks: '8750',
          buyInNumerator: '5k',
          buyInDenominator: '20k',
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: true,
          isFastFold: false
        },
        {
          avgStacks: '8750',
          buyInNumerator: '5k',
          buyInDenominator: '20k',
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: true,
          isFastFold: false
        }
      ]
    },
    isRecommendedTable: true,
    isSelected: true,
    isFavorite: true,
    id: 3,
    rRingVariant: 'Hold’em'
  },
  {
    name: 'Hold’emSuitedDeep',
    blindsNumerator: 10,
    blindsDenominator: 25,
    minBuyIn: 500,
    players: 24,
    tablesCount: 12,
    holdemGameDetails: {
      gameDetails: [
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 11,
          totalPlayers: 12,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 4,
          totalPlayers: 8,
          isRIT: false,
          isStraddle: false,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 2,
          totalPlayers: 8,
          isRIT: true,
          isStraddle: false,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 8,
          totalPlayers: 8,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: false,
          isFastFold: false
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 4,
          totalPlayers: 10,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 11,
          totalPlayers: 12,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 4,
          totalPlayers: 8,
          isRIT: false,
          isStraddle: false,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 2,
          totalPlayers: 8,
          isRIT: true,
          isStraddle: false,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 8,
          totalPlayers: 8,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 1,
          totalPlayers: 4,
          isRIT: true,
          isStraddle: false,
          isFastFold: false
        },
        {
          avgStacks: 22,
          buyInNumerator: 14,
          buyInDenominator: 56.7,
          joinedPlayers: 4,
          totalPlayers: 10,
          isRIT: false,
          isStraddle: true,
          isFastFold: true
        }
      ]
    },
    isRecommendedTable: true,
    isSelected: false,
    isFavorite: false,
    id: 4,
    rRingVariant: 'Hold’em'
  },
  {
    name: 'Omaha6 Suited Dee..',
    blindsNumerator: 0.5,
    blindsDenominator: 1,
    minBuyIn: '50/100',
    players: '4/6',
    tablesCount: 2,
    holdemGameDetails: {
      gameDetails: [
        {
          avgStacks: 134,
          buyInNumerator: 50,
          buyInDenominator: 0,
          joinedPlayers: 6,
          totalPlayers: 0,
          isRIT: true,
          isStraddle: false,
          isFastFold: false
        },
        {
          avgStacks: 134,
          buyInNumerator: 50,
          buyInDenominator: 0,
          joinedPlayers: 6,
          totalPlayers: 0,
          isRIT: true,
          isStraddle: false,
          isFastFold: false
        }
      ]
    },
    isRecommendedTable: false,
    isSelected: false,
    isFavorite: false,
    id: 5,
    rRingVariant: 'PLO 6'
  },
  {
    name: 'Omaha6 Trips RIT',
    blindsNumerator: 1,
    blindsDenominator: 2,
    minBuyIn: '125/500',
    players: '6/6',
    tablesCount: 2,
    holdemGameDetails: {
      gameDetails: [
        {
          avgStacks: 134,
          buyInNumerator: 50,
          buyInDenominator: 0,
          joinedPlayers: 6,
          totalPlayers: 0,
          isRIT: true,
          isStraddle: false,
          isFastFold: false
        },
        {
          avgStacks: 134,
          buyInNumerator: 50,
          buyInDenominator: 0,
          joinedPlayers: 6,
          totalPlayers: 0,
          isRIT: true,
          isStraddle: false,
          isFastFold: false
        }
      ]
    },
    isRecommendedTable: false,
    isSelected: false,
    isFavorite: false,
    id: 5,
    rRingVariant: 'PLO 6'
  },
  {
    name: 'Omaha6 Pockets RIT',
    blindsNumerator: 1,
    blindsDenominator: 2,
    minBuyIn: '250/1k',
    players: '4/6',
    tablesCount: 6,
    holdemGameDetails: {
      gameDetails: []
    },
    isRecommendedTable: false,
    isSelected: false,
    isFavorite: false,
    id: 5,
    rRingVariant: 'PLO 6'
  },
  {
    name: 'Omaha6 Suited RIT',
    blindsNumerator: 10,
    blindsDenominator: 25,
    minBuyIn: '625/2,500',
    players: '6/6',
    tablesCount: 12,
    holdemGameDetails: {
      gameDetails: []
    },
    isRecommendedTable: false,
    isSelected: false,
    isFavorite: false,
    id: 5,
    rRingVariant: 'PLO 6'
  },
  {
    name: 'Omaha6 Master',
    blindsNumerator: 100,
    blindsDenominator: 200,
    minBuyIn: '8k/20k',
    players: '4/6',
    tablesCount: 10,
    holdemGameDetails: {
      gameDetails: []
    },
    isRecommendedTable: false,
    isSelected: false,
    isFavorite: false,
    id: 5,
    rRingVariant: 'PLO 6'
  }
];
