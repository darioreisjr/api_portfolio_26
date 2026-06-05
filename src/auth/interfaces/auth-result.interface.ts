export interface IAuthResult {
  accessToken: string;
  token: string;
  tokenType: 'Bearer';
  expiresIn: number;
}
