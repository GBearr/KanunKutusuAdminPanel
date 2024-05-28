import supabase from "./supabaseClient";
import Post from "../Models/postModel";

const postService = {
  getApprovedPosts: async (p_page, p_viewer_id) => {
    let { data, error } = await supabase.rpc("get_approved_posts", {
      p_page,
      p_viewer_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return data.map((item) => Post.fromJSON(item));
    }
  },

  getPendingPosts: async (p_page, p_viewer_id) => {
    let { data, error } = await supabase.rpc("get_pending_posts", {
      p_page,
      p_viewer_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return data.map((item) => Post.fromJSON(item));
    }
  },

  getRejectedPosts: async (p_page, p_viewer_id) => {
    let { data, error } = await supabase.rpc("get_rejected_posts", {
      p_page,
      p_viewer_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return data.map((item) => Post.fromJSON(item));
    }
  },

  getPostsOfUser: async (p_page, p_user_id, p_viewer_id) => {
    let { data, error } = await supabase.rpc("get_posts_of_user", {
      p_page,
      p_user_id,
      p_viewer_id,
    });
    if (error) {
      console.error("API hatası", error);
      return [];
    } else {
      return data.map((item) => Post.fromJSON(item));
    }
  },

  getPendingPostsOfUser: async (p_page, p_user_id, p_viewer_id) => {
    let { data, error } = await supabase.rpc("get_pending_posts_of_user", {
      p_page,
      p_user_id,
      p_viewer_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return data.map((item) => Post.fromJSON(item));
    }
  },

  getApprovedPostsOfUser: async (p_page, p_user_id, p_viewer_id) => {
    let { data, error } = await supabase.rpc("get_approved_posts_of_user", {
      p_page,
      p_user_id,
      p_viewer_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return data.map((item) => Post.fromJSON(item));
    }
  },

  getRejectedPostsOfUser: async (p_page, p_user_id, p_viewer_id) => {
    let { data, error } = await supabase.rpc("get_rejected_posts_of_user", {
      p_page,
      p_user_id,
      p_viewer_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return data.map((item) => Post.fromJSON(item));
    }
  },

  searchPosts: async (p_viewer_id, search_text) => {
    let { data, error } = await supabase.rpc("search_posts", {
      p_viewer_id,
      search_text,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return data.map((item) => Post.fromJSON(item));
    }
  },

  approvePost: async (p_post_id) => {
    let { data, error } = await supabase.rpc("approve", {
      p_post_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return Post.fromJSON(data[0]);
    }
  },

  rejectPost: async (p_post_id) => {
    let { data, error } = await supabase.rpc("reject", {
      p_post_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return Post.fromJSON(data[0]);
    }
  },

  deletePost: async (p_post_id) => {
    let { data, error } = await supabase.rpc("delete_post", {
      p_post_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return Post.fromJSON(data[0]);
    }
  },
};

export default postService;
