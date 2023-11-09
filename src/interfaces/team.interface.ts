import { Character } from '.';

export interface Team {
  name: string;
  image: string;
  orderNumber: number;
  persons: Character[];
}
