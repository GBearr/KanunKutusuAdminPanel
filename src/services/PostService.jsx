import supabase from "./supabaseClient";
import Post from "../Models/postModel";

export const postService = {
  getNewPosts: async (p_page, p_viewer_id) => {
    let { data, error } = await supabase.rpc("get_new_posts", {
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

  getPopularPosts: async (p_page, p_viewer_id) => {
    let { data, error } = await supabase.rpc("get_popular_posts", {
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

  createPost: async ({ p_user_id, p_title, p_content, p_image_url }) => {
    let { data, error } = await supabase.rpc("insert_post", {
      p_user_id,
      p_title,
      p_content,
      p_image_url,
    });
    if (error) {
      console.error("Fonksiyon çağrısı hatası:", error);
      return [];
    } else {
      return data;
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

  support: async (p_user_id, p_post_id) => {
    let { data, error } = await supabase.rpc("support", {
      p_user_id,
      p_post_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      console.log(data);
      return data;
    }
  },
};
