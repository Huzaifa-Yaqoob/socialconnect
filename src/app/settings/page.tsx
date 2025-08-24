import { redirect } from "next/navigation";
import EditSetting from "@/components/forms/EditSetting";
import { connectToDatabase } from "@/db/connect";
import User from "@/db/schemas/user.schema";
import { getSession } from "@/lib/getSession";

export default async function SettingsPage() {
  // Fetch current user settings
  await connectToDatabase();
  const session = await getSession();

  if (!session) {
    redirect("/auth/?form=login");
  }

  const user = await User.findById(session?.id)
    .select("name avatar bio interests username -_id")
    .lean();

  console.log(user);

  // Handle other errors

  return (
    <div className="container mx-auto flex-grow px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <EditSetting initialValues={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
