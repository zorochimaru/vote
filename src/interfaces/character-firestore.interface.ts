import { Character } from '.';
import { CommonFireStoreDocument } from './common-firesotre.interface';

export interface CharacterFirestore extends Character, CommonFireStoreDocument {}
