"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  tampaCommunityPosts,
  tampaOrganizations,
  tampaVolunteerOpportunities
} from "@/data/tampa-community";
import {
  finalProjectBrief,
  projectIdeas,
  reflectionRequirements
} from "@/data/final-project";

const causes = [
  "cleanup",
  "waste reduction",
  "marine",
  "restoration",
  "climate",
  "water",
  "education",
  "biodiversity"
];

export default function CommunityPage() {
  const [selectedCauses, setSelectedCauses] = useState(["cleanup", "climate"]);
  const [availability, setAvailability] = useState("Any");
  const [postText, setPostText] = useState("");
  const [localPosts, setLocalPosts] = useState([]);

  const allPosts = [...localPosts, ...tampaCommunityPosts];

  const suggestedOpportunities = useMemo(() => {
    return tampaVolunteerOpportunities
      .map((opportunity) => {
        const causeOverlap = opportunity.causes.filter((cause) =>
          selectedCauses.includes(cause)
        ).length;
        const availabilityScore =
          availability === "Any" || opportunity.commitment === availability ? 1 : 0;
        return {
          ...opportunity,
          recommendationScore: causeOverlap * 2 + availabilityScore
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  }, [selectedCauses, availability]);

  function toggleCause(cause) {
    setSelectedCauses((current) => {
      if (current.includes(cause)) {
        return current.filter((value) => value !== cause);
      }
      return [...current, cause];
    });
  }

  function handlePost(event) {
    event.preventDefault();
    const content = postText.trim();
    if (!content) return;

    const newPost = {
      id: `local-${Date.now()}`,
      author: "You",
      role: "GreenCart Member",
      content,
      tags: selectedCauses.slice(0, 3),
      likes: 0,
      comments: 0,
      timeAgo: "Just now"
    };
    setLocalPosts((current) => [newPost, ...current]);
    setPostText("");
  }

  return (
    <main className="page">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <header className="siteNav glass" data-reveal style={{ "--reveal-delay": "0ms" }}>
        <p className="brand">GreenCart</p>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/community">Community</Link>
        </nav>
      </header>

      <section className="glass marketHeader" data-reveal style={{ "--reveal-delay": "70ms" }}>
        <h1>Tampa Eco Community</h1>
        <p>
          A social environmental hub: share updates, connect with local organizations,
          and get volunteer suggestions around Tampa.
        </p>
      </section>

      <section className="glass projectStudio" data-reveal style={{ "--reveal-delay": "130ms" }}>
        <h2>{finalProjectBrief.title}</h2>
        <p>{finalProjectBrief.intro}</p>
        <p>{finalProjectBrief.objective}</p>

        <div className="projectStudioGrid">
          <article className="projectStudioCard">
            <h3>Project Expectations</h3>
            <ul>
              {finalProjectBrief.expectations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="projectStudioCard">
            <h3>Possible Project Directions</h3>
            <ul>
              {projectIdeas.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="projectStudioCard">
            <h3>Reflection Requirements</h3>
            <ul>
              {reflectionRequirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="communityLayout" data-reveal style={{ "--reveal-delay": "190ms" }}>
        <aside className="glass communityPanel" data-reveal style={{ "--reveal-delay": "230ms" }}>
          <h3>Your Cause Interests</h3>
          <div className="chipWrap">
            {causes.map((cause) => (
              <button
                type="button"
                key={cause}
                onClick={() => toggleCause(cause)}
                className={selectedCauses.includes(cause) ? "chip chip--active" : "chip"}
              >
                {cause}
              </button>
            ))}
          </div>

          <h3>Availability</h3>
          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
            className="communitySelect"
          >
            <option>Any</option>
            <option>One-time</option>
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
          </select>

          <h3>Local Organizations</h3>
          <div className="organizationList">
            {tampaOrganizations.map((organization) => (
              <article className="orgCard" key={organization.id}>
                <h4>{organization.name}</h4>
                <p className="mutedLine">{organization.area}</p>
                <p>{organization.description}</p>
                <a href={organization.website} target="_blank" rel="noreferrer">
                  Visit organization
                </a>
              </article>
            ))}
          </div>
        </aside>

        <section className="communityFeed">
          <article className="glass feedComposer" data-reveal style={{ "--reveal-delay": "260ms" }}>
            <h3>Share an Update</h3>
            <form onSubmit={handlePost} className="composerForm">
              <textarea
                value={postText}
                onChange={(event) => setPostText(event.target.value)}
                placeholder="Share your sustainability activity, event, or volunteering update..."
                rows={4}
              />
              <button type="submit" className="btnPrimary">
                Publish Post
              </button>
            </form>
          </article>

          <article className="glass feedCard" data-reveal style={{ "--reveal-delay": "300ms" }}>
            <h3>Community Feed</h3>
            <div className="feedList">
              {allPosts.map((post) => (
                <div className="postCard" key={post.id}>
                  <div className="postMeta">
                    <strong>{post.author}</strong>
                    <span>{post.role}</span>
                    <span>{post.timeAgo}</span>
                  </div>
                  <p>{post.content}</p>
                  <div className="chipWrap">
                    {post.tags.map((tag) => (
                      <span className="chip chip--static" key={`${post.id}-${tag}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mutedLine">
                    {post.likes} likes · {post.comments} comments
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="glass suggestionPanel" data-reveal style={{ "--reveal-delay": "340ms" }}>
          <h3>Recommended Volunteer Opportunities</h3>
          <p className="mutedLine">
            Ranked by your selected causes and availability.
          </p>
          <div className="suggestionList">
            {suggestedOpportunities.map((opportunity) => (
              <article key={opportunity.id} className="suggestionCard">
                <h4>{opportunity.title}</h4>
                <p className="mutedLine">
                  {opportunity.organization} · {opportunity.location}
                </p>
                <p className="mutedLine">
                  {opportunity.dateLabel} · {opportunity.commitment}
                </p>
                <p>{opportunity.skillLevel}</p>
                <div className="chipWrap">
                  {opportunity.causes.map((cause) => (
                    <span key={`${opportunity.id}-${cause}`} className="chip chip--static">
                      {cause}
                    </span>
                  ))}
                </div>
                <a href={opportunity.signupUrl} target="_blank" rel="noreferrer" className="btnGhost">
                  Join Opportunity
                </a>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
