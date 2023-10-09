import { CommonFireStoreDocument } from './common-firesotre.interface';

export interface VoteItem {
  criteriaId: string;
  point: number;
}

export interface VoteResult extends CommonFireStoreDocument {
  personId: string;
  voteResults: VoteResult[];
  note: string;
}
