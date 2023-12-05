import { CommonFireStoreDocument } from '.';

export interface BasicLibFirestore extends CommonFireStoreDocument {
  label: string;
  order: number;
}
