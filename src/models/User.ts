export class User {
  public username?: string;
  public email?: string;
  public emailVerified?: boolean;
  public phone?: string;
  public phoneVerified?: boolean;

  constructor(
    userAttributes: {
      username: string,
      email: string,
      email_verified: string,
      phone_number: string,
      phone_verified: string,
    },
  ) {
    if (userAttributes) {
      this.username = userAttributes.username;
      this.email = userAttributes.email;
      this.emailVerified = userAttributes.email_verified === 'true';
      this.phone = userAttributes.phone_number;
      this.phoneVerified = userAttributes.phone_verified === 'true';
    }
  }
}
