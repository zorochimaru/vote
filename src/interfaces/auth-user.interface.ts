export interface AuthUser {
  id: string;
  email: string;
  canUpload: boolean;
  role: 'cosplay' | 'k-pop' | 'admin';
  soloCosplayFinished?: boolean;
  teamCosplayFinished?: boolean;
  kPopFinished?: boolean;
}
