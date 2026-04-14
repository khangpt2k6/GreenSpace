import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(request, { params }) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Sign in to like posts." }, { status: 401 });
  }

  const { id: postId } = await params;
  const supabase = createServerSupabase();

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    return Response.json({ liked: false, count: count ?? 0 });
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: userId });
    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId);
    return Response.json({ liked: true, count: count ?? 0 });
  }
}
