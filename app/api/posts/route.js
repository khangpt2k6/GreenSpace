import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase";
import { tampaCommunityPosts } from "@/data/tampa-community";

function timeAgoString(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*, post_likes(count)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return Response.json({ posts: tampaCommunityPosts });
  }

  const dbPosts = (data || []).map((p) => ({
    id: p.id,
    author: p.author_name,
    role: "GreenCart Member",
    content: p.content,
    tags: p.tags || [],
    imageUrl: p.image_url || null,
    likes: p.post_likes?.[0]?.count ?? 0,
    comments: 0,
    timeAgo: timeAgoString(p.created_at),
    isUserPost: true,
  }));

  return Response.json({ posts: [...dbPosts, ...tampaCommunityPosts] });
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Sign in to post." }, { status: 401 });
  }

  const body = await request.json();
  const { content, tags, imageUrl, authorName } = body;

  if (!content?.trim()) {
    return Response.json({ error: "Post content is required." }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: userId,
      author_name: authorName || "GreenCart Member",
      content: content.trim(),
      tags: tags || [],
      image_url: imageUrl || null,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ post: data }, { status: 201 });
}
