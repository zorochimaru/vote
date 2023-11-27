export interface AuthUser {
  id: string;
  email: string;
  canUpload: boolean;
  role: 'cosplay' | 'kPop' | 'admin';
  soloCosplayFinished?: boolean;
  teamCosplayFinished?: boolean;
  kPopFinished?: boolean;
}
