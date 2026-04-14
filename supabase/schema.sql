-- ============================================================
-- GreenCart Supabase Schema
-- Run this in the Supabase SQL Editor at:
-- https://supabase.com/dashboard → your project → SQL Editor
-- ============================================================

-- Products uploaded by users
CREATE TABLE IF NOT EXISTS products (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         TEXT        NOT NULL,
  author_name     TEXT        NOT NULL DEFAULT 'GreenCart Member',
  name            TEXT        NOT NULL,
  category        TEXT        NOT NULL CHECK (category IN ('EcoLiving','EcoTech','EcoFashion')),
  description     TEXT,
  price           NUMERIC(10,2) NOT NULL,
  image_url       TEXT,
  product_url     TEXT,
  sustainability  INTEGER     DEFAULT 70 CHECK (sustainability BETWEEN 0 AND 100),
  rating          NUMERIC(3,1) DEFAULT 4.0,
  resale          BOOLEAN     DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Community posts
CREATE TABLE IF NOT EXISTS posts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      TEXT        NOT NULL,
  author_name  TEXT        NOT NULL DEFAULT 'GreenCart Member',
  content      TEXT        NOT NULL,
  tags         TEXT[]      DEFAULT '{}',
  image_url    TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Post likes (one per user per post)
CREATE TABLE IF NOT EXISTS post_likes (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id    UUID        REFERENCES posts(id) ON DELETE CASCADE,
  user_id    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (post_id, user_id)
);

-- Post comments
CREATE TABLE IF NOT EXISTS comments (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id     UUID        REFERENCES posts(id) ON DELETE CASCADE,
  user_id     TEXT        NOT NULL,
  author_name TEXT        NOT NULL DEFAULT 'GreenCart Member',
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments   ENABLE ROW LEVEL SECURITY;

-- Products: public read, open insert (auth validated in API route)
CREATE POLICY "products_select" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update" ON products FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "products_delete" ON products FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Posts: public read, open insert
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Post likes
CREATE POLICY "likes_select" ON post_likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON post_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "likes_delete" ON post_likes FOR DELETE USING (true);

-- Comments
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (true);

-- ── Storage Buckets ─────────────────────────────────────────
-- Run these in the Storage section or via SQL:
INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-images', 'product-images', true)
  ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
  VALUES ('post-media', 'post-media', true)
  ON CONFLICT DO NOTHING;

CREATE POLICY "product_images_select" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "product_images_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "post_media_select"     ON storage.objects FOR SELECT USING (bucket_id = 'post-media');
CREATE POLICY "post_media_insert"     ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-media');
