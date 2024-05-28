import supabase from "./supabaseClient";
import AdminUser from "../Models/adminUserModel";

export const AdminAuthService = {
  adminSignIn: async (p_email_address, p_password) => {
    if (!p_email_address || !p_password) {
      throw new Error("Email and password are required");
    }

    let { data, error } = await supabase.rpc("admin_sign_in", {
      p_email_address,
      p_password,
    });
    if (error) throw error;
    return AdminUser.fromJSON(data[0]);
  },
};
