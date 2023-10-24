import { CommonFireStoreDocument } from './common-firesotre.interface';

export interface Question extends CommonFireStoreDocument {
  question: string;
}
