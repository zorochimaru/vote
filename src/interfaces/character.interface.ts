import { RegistrationType } from './registration-type.enum';

export interface Character {
  orderNumber: number;
  name: string;
  fandom: string;
  fandomType: string;
  characterName: string;
  costumeType: string;
  image: string;
  registrationType: RegistrationType;
}
