import SettingsForm from "@/components/forms/EditSetting";
import { getCurrentUserSettings } from "@/lib/update";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  // Fetch current user settings
  const result = await getCurrentUserSettings();

  console.log(result);

  if (!result.success) {
    // Redirect to login if not authenticated
    if (result.error === "Authentication required") {
      redirect("/login");
    }

    // Handle other errors
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      {/*<SettingsForm initialValues={result.data} />*/}
    </div>
  );
}
