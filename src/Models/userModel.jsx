class User {
  constructor(
    id,
    firstName,
    lastName,
    emailAddress,
    username,
    password,
    profileDescription,
    profileImageUrl,
    createdAt
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailAddress = emailAddress;
    this.username = username;
    this.password = password;
    this.profileDescription = profileDescription;
    this.profileImageUrl = profileImageUrl;
    this.createdAt = createdAt;
  }

  static fromJSON(map) {
    return new User(
      map.id,
      map.first_name,
      map.last_name,
      map.email_address,
      map.username,
      map.password,
      map.profile_description,
      map.profile_image_url,
      map.created_at
    );
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      email_address: this.emailAddress,
      username: this.username,
      password: this.password,
      profile_description: this.profileDescription,
      profile_image_url: this.profileImageUrl,
      created_at: this.createdAt,
    };
  }
}
export default User;
