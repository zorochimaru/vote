export interface AuthUser {
  id: string;
  email: string;
  canUpload: boolean;
  role: 'cosplay' | 'k-pop';
  soloCosplayFinished?: boolean;
  teamCosplayFinished?: boolean;
  kpopFinished?: boolean;
}
