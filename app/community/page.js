"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiSend,
  FiBell,
  FiUser,
  FiMapPin,
  FiCalendar,
  FiChevronRight,
  FiImage,
  FiSmile,
  FiX,
  FiCheck
} from "react-icons/fi";
import { MdEco, MdVolunteerActivism, MdNaturePeople } from "react-icons/md";
import Navbar from "@/components/navbar";
import {
  tampaCommunityPosts,
  tampaOrganizations,
  tampaVolunteerOpportunities
} from "@/data/tampa-community";
import { createBrowserSupabase } from "@/lib/supabase";

const causes = [
  "cleanup", "waste reduction", "marine",
  "restoration", "climate", "water", "education", "biodiversity"
];

const AVATAR_COLORS = [
  "#22b86a", "#3ba7ff", "#f7b731", "#e83e66", "#9b59b6", "#1abc9c", "#e67e22"
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Avatar({ src, name, size = 40 }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="snAvatar"
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <div
      className="snAvatar"
      style={{
        width: size, height: size, fontSize: size * 0.38,
        background: getAvatarColor(name), flexShrink: 0
      }}
    >
      {initials}
    </div>
  );
}

function PostCard({ post, currentUserId }) {
  const [liked, setLiked]       = useState(false);
  const [likeCount, setLikeCount] = useState(Number(post.likes) || 0);
  const [liking, setLiking]     = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText]   = useState("");
  const [posting, setPosting]   = useState(false);

  async function toggleLike() {
    if (!currentUserId || liking || !post.isUserPost) {
      // For static posts, just toggle locally
      setLiked((p) => !p);
      setLikeCount((c) => liked ? c - 1 : c + 1);
      return;
    }
    setLiking(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setLiked(json.liked);
        setLikeCount(json.count);
      }
    } finally {
      setLiking(false);
    }
  }

  async function loadComments() {
    if (!post.isUserPost) return;
    setShowComments((v) => !v);
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim() || !currentUserId) return;
    setPosting(true);
    try {
      const supabase = createBrowserSupabase();
      const { data } = await supabase.from("comments").insert({
        post_id: post.id,
        user_id: currentUserId,
        author_name: "GreenCart Member",
        content: commentText.trim(),
      }).select().single();
      if (data) {
        setComments((c) => [...c, { ...data, author: data.author_name, content: data.content }]);
        setCommentText("");
      }
    } finally {
      setPosting(false);
    }
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: "GreenCart Community", text: post.content, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <article className="snPost glass">
      <div className="snPostHeader">
        <Avatar name={post.author} size={44} />
        <div className="snPostMeta">
          <strong className="snPostAuthor">{post.author}</strong>
          <span className="snPostRole">{post.role}</span>
          <span className="snPostTime">{post.timeAgo}</span>
        </div>
      </div>

      <p className="snPostContent">{post.content}</p>

      {post.imageUrl && (
        <div className="snPostImage">
          <img src={post.imageUrl} alt="Post image" />
        </div>
      )}

      <div className="snTagRow">
        {(post.tags || []).map((tag) => (
          <span className="snTag" key={tag}>
            <MdEco size={12} /> {tag}
          </span>
        ))}
      </div>

      <div className="snPostActions">
        <button
          type="button"
          className={`snAction ${liked ? "snAction--liked" : ""}`}
          onClick={toggleLike}
          disabled={liking}
        >
          <FiHeart size={16} />
          <span>{likeCount}</span>
        </button>
        <button type="button" className="snAction" onClick={loadComments}>
          <FiMessageCircle size={16} />
          <span>{post.comments + comments.length}</span>
        </button>
        <button type="button" className="snAction" onClick={share}>
          <FiShare2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <div className="snComments">
          {comments.map((c, i) => (
            <div key={i} className="snComment">
              <Avatar name={c.author} size={28} />
              <div className="snCommentBody">
                <strong>{c.author}</strong>
                <p>{c.content}</p>
              </div>
            </div>
          ))}
          {currentUserId ? (
            <form className="snCommentForm" onSubmit={submitComment}>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
              />
              <button type="submit" disabled={!commentText.trim() || posting}>
                <FiSend size={14} />
              </button>
            </form>
          ) : (
            <p className="snSignInNote">
              <SignInButton mode="modal">
                <button className="snInlineSignIn">Sign in to comment</button>
              </SignInButton>
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export default function CommunityPage() {
  const { user, isLoaded } = useUser();

  const [selectedCauses, setSelectedCauses] = useState(["cleanup", "climate"]);
  const [availability, setAvailability]     = useState("Any");
  const [postText, setPostText]             = useState("");
  const [allPosts, setAllPosts]             = useState(tampaCommunityPosts);
  const [loadingPosts, setLoadingPosts]     = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [postError, setPostError]           = useState("");
  const [imageFile, setImageFile]           = useState(null);
  const [imagePreview, setImagePreview]     = useState(null);
  const fileRef = useRef();

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts");
      const json = await res.json();
      if (json.posts) setAllPosts(json.posts);
    } catch {
      // keep static fallback
    } finally {
      setLoadingPosts(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  const suggestedOpportunities = useMemo(() => {
    return tampaVolunteerOpportunities
      .map((opp) => {
        const overlap = opp.causes.filter((c) => selectedCauses.includes(c)).length;
        const avail = availability === "Any" || opp.commitment === availability ? 1 : 0;
        return { ...opp, score: overlap * 2 + avail };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [selectedCauses, availability]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allPosts;
    return allPosts.filter(
      (p) => p.content?.toLowerCase().includes(q) || p.author?.toLowerCase().includes(q)
    );
  }, [allPosts, searchQuery]);

  function toggleCause(cause) {
    setSelectedCauses((cur) =>
      cur.includes(cause) ? cur.filter((c) => c !== cause) : [...cur, cause]
    );
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handlePost(e) {
    e.preventDefault();
    const content = postText.trim();
    if (!content || !user) return;
    setSubmitting(true);
    setPostError("");

    try {
      let imageUrl = null;
      if (imageFile) {
        const supabase = createBrowserSupabase();
        const ext = imageFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("post-media").upload(path, imageFile);
        if (upErr) throw new Error("Image upload failed");
        const { data: urlData } = supabase.storage.from("post-media").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          tags: selectedCauses.slice(0, 3),
          imageUrl,
          authorName: user.fullName || user.username || "GreenCart Member",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to post.");

      const newPost = {
        id: json.post.id,
        author: user.fullName || user.username || "GreenCart Member",
        role: "GreenCart Member",
        content,
        tags: selectedCauses.slice(0, 3),
        imageUrl,
        likes: 0,
        comments: 0,
        timeAgo: "Just now",
        isUserPost: true,
      };

      setAllPosts((cur) => [newPost, ...cur]);
      setPostText("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setPostError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const displayName = user?.fullName || user?.username || "GreenCart Member";

  return (
    <main className="snPage">
      <Navbar />

      {/* ── Three-column layout ── */}
      <div className="snLayout">

        {/* ══ LEFT SIDEBAR ══ */}
        <aside className="snSidebar snSidebarLeft">

          {/* Profile Card */}
          <div className="snCard glass snProfileCard">
            <div className="snProfileCover" />
            <div className="snProfileBody">
              <div className="snProfileAvatarWrap">
                {isLoaded && user ? (
                  <img
                    src={user.imageUrl}
                    alt={displayName}
                    style={{ width: 62, height: 62, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <Avatar name={user ? displayName : "Guest"} size={62} />
                )}
              </div>
              <h3 className="snProfileName">
                {isLoaded ? (user ? displayName : "Guest") : "…"}
              </h3>
              <p className="snProfileSub">
                {user ? `${user.primaryEmailAddress?.emailAddress || "GreenCart Member"}` : "Sign in to participate"}
              </p>
              {!user && isLoaded && (
                <SignInButton mode="modal">
                  <button className="mktUploadSideBtn" style={{ marginTop: "0.75rem", width: "100%" }}>
                    Sign in / Sign up
                  </button>
                </SignInButton>
              )}
              {user && (
                <div className="snProfileStats">
                  <div className="snStat"><strong>{allPosts.filter(p => p.isUserPost && p.author === displayName).length}</strong><span>Posts</span></div>
                  <div className="snStat"><strong>3</strong><span>Events</span></div>
                  <div className="snStat"><strong>47</strong><span>Impact pts</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Cause Interests */}
          <div className="snCard glass">
            <h4 className="snCardTitle">
              <MdEco size={16} />
              Your Cause Interests
            </h4>
            <div className="snChipGrid">
              {causes.map((cause) => (
                <button
                  key={cause}
                  type="button"
                  onClick={() => toggleCause(cause)}
                  className={`snChip ${selectedCauses.includes(cause) ? "snChip--on" : ""}`}
                >
                  {cause}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="snCard glass">
            <h4 className="snCardTitle">
              <FiCalendar size={15} />
              Availability
            </h4>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="snSelect"
            >
              <option>Any</option>
              <option>One-time</option>
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          {/* Local Organizations */}
          <div className="snCard glass">
            <h4 className="snCardTitle">
              <MdVolunteerActivism size={16} />
              Local Organizations
            </h4>
            <div className="snOrgList">
              {tampaOrganizations.map((org) => (
                <a
                  key={org.id}
                  href={org.website}
                  target="_blank"
                  rel="noreferrer"
                  className="snOrgItem"
                >
                  <Avatar name={org.name} size={36} />
                  <div className="snOrgInfo">
                    <strong>{org.name}</strong>
                    <span><FiMapPin size={11} /> {org.area}</span>
                  </div>
                  <FiChevronRight size={14} className="snOrgArrow" />
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* ══ CENTER FEED ══ */}
        <section className="snFeed">

          {/* Composer */}
          <div className="snCard glass snComposer">
            <div className="snComposerTop">
              {isLoaded && user ? (
                <img
                  src={user.imageUrl}
                  alt={displayName}
                  style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <Avatar name="Guest" size={42} />
              )}
              <form onSubmit={handlePost} className="snComposerForm">
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder={
                    user
                      ? "Share a sustainability update, tip, or event…"
                      : "Sign in to share with the community…"
                  }
                  rows={3}
                  className="snComposerTextarea"
                  disabled={!user}
                />

                {imagePreview && (
                  <div className="snComposerImagePreview">
                    <img src={imagePreview} alt="preview" />
                    <button
                      type="button"
                      className="snRemoveImage"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                )}

                <div className="snComposerActions">
                  <div className="snComposerTools">
                    <button
                      type="button"
                      className="snToolBtn"
                      onClick={() => user && fileRef.current?.click()}
                      disabled={!user}
                    >
                      <FiImage size={16} /> Photo
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <button type="button" className="snToolBtn" disabled={!user}>
                      <FiSmile size={16} /> Feeling
                    </button>
                    <button type="button" className="snToolBtn" disabled={!user}>
                      <FiMapPin size={16} /> Location
                    </button>
                  </div>

                  {user ? (
                    <button
                      type="submit"
                      className="snSubmitBtn"
                      disabled={!postText.trim() || submitting}
                    >
                      {submitting ? "Posting…" : <><FiSend size={15} /> Post</>}
                    </button>
                  ) : (
                    <SignInButton mode="modal">
                      <button type="button" className="snSubmitBtn">
                        Sign in to post
                      </button>
                    </SignInButton>
                  )}
                </div>

                {postError && <p className="mktModalError">{postError}</p>}
              </form>
            </div>
          </div>

          {/* Feed Posts */}
          {loadingPosts && (
            <div className="snLoadingBar glass">
              <span className="mktLoadingDot" />
              <span>Loading community posts…</span>
            </div>
          )}
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id || null}
            />
          ))}
        </section>

        {/* ══ RIGHT SIDEBAR ══ */}
        <aside className="snSidebar snSidebarRight">

          {/* Volunteer Opportunities */}
          <div className="snCard glass">
            <h4 className="snCardTitle">
              <FiBell size={15} />
              Volunteer Opportunities
            </h4>
            <p className="snCardSub">Matched to your causes &amp; availability</p>
            <div className="snNotifList">
              {suggestedOpportunities.map((opp) => (
                <a
                  key={opp.id}
                  href={opp.signupUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="snNotifItem"
                >
                  <div className="snNotifIcon">
                    <MdVolunteerActivism size={18} />
                  </div>
                  <div className="snNotifBody">
                    <strong>{opp.title}</strong>
                    <span>{opp.organization}</span>
                    <span className="snNotifMeta">
                      <FiMapPin size={10} />
                      {opp.location} · {opp.dateLabel}
                    </span>
                    <div className="snMiniChips">
                      {opp.causes.slice(0, 2).map((c) => (
                        <span key={c} className="snMiniChip">{c}</span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Community Members */}
          <div className="snCard glass">
            <h4 className="snCardTitle">
              <FiUser size={15} />
              Community Members
            </h4>
            <div className="snFriendList">
              {[
                { name: "Lina M.", role: "Volunteer Lead" },
                { name: "Ethan R.", role: "Student Organizer" },
                { name: "Maria G.", role: "Community Member" },
                { name: "Sam T.", role: "Eco Blogger" },
                { name: "Priya K.", role: "Event Organizer" }
              ].map((member) => (
                <div key={member.name} className="snFriend">
                  <Avatar name={member.name} size={38} />
                  <div className="snFriendInfo">
                    <strong>{member.name}</strong>
                    <span>{member.role}</span>
                  </div>
                  <button type="button" className="snFollowBtn">Follow</button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Tags */}
          <div className="snCard glass">
            <h4 className="snCardTitle">
              <MdNaturePeople size={17} />
              Trending in Tampa
            </h4>
            <div className="snTrendList">
              {[
                { tag: "#MangroveRestoration", posts: "42 posts" },
                { tag: "#ZeroWaste",           posts: "89 posts" },
                { tag: "#CleanCoast",          posts: "31 posts" },
                { tag: "#EcoLiving",           posts: "67 posts" },
                { tag: "#TampaBayWatch",       posts: "19 posts" }
              ].map((trend) => (
                <div key={trend.tag} className="snTrend">
                  <span className="snTrendTag">{trend.tag}</span>
                  <span className="snTrendCount">{trend.posts}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
