import DateFormatter from "./dateFormatter";

class Post {
  constructor(
    id,
    userId,
    title,
    content,
    imageUrl,
    profileImageUrl,
    createdAt,
    commentCount,
    supportCount,
    isSupported,
    state,
    timesAgo
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.imageUrl = imageUrl;
    this.profileImageUrl = profileImageUrl;
    this.createdAt = createdAt;
    this.commentCount = commentCount;
    this.supportCount = supportCount;
    this.isSupported = isSupported;
    this.state = state;
    this.timesAgo = timesAgo;
  }

  static fromJSON(map) {
    const createdAt = new Date(map.created_at);
    const timesAgo = DateFormatter.formatDateDifference(createdAt);
    return new Post(
      map.id,
      map.user_id,
      map.title,
      map.content,
      map.image_url,
      map.profile_image_url,
      map.created_at,
      map.comment_count,
      map.support_count,
      map.is_supported,
      map.state,
      timesAgo
    );
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      content: this.content,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      commentCount: this.commentCount,
      supportCount: this.supportCount,
      state: this.state,
    };
  }
}

export default Post;
