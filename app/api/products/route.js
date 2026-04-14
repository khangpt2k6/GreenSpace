import { auth } from "@clerk/nextjs/server";
import { createServerSupabase } from "@/lib/supabase";
import { products as staticProducts } from "@/data/products";

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
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ products: staticProducts });
  }

  const dbProducts = (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description || "",
    price: Number(p.price),
    image: p.image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    url: p.product_url || "#",
    sustainability: p.sustainability ?? 70,
    rating: Number(p.rating) || 4.0,
    resale: p.resale || false,
    authorName: p.author_name,
    uploadedAt: timeAgoString(p.created_at),
    isUserUploaded: true,
  }));

  return Response.json({ products: [...dbProducts, ...staticProducts] });
}

export async function POST(request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Sign in to upload products." }, { status: 401 });
  }

  const body = await request.json();
  const { name, category, description, price, imageUrl, productUrl, sustainability, resale, authorName } = body;

  if (!name?.trim() || !category || !price) {
    return Response.json({ error: "Name, category, and price are required." }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .insert({
      user_id: userId,
      author_name: authorName || "GreenCart Member",
      name: name.trim(),
      category,
      description: description?.trim() || null,
      price: parseFloat(price),
      image_url: imageUrl || null,
      product_url: productUrl?.trim() || null,
      sustainability: parseInt(sustainability) || 70,
      rating: 4.0,
      resale: resale || false,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ product: data }, { status: 201 });
}
