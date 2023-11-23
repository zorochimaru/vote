export interface Result {
  personId: string;
  personNickname: string;
  results: Rate[];
}

export interface Rate {
  criteriaId: string;
  criteria: string;
  value: number;
}
