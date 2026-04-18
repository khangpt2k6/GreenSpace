// Solarpunk Cafes — Tampa Bay & Florida Region
// Definition: Cafes with lush greenery/nature settings, community-first values,
// and spaces where people gather, hang out, and talk. Eco-conscious by design.
//
// Data sourced via web research (April 2026).

const Q = "?auto=format&fit=crop&w=900&q=80";
const U = (id) => `https://images.unsplash.com/photo-${id}${Q}`;

export const solarpunkCafes = [
  {
    id: "cafe-1",
    name: "Felicitous Coffee & Tea",
    neighborhood: "Temple Terrace",
    city: "Tampa",
    state: "FL",
    address: "11706 N 51st St, Tampa, FL 33617",
    secondLocation: "14204 N 42nd St, Tampa, FL 33613",
    phone: null,
    hours: {
      mainLocation: "Daily 7:30 AM – 7:00 PM",
      secondLocation: "Mon–Fri 9:00 AM – 6:00 PM · Sat–Sun 9:00 AM – 4:30 PM",
    },
    website: "https://felicitouscoffee.com",
    instagram: "@felicitouscoffee",
    description:
      "Tucked inside a purple cottage off the main drag of Temple Terrace, Felicitous feels like stepping into a solarpunk dream. Wild Florida native plants grow near the parking lot, and on-site herbs — mint and others — are cultivated directly into pastries and signature espresso drinks. The menu is fully vegan and gluten-free friendly. Every second Friday, Felicitous hosts a Night Market spilling out onto the grounds: street food, local arts and crafts, live music, and tarot cards make it a true neighborhood gathering ritual.",
    features: [
      "Wild native Florida plants on property",
      "Herbs grown on-site used in drinks & pastries",
      "Vegan & gluten-free menu",
      "Monthly Night Market (2nd Fridays)",
      "Community gathering space",
      "Independent, locally roasted coffee",
    ],
    menuHighlights: [
      "Herb-infused signature espresso drinks",
      "Vegan & gluten-free pastries",
      "Specialty lattes",
      "Fresh-roasted coffee",
    ],
    communityEvents: [
      "Felicitous Night Market — 2nd Friday of every month (street food, local art, music, tarot)",
    ],
    vibe: ["lush", "cozy cottage", "nature-forward", "community market", "vegan-friendly"],
    solarpunkScore: 95,
    image: U("1509042239860-f550ce710b93"),
  },

  {
    id: "cafe-2",
    name: "Black Crow Coffee Co.",
    neighborhood: "Grand Central District",
    city: "St. Petersburg",
    state: "FL",
    address: "2157 1st Ave S, St. Petersburg, FL 33712",
    secondLocation: "722 2nd St N, St. Petersburg, FL 33701",
    phone: null,
    hours: {
      mainLocation: "Mon–Fri 7:00 AM – 4:00 PM · Sat–Sun 7:00 AM – 5:00 PM",
      secondLocation: "Varies — check website",
    },
    website: "https://www.blackcrowcoffeeco.com",
    instagram: "@blackcrowcoffeeco",
    description:
      "Florida's first certified zero-waste coffeehouse and the first zero-waste business in all of St. Pete. Black Crow diverts over 90% of its waste from landfills through mindful purchasing, staff training, and community education. The Grand Central location wraps around a dreamy outdoor courtyard filled with abundant greenery, antiques, and eclectic seating — a neighborhood living room where artists, neighbors, and regulars all converge. Next door to Tombolo Books, it's become an anchor of the local creative ecosystem.",
    features: [
      "Florida's first certified zero-waste coffeehouse",
      "90%+ waste diverted from landfills",
      "Lush outdoor courtyard with abundant plants",
      "Art showcasing for local artists",
      "Adjacent to Tombolo Books (community hub)",
      "Eclectic antique-filled interiors",
    ],
    menuHighlights: [
      "House-roasted specialty coffee",
      "Locally sourced pastries",
      "Seasonal drinks",
    ],
    communityEvents: [
      "Rotating local art exhibitions",
      "Community events and pop-ups",
    ],
    vibe: ["zero-waste", "courtyard greenery", "artsy", "bookish neighborhood", "community anchor"],
    solarpunkScore: 98,
    image: U("1501339847302-ac426a4a7cbb"),
  },

  {
    id: "cafe-3",
    name: "Blooming Floral Cafe",
    neighborhood: "Seminole Heights",
    city: "Tampa",
    state: "FL",
    address: "4408 N Florida Ave, Tampa, FL 33603",
    phone: "(813) 445-9251",
    hours: {
      mainLocation: "Tue–Fri 9:00 AM – 5:00 PM · Sat–Sun 9:00 AM – 3:00 PM · Mon Closed",
    },
    website: "https://www.thebloomingfloralcafe.com",
    instagram: "@bloomingfloralcafe",
    description:
      "Part coffee shop, part floral boutique, entirely in bloom. Blooming Floral Cafe in Seminole Heights was born from Venezuelan roots and nearly three decades of Tampa love. Owner Carol has transformed her passion for floral design into a warm community space where visitors can linger over specialty lattes and Venezuelan Cachitos, surrounded by fresh-cut flowers and vintage décor. A true neighborhood marketplace feel — equal parts café, gift shop, and gathering spot for the Seminole Heights community.",
    features: [
      "Floor-to-ceiling fresh flowers & botanicals",
      "Part coffee shop, part floral boutique",
      "Venezuelan-rooted, woman-owned",
      "Locally beloved neighborhood spot",
      "Vintage floral décor throughout",
      "Gifts and florals available to take home",
    ],
    menuHighlights: [
      "Venezuelan Cachitos (savory pastries)",
      "Specialty lattes",
      "Matcha drinks",
      "Tea selection",
      "Seasonal floral-inspired beverages",
    ],
    communityEvents: [
      "Pop-up floral & market events",
      "Neighborhood community gatherings",
    ],
    vibe: ["floral paradise", "vintage whimsy", "woman-owned", "neighborhood marketplace", "cozy"],
    solarpunkScore: 88,
    image: U("1554118811-1e0d58224f24"),
  },

  {
    id: "cafe-4",
    name: "Lady & The Mug",
    neighborhood: "Hyde Park / University of Tampa",
    city: "Tampa",
    state: "FL",
    address: "510 W Grand Central Ave, Tampa, FL 33606",
    phone: "(813) 374-4871",
    hours: {
      mainLocation: "Mon–Fri 7:00 AM – 4:00 PM · Sat–Sun 8:00 AM – 4:00 PM",
    },
    website: "https://ladyandthemugcoffee.square.site",
    instagram: "@ladyandthemug",
    description:
      "Tucked along the cobblestone streets across from the University of Tampa, Lady & The Mug wraps visitors in a whimsical world of indoor trees, climbing greenery, a butterfly bench, and two floral swings. The owners believe coffee is just an excuse to do good — if this shop isn't adding value to its community, it shouldn't exist. They mean it. A quiet \"SHHH Room\" invites focused work or recharging in solitude, while the main space buzzes softly with neighborly energy. Gluten-free friendly, with an eclectic, welcoming spirit.",
    features: [
      "Indoor trees and climbing greenery",
      "Floral swings & butterfly bench",
      "Community-first philosophy",
      "Quiet 'SHHH Room' for focused work or rest",
      "Gluten-free friendly",
      "Enchanting fairytale aesthetic",
    ],
    menuHighlights: [
      "Specialty lattes",
      "Cold brew",
      "Gluten-free baked goods",
      "Seasonal whimsical drinks",
    ],
    communityEvents: [
      "Community pop-ups and local collaborations",
    ],
    vibe: ["enchanting", "indoor garden", "community-first", "whimsical", "quiet retreat"],
    solarpunkScore: 91,
    image: U("1495474472893-0f4d2d5e5a93"),
  },

  {
    id: "cafe-5",
    name: "Paradeco Coffee Roasters",
    neighborhood: "Downtown",
    city: "St. Petersburg",
    state: "FL",
    address: "111 2nd Ave NE Suite 101, St. Petersburg, FL 33701",
    phone: null,
    hours: {
      mainLocation:
        "Mon–Thu 7:00 AM – 5:00 PM · Fri 7:00 AM – 6:00 PM · Sat–Sun 8:00 AM – 6:00 PM",
    },
    website: "https://paradecocoffee.com",
    instagram: "@paradecocoffee",
    description:
      "Paradeco sits at the intersection of Art Deco and tropical Florida — a stunning downtown St. Pete roastery where 195 live plants climb a towering wall above a vintage pink sofa. The vibe is effortlessly lush: specialty coffee roasted in-house, fresh food, and a design that feels like a greenhouse merged with a 1970s resort lobby. Community is baked into its origins — local St. Pete businesses helped bring Paradeco to life, and the space continues to return the favor by welcoming everyone from laptop workers to lingering friends.",
    features: [
      "Live plant wall with 195 plants",
      "In-house specialty coffee roasting",
      "Art Deco meets tropical Florida aesthetic",
      "Waterfront second location",
      "Community-built origin story",
      "Fresh food menu",
    ],
    menuHighlights: [
      "Locally roasted specialty espresso",
      "Pour-overs and filter coffee",
      "Fresh food and sandwiches",
      "Specialty seasonal drinks",
    ],
    communityEvents: [
      "Community roasting events",
      "Local business collaborations",
    ],
    vibe: ["plant wall", "Art Deco tropical", "roastery", "downtown gathering", "lush interiors"],
    solarpunkScore: 90,
    image: U("1462275646964-a0e3386b89fa"),
  },

  {
    id: "cafe-6",
    name: "Grassroots Kava House",
    neighborhood: "Ybor City / Seminole Heights / Downtown St. Pete",
    city: "Tampa & St. Petersburg",
    state: "FL",
    address: "1925 E 6th Ave, Tampa, FL 33605",
    secondLocation: "5248 N Florida Ave, Tampa, FL 33603",
    thirdLocation: "957 Central Ave, St. Petersburg, FL 33705",
    phone: null,
    hours: {
      tampaLocations: "Mon–Fri 7:00 AM – 9:00 PM · Sat–Sun 8:00 AM – 9:00 PM",
    },
    website: "https://grassrootskavahouse.com",
    instagram: "@grassrootskava",
    description:
      "Grassroots is where botanical culture and community ritual meet. They serve the finest Vanuatu kava alongside locally roasted coffee and a hand-curated selection of herbal and botanical teas — drinks rooted in the earth, not the mainstream. Three locations across Tampa and St. Pete each carry their own personality while sharing the same ethos: an active, healthy, creative, community-based lifestyle. Whether you're working late, meeting up with friends, or just need a quiet corner with something warm and herbal, Grassroots holds the space.",
    features: [
      "Kava, coffee & botanical herbal teas",
      "Three community locations (Ybor, Seminole Heights, St. Pete)",
      "Community and wellness lifestyle focus",
      "Free WiFi and comfortable indoor/outdoor seating",
      "Late-night hangout hours",
      "Plant-rooted beverage philosophy",
    ],
    menuHighlights: [
      "Vanuatu kava",
      "Locally roasted coffee",
      "Botanical and herbal teas",
      "Wellness-forward drinks",
    ],
    communityEvents: [
      "Community meet-ups and wellness events",
      "Late-night social gatherings",
    ],
    vibe: ["botanical", "wellness", "late-night", "multi-location community", "herbal ritual"],
    solarpunkScore: 87,
    image: U("1511920183353-a05db98da36a"),
  },
];

// ── Summary metadata ──────────────────────────────────────────────────────────

export const solarpunkCafesMeta = {
  region: "Tampa Bay & Florida Region",
  totalCafes: solarpunkCafes.length,
  solarpunkDefinition:
    "A solarpunk cafe embraces lush greenery and natural settings, operates with community as its core mission, and creates space for people to gather, slow down, and connect — ideally with eco-conscious or zero-waste practices woven into the fabric of the business.",
  topPick: "cafe-2", // Black Crow Coffee Co. — FL's first certified zero-waste coffeehouse
  cities: ["Tampa", "St. Petersburg"],
  lastUpdated: "2026-04",
};
