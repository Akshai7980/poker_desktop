export interface RAFBannerResponse {
  v2_poker_raf: V2PokerRaf[];
}

export interface V2PokerRaf {
  id: string;
  name: string;
  featureName: string;
  url: string;
  fields: Fields;
}

export interface Fields {
  for_desktop: ForDesktop;
}

export interface ForDesktop {
  url: string;
}
