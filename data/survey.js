export const LIKERT_SCALE = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Moderately Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Moderately Agree" },
  { value: 5, label: "Strongly Agree" }
];

export const surveyMeta = {
  title: "Student Consumer Behavior & Sustainability Survey",
  subtitle:
    "IDH 3350 · University of South Florida · Tampa, FL",
  description:
    "This survey explores how students make purchasing decisions and how those choices connect to environmental values. Your responses inform ongoing research on consumer behavior and sustainability."
};

export const surveyQuestions = [
  // Section A — Awareness
  {
    id: "q1",
    section: "Environmental Awareness",
    text: "I am aware of the environmental impact of the products I purchase daily."
  },
  {
    id: "q2",
    section: "Environmental Awareness",
    text: "I regularly look for eco-labels or sustainability certifications when shopping."
  },
  {
    id: "q3",
    section: "Environmental Awareness",
    text: "I understand what the terms 'carbon footprint' and 'circular economy' mean."
  },
  {
    id: "q4",
    section: "Environmental Awareness",
    text: "I feel informed enough to make environmentally responsible purchasing decisions."
  },

  // Section B — Attitudes
  {
    id: "q5",
    section: "Attitudes Toward Sustainable Consumption",
    text: "Buying sustainably made products is important to me personally."
  },
  {
    id: "q6",
    section: "Attitudes Toward Sustainable Consumption",
    text: "I believe individual purchasing choices can make a meaningful difference to the environment."
  },
  {
    id: "q7",
    section: "Attitudes Toward Sustainable Consumption",
    text: "I would pay a premium for a product that is certified as environmentally friendly."
  },
  {
    id: "q8",
    section: "Attitudes Toward Sustainable Consumption",
    text: "I prefer buying secondhand or refurbished products over buying new when possible."
  },

  // Section C — Behavior
  {
    id: "q9",
    section: "Actual Purchasing Behavior",
    text: "In the past month, I consciously avoided buying a product due to environmental concerns."
  },
  {
    id: "q10",
    section: "Actual Purchasing Behavior",
    text: "I actively reduce the amount of single-use plastics I purchase."
  },
  {
    id: "q11",
    section: "Actual Purchasing Behavior",
    text: "I research a brand's environmental practices before making a significant purchase."
  },
  {
    id: "q12",
    section: "Actual Purchasing Behavior",
    text: "I choose local or low-packaging options at grocery stores or markets."
  },

  // Section D — Social Influence
  {
    id: "q13",
    section: "Social & Peer Influence",
    text: "My friends and peers influence my decision to buy eco-friendly products."
  },
  {
    id: "q14",
    section: "Social & Peer Influence",
    text: "I have shared information about sustainable products or practices on social media."
  },
  {
    id: "q15",
    section: "Social & Peer Influence",
    text: "I feel social pressure to appear environmentally conscious in my choices."
  },

  // Section E — Barriers
  {
    id: "q16",
    section: "Barriers to Sustainable Shopping",
    text: "Price is the biggest barrier preventing me from buying more eco-friendly products."
  },
  {
    id: "q17",
    section: "Barriers to Sustainable Shopping",
    text: "It is difficult to find trustworthy information about a product's sustainability."
  },
  {
    id: "q18",
    section: "Barriers to Sustainable Shopping",
    text: "I find it inconvenient to shop sustainably compared to conventional shopping."
  },

  // Section F — Platform Impact
  {
    id: "q19",
    section: "GreenCart Platform Impact",
    text: "A platform like GreenCart that scores product sustainability would change how I shop."
  },
  {
    id: "q20",
    section: "GreenCart Platform Impact",
    text: "Seeing a sustainability score on a product page would make me more likely to choose an eco-friendly option."
  },
  {
    id: "q21",
    section: "GreenCart Platform Impact",
    text: "Access to greener alternatives suggested by AI would help me make better purchasing decisions."
  },
  {
    id: "q22",
    section: "GreenCart Platform Impact",
    text: "Community features (volunteer matching, social feed) motivate me to take environmental action."
  }
];
