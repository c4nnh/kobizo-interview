import { UserRole } from "@/users/users.type";
import { createClient } from "@supabase/supabase-js";
import { getArguments } from "./utils";

export async function createSystemUser() {
  console.info("Creating system user");

  const { email, password } = getArguments();

  if (!email) {
    throw new Error("Please provide email");
  }

  if (!password) {
    throw new Error("Please provide password");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string,
  );

  await supabase.auth.admin.createUser({
    email,
    password,
    role: "supabase_admin",
    email_confirm: true,
    user_metadata: {
      name: "System",
      role: UserRole.SYSTEM,
    },
  });

  console.info("System user is created");
}
