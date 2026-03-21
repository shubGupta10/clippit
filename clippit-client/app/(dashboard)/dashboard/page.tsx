import { auth } from "@clerk/nextjs/server";
import { ItemGrid } from "@/components/items/ItemGrid";
import { GroupedItem } from "@/lib/types";

export default async function DashboardPage() {
  const authState = await auth();
  const token = await authState.getToken();

  let initialItems: GroupedItem[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/get-user-items`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (res.ok) {
      const responseBody = await res.json();
      initialItems = Array.isArray(responseBody?.data) ? responseBody.data : (Array.isArray(responseBody) ? responseBody : []);
    }
  } catch (error) {
    console.error("Failed to fetch initial items:", error);
  }

  return <ItemGrid initialItems={initialItems} />;
}
