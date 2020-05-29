export class User {
  avatar: string;
  name: { first: string, last: string };
  gender: string;
  role: string;
  email: string;
  mobileNumber: string;
  username: string;
  password: string;
  address: string;

  getFullName() {
    return this.name.first + ' ' + this.name.last;
  }
}