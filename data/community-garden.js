// Community Gardens, Parks & Nature Spaces — Tampa Bay & Florida Region
// Two sections: "Enjoy Nature" and "Food & Community Gardens"
// Data curated from course materials and public sources (April 2026).

const Q = "?auto=format&fit=crop&w=900&q=80";
const U = (id) => `https://images.unsplash.com/photo-${id}${Q}`;

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 1 — ENJOY NATURE
//  Parks, trails, botanical gardens, aquatic preserves, state parks
// ─────────────────────────────────────────────────────────────────────────────
export const naturePlaces = [
  {
    id: "nat-1",
    name: "Tampa Greenways & Trails",
    type: "trail",
    area: "Tampa, FL",
    description:
      "Tampa's major recreational trails network — from the Hillsborough River Greenway to the Upper Tampa Bay Trail. Perfect for hiking, biking, and connecting with nature right inside the city. The Parks & Recreation site lists every route, length, and access point.",
    website: "https://www.tampa.gov/parks-and-recreation/parks-and-facilities/greenways",
    tags: ["trails", "biking", "walking", "city nature", "recreation"],
    image: U("1506905489-8f1a994cca65"),
    highlight: "Free access · Multiple trail entry points across Tampa",
  },
  {
    id: "nat-2",
    name: "Marie Selby Botanical Gardens",
    type: "botanical",
    area: "Sarasota, FL",
    description:
      "45 acres of stunning bayfront sanctuaries filled with rare plants, epiphytes, and regional history. World-class orchid and bromeliad collections, lush tropical gardens, and a mission rooted in plant science and conservation. Open to the public year-round.",
    website: "https://selby.org/about/",
    tags: ["botanical", "orchids", "conservation", "bayfront", "science"],
    image: U("1558618666-fcd25c85cd64"),
    highlight: "45 acres · Bayfront location · World-class orchid collection",
  },
  {
    id: "nat-3",
    name: "Myakka River State Park",
    type: "state-park",
    area: "Sarasota County, FL",
    description:
      "One of Florida's oldest and largest state parks — nearly 58 square miles of prairies, hammocks, and wetlands. Spot alligators, sandhill cranes, and roseate spoonbills. Canoe and kayak rentals, airboat tours, hiking trails, and primitive camping make it a full nature immersion.",
    website: "https://www.floridastateparks.org/parks-and-trails/myakka-river-state-park",
    tags: ["wildlife", "camping", "kayaking", "hiking", "state park"],
    image: U("1501854140801-50d01698950b"),
    highlight: "58 sq miles · Wildlife viewing · Camping & kayaking available",
  },
  {
    id: "nat-4",
    name: "Florida State Parks",
    type: "state-park",
    area: "Statewide, FL",
    description:
      "Florida's award-winning state park system offers hiking, camping, fishing, boating, and environmental education programs. Whether you want to paddle through mangroves, spot manatees, or sleep under the stars, there's a park within reach. Conservation and sustainability education are woven into every visit.",
    website: "https://www.floridastateparks.org/",
    tags: ["hiking", "camping", "fishing", "eco-education", "wildlife"],
    image: U("1441974231531-c6227db76b6e"),
    highlight: "175+ parks statewide · Environmental education · Free for many activities",
  },
  {
    id: "nat-5",
    name: "Tampa Bay Aquatic Preserves",
    type: "aquatic",
    area: "Tampa Bay, FL",
    description:
      "Florida DEP's aquatic preserve network highlights the best of Tampa Bay: open water, inlet bays, tidally influenced creeks, oyster reefs, seagrass beds, salt marshes, and mangrove forests. A critical ecosystem for fish, birds, and water quality — and the site of USF's annual Stampede of Service invasive species removal event.",
    website: "https://floridadep.gov/rcp/aquatic-preserve/content/tampa-bay-aquatic-preserves-0",
    volunteerLink: "https://bullsconnect.usf.edu/CLCE/rsvp_boot?id=1931876",
    tags: ["aquatic", "mangroves", "seagrass", "conservation", "water quality"],
    image: U("1507525428034-b723cf961d3e"),
    highlight: "USF Stampede of Service volunteer event · April 14th · Invasive species removal",
  },
  {
    id: "nat-6",
    name: "Top 10 Tampa Hiking Trails (AllTrails)",
    type: "trail",
    area: "Tampa Bay Region, FL",
    description:
      "AllTrails curates the 10 best hiking trails in and around Tampa — from the easy riverside walks at Lettuce Lake to more challenging routes. Hiking is great for mental health and reconnecting with nature. Each trail listing includes difficulty, distance, elevation, and community reviews.",
    website: "https://www.alltrails.com/us/florida/tampa",
    tags: ["hiking", "mental health", "trails", "outdoors", "nature therapy"],
    image: U("1469474968028-56623f02e42e"),
    highlight: "Free app · Offline maps available · Mental health benefits",
  },
  {
    id: "nat-7",
    name: "Lettuce Lake Park",
    type: "park",
    area: "Tampa, FL",
    description:
      "A beloved Hillsborough County nature sanctuary along the Hillsborough River. Lettuce Lake features a long boardwalk through swamp forest, a 35-foot observation tower, kayak rentals, and abundant wildlife including otters, turtles, osprey, and alligators. A true urban nature escape.",
    website: "https://hcfl.gov/locations/lettuce-lake-conservation-park",
    tags: ["boardwalk", "wildlife", "kayaking", "urban nature", "river"],
    image: U("1419242902214-272b3f66ee7a"),
    highlight: "Boardwalk & observation tower · Kayak rentals · Free parking",
  },
  {
    id: "nat-8",
    name: "Florida Botanical Gardens",
    type: "botanical",
    area: "Largo, FL",
    description:
      "A 182-acre botanical garden in the heart of Pinellas County, free and open to the public. Themed gardens include a butterfly garden, tropical garden, native plant garden, and rose garden. A beautiful space for environmental education, relaxation, and community events year-round.",
    website: "https://www.flbgfoundation.org/",
    tags: ["botanical", "butterfly", "native plants", "free admission", "education"],
    image: U("1465146344425-f00d5f5c8f07"),
    highlight: "182 acres · Free admission · Pinellas County gem",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 2 — FOOD & COMMUNITY GARDENS
//  Community gardens, farms, food pantries, volunteer opportunities
// ─────────────────────────────────────────────────────────────────────────────
export const communityGardens = [
  {
    id: "gar-1",
    name: "Coalition of Community Gardens (Florida)",
    type: "network",
    area: "Statewide, FL",
    description:
      "A Florida-wide nonprofit network with a county-by-county directory of community gardens where individuals can sign up to volunteer. Whether you're in Tampa, St. Pete, or elsewhere in Florida, this is your starting point for finding a garden plot or volunteer shift near you.",
    website: "https://coalitionofcommunitygardens.weebly.com/about-us.html",
    tags: ["network", "volunteer", "statewide", "directory", "community"],
    image: U("1416879595882-3373a0480b5b"),
    highlight: "Statewide directory · Sign up by county",
  },
  {
    id: "gar-2",
    name: "Sweetwater Organic Community Farm",
    type: "farm",
    area: "Tampa, FL",
    description:
      "Join them every Sunday from 9am–12pm to help plant, harvest, and weed their certified organic fields. Sweetwater is a working community farm committed to organic food production, environmental education, and bringing neighbors together through shared labor and shared harvests.",
    website: "https://www.sweetwater-organic.org/community-programs/volunteer/",
    tags: ["organic", "volunteer", "food production", "Sunday mornings", "farm"],
    image: U("1530836369250-ef72a3f5cda8"),
    highlight: "Sundays 9 AM – 12 PM · Drop-in volunteering welcome",
    volunteerLink: "https://www.sweetwater-organic.org/community-programs/volunteer/",
  },
  {
    id: "gar-3",
    name: "Meacham Urban Farm",
    type: "farm",
    area: "Tampa, FL",
    description:
      "An urban farm in Tampa bringing fresh produce and agricultural education to the community. Meacham actively recruits volunteers to support their farming operations and community outreach — an excellent hands-on opportunity to learn urban agriculture while giving back.",
    website: "https://www.meachamfarm.com/volunteer",
    tags: ["urban farm", "volunteer", "food access", "education", "Tampa"],
    image: U("1464226184884-fa280b87c399"),
    highlight: "Volunteer sign-up open year-round",
    volunteerLink: "https://www.meachamfarm.com/volunteer",
  },
  {
    id: "gar-4",
    name: "813 Hood Community Garden",
    type: "community-garden",
    area: "Tampa, FL",
    description:
      "A grassroots neighborhood garden in the Tampa community that is always looking for more volunteers. Follow them on Facebook to stay updated on volunteer days, planting events, and how you can show up to support local food production and green community spaces.",
    website: "https://www.facebook.com/813hoodgarden/about",
    tags: ["grassroots", "neighborhood", "volunteer", "food garden", "Tampa"],
    image: U("1585320806297-9f3b98e6f8a2"),
    highlight: "Community-run · Check Facebook for volunteer days",
  },
  {
    id: "gar-5",
    name: "Tampa Bay Heights Community Garden",
    type: "community-garden",
    area: "Tampa, FL",
    description:
      "Located in the Tampa Bay Heights neighborhood, this community garden offers residents hands-on access to gardening in a collaborative, supportive environment. Part of the Tampa Bay Heights neighborhood association's commitment to green, livable neighborhoods.",
    website: "https://www.thjca.org/community-garden",
    tags: ["neighborhood", "community", "green space", "Tampa Heights", "plots"],
    image: U("1591857177580-dc9d574c3a73"),
    highlight: "Neighborhood garden · Open to Tampa Heights residents",
  },
  {
    id: "gar-6",
    name: "Temple Terrace Community Gardens",
    type: "community-garden",
    area: "Temple Terrace, FL",
    description:
      "Learn organic gardening from experienced community members or rent your own individual plot for just $35 per year. Temple Terrace Community Garden is a welcoming space for all skill levels, offering workshops, shared tools, and the joy of growing your own food organically.",
    website: "https://www.templeterracecommunitygarden.org/",
    tags: ["organic", "plot rental", "education", "beginner-friendly", "affordable"],
    image: U("1466637574441-749b8f19452f"),
    highlight: "Plot rental: $35/year · Organic methods · All skill levels welcome",
  },
  {
    id: "gar-7",
    name: "Vista Garden Tampa (Carrollwood)",
    type: "community-garden",
    area: "Carrollwood, Tampa, FL",
    description:
      "A community garden serving the Carrollwood area of Tampa. They actively compost and practice sustainable gardening, making them a great fit for environmentally-minded volunteers and gardeners. A quiet, welcoming green space with a strong sustainability ethic.",
    website: "https://www.vistagardentampa.org/",
    tags: ["composting", "sustainable", "Carrollwood", "green space", "organic"],
    image: U("1558383817-75d41d89f7e0"),
    highlight: "Composting program · Carrollwood neighborhood",
  },
  {
    id: "gar-8",
    name: "USF Community Garden & Farmer's Market",
    type: "community-garden",
    area: "St. Petersburg, FL",
    description:
      "USF St. Pete students and community members run a thriving campus garden and farmers market. Fresh produce grown on-site is sold at the market, creating a full loop from seed to sale. A hands-on model of campus sustainability and community food systems.",
    website: "https://crowsneststpete.com/2022/03/07/usf-community-garden-budding-crops-and-community/",
    tags: ["campus garden", "farmers market", "student-run", "USF", "food systems"],
    image: U("1604580864964-8c4c1e9f9f97"),
    highlight: "Student-run · Farmers market on campus",
  },
  {
    id: "gar-9",
    name: "Florida Learning Garden",
    type: "educational",
    area: "Tampa, FL",
    description:
      "A project of Keep Tampa Bay Beautiful, the Florida Learning Garden is a hands-on environmental education site where volunteers can help grow food, learn sustainable practices, and support environmental literacy in the Tampa community.",
    website: "https://www.keeptampabaybeautiful.org/florida-learning-garden/",
    tags: ["education", "Keep Tampa Bay Beautiful", "volunteer", "eco-literacy", "food"],
    image: U("1416879595882-3373a0480b5b"),
    highlight: "Part of Keep Tampa Bay Beautiful · Education-focused",
    volunteerLink: "https://www.keeptampabaybeautiful.org/florida-learning-garden/",
  },
  {
    id: "gar-10",
    name: "15th Street Farm",
    type: "farm",
    area: "St. Petersburg, FL",
    description:
      "A community farm in St. Pete offering volunteering in their Garden and Nutrition Education Program. 15th Street Farm connects neighbors with fresh food and gardening skills, with a special focus on nutrition education for people of all ages.",
    website: "https://www.15thstfarm.com/",
    tags: ["nutrition education", "St. Pete", "volunteer", "community farm", "food access"],
    image: U("1628352081506-7f98de55f9b1"),
    highlight: "Nutrition education program · St. Petersburg location",
    volunteerLink: "https://www.15thstfarm.com/",
  },
  {
    id: "gar-11",
    name: "St. Pete Youth Farm",
    type: "farm",
    area: "St. Petersburg, FL",
    description:
      "A youth-focused urban farm in St. Pete that grows food, builds skills, and nurtures the next generation of food-system leaders. The farm engages young people in every stage of farming while making fresh produce accessible to the community.",
    website: "https://www.stpeteyouthfarm.org/",
    tags: ["youth", "urban farm", "leadership", "food justice", "St. Pete"],
    image: U("1592982537447-6f2a6a0c8b16"),
    highlight: "Youth-centered · Food justice mission",
  },
  {
    id: "gar-12",
    name: "Tampa Bay Gardens (Tampa Garden Club)",
    type: "community-garden",
    area: "Tampa, FL",
    description:
      "The Tampa Garden Club offers community volunteer opportunities for anyone passionate about horticulture, plant conservation, and beautifying Tampa's public spaces. A welcoming community for gardeners of all backgrounds to connect and contribute.",
    website: "https://www.tampagardenclub.com/volunteer-opportunities/",
    tags: ["horticulture", "community", "beautification", "conservation", "volunteer"],
    image: U("1487530811176-3e4cae149994"),
    highlight: "Multiple volunteer opportunities · All skill levels",
    volunteerLink: "https://www.tampagardenclub.com/volunteer-opportunities/",
  },
  {
    id: "gar-13",
    name: "Keystone Farmers Market",
    type: "market",
    area: "Keystone, FL (Tampa area)",
    description:
      "This farmers market partners with Metropolitan Ministries to organize volunteers for garden keeping. A community anchor that connects local growers, shoppers, and volunteers — helping to maintain green spaces while supporting food access for those in need.",
    website: "https://www.keystonefarmersmarket.com/",
    tags: ["farmers market", "Metropolitan Ministries", "volunteer", "food access", "local growers"],
    image: U("1488459716781-b53afe3b1c24"),
    highlight: "Partners with Metropolitan Ministries · Garden volunteer needed",
    volunteerLink: "https://www.keystonefarmersmarket.com/",
  },
  {
    id: "gar-14",
    name: "Infinite Zion Farms",
    type: "farm",
    area: "Orlando, FL",
    description:
      "An urban agriculture initiative in Orlando addressing food insecurity by bringing farming into city environments. Infinite Zion Farms demonstrates how vertical growing, community partnerships, and sustainable practices can combat hunger in underserved urban neighborhoods.",
    website: "https://www.infinitezionfarms.org",
    tags: ["urban agriculture", "food security", "Orlando", "innovation", "vertical farming"],
    image: U("1559181567-c3190958d171"),
    highlight: "Urban agriculture innovation · Food insecurity focus",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION 3 — FOOD SECURITY & GIVING BACK
//  Pantries, food banks, volunteer organizations
// ─────────────────────────────────────────────────────────────────────────────
export const foodSecurityOrgs = [
  {
    id: "food-1",
    name: "Feeding Tampa Bay",
    type: "food-bank",
    area: "Tampa Bay Region, FL",
    description:
      "One of the largest hunger relief organizations in the Southeast, distributing millions of pounds of food to those in need across the Tampa Bay area. Volunteers help sort and pack food, and distribute at partner locations. Easy to sign up, high-impact, and deeply community-driven.",
    website: "https://feedingtampabay.org/volunteer/",
    tags: ["food bank", "hunger relief", "volunteer", "distribution", "high-impact"],
    image: U("1593113630400-ea4288922834"),
    highlight: "Millions of meals distributed · Easy sign-up · All ages welcome",
    volunteerLink: "https://feedingtampabay.org/volunteer/",
  },
  {
    id: "food-2",
    name: "Tampa Bay Network to End Hunger",
    type: "advocacy",
    area: "Tampa Bay Region, FL",
    description:
      "Works to eliminate hunger by advocating for policy changes, launching new programs, and collaborating with partner organizations. Beyond food distribution, they tackle the systemic roots of hunger through civic advocacy. Volunteers can get involved in policy work, outreach, and events.",
    website: "https://networktoendhunger.org/",
    tags: ["advocacy", "policy", "hunger", "systemic change", "coalition"],
    image: U("1509099836639-3a95a8e9e8d7"),
    highlight: "Policy advocacy · Systems-change approach",
    volunteerLink: "https://networktoendhunger.org/",
  },
  {
    id: "food-3",
    name: "Mission Tampa",
    type: "nonprofit",
    area: "Tampa, FL",
    description:
      "Incorporated in 2004, Mission Tampa is a 501(c)3 Christian nonprofit serving the spiritual, emotional, and physical needs of Tampa Bay's poor and homeless. Their Mission Smiles program lets you volunteer as a dental assistant providing free dental care to underserved communities — full on-site training provided.",
    website: "https://www.missiontampa.org/",
    tags: ["homeless services", "dental care", "volunteer", "nonprofit", "underserved"],
    image: U("1609220136736-443140ed9a5f"),
    highlight: "Mission Smiles dental volunteering · On-site training provided",
    volunteerLink: "https://www.missiontampa.org/",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  Meta
// ─────────────────────────────────────────────────────────────────────────────
export const gardenPageMeta = {
  region: "Tampa Bay & Florida",
  totalNaturePlaces: naturePlaces.length,
  totalCommunityGardens: communityGardens.length,
  totalFoodSecurityOrgs: foodSecurityOrgs.length,
  tagline: "Enjoy Nature. Grow Together. Give Back.",
  lastUpdated: "2026-04",
};
