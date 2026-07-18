import { config } from "dotenv";

config({ path: ".env.local" });

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!(adminEmail && adminPassword)) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
  }

  const { auth } = await import("@/lib/auth/auth.ts");

  const user = await auth.api.createUser({
    body: {
      email: adminEmail,
      name: "Sahil Jadhav",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("Admin created:", user.user.email);
}

createAdmin();
