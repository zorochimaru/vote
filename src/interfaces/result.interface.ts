import { CommonFireStoreDocument } from './common-firesotre.interface';

export interface VoteItem {
  questionId: string;
  questionText: string;
  point: number;
}

export interface Result extends CommonFireStoreDocument {
  personId: string;
  voteResults: VoteItem[];
  note: string;
}
