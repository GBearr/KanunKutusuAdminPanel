import supabase from "./supabaseClient";
import User from "../Models/userModel";

export const userService = {
  getUsers: async (p_user_id) => {
    let { data, error } = await supabase.rpc("get_user", {
      p_user_id,
    });
    if (error) console.error(error);
    return User.fromJSON(data[0]);
  },

  searchUsers: async (search_text) => {
    let { data, error } = await supabase.rpc("search_users", {
      search_text,
    });
    if (error) {
      console.error(error);
      return [];
    } else {
      return data.map((item) => User.fromJSON(item));
    }
  },
};
