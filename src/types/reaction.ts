export type ReactionType = 'suki' | 'nakeru' | 'ensou';

export interface Reactions {
  suki: number;
  nakeru: number;
  ensou: number;
}

export interface UserReactions {
  suki: boolean;
  nakeru: boolean;
  ensou: boolean;
}

export interface ReactionData {
  reactions: Reactions;
  userReactions: UserReactions;
}