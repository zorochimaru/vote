import { CommonFireStoreDocument } from './common-firesotre.interface';

export interface Criteria extends CommonFireStoreDocument {
  name: string;
}
