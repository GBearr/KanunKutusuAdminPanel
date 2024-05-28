// CommentService.jsx
import supabase from "./supabaseClient";
import Comment from "../Models/commentModel";

export const commentService = {
  getCommentsofPost: async (p_page, p_post_id) => {
    let { data, error } = await supabase.rpc("get_comments_of_post", {
      p_page,
      p_post_id,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      // return data;
      return data.map((item) => Comment.fromJSON(item));
    }
  },

  insertComment: async (p_content, p_post_id, p_user_id) => {
    let { data, error } = await supabase.rpc("insert_comment", {
      p_content,
      p_post_id,
      p_user_id,
    });
    if (error) {
      console.error("Error inserting comment:", error);
      return null;
    } else {
      console.log("Comment inserted:", data);
    }
  },
};
