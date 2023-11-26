import { CommonFireStoreDocument } from '.';

export interface BasicLibFirestore extends CommonFireStoreDocument {
  label: string;
  value: string;
  order: number;
}
