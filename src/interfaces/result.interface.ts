export interface Result {
  personId: string;
  results: Rate[];
}

export interface Rate {
  criteriaId: string;
  value: number;
}
