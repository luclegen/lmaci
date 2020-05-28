export class User {
  avatar: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  email: string;
  mobileNumber: string;
  username: string;
  password: string;
  address: string;

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }
}