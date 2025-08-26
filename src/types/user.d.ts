export interface User {
  userId: string;
  userName: string;
  userRole: string;
  userPassword: string;
  createdAt?: Date;
  updateAt?: Date;
}
