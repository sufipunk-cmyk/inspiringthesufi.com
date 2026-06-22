/**
 * Per-post metadata table — hand-curated from the WXR titles + the
 * §3 slug list in `specs/m2-archive/document.md`.
 *
 * Why a hand-curated table:
 *  Squarespace post titles are inconsistently formatted (e.g.
 *  "1. Man in the Mirror (Michael Jackson) -  Al Karim (The Generous)"
 *   vs
 *   "8. When am I going to make a Living? - Al Muqit (The Sustainer) Sade (UK)"
 *   vs
 *   "21 Niyaz/Azam Ali - Al Khaliq (The Creator), Canada/Iran"
 *  ).
 *  No regex would parse all 49 reliably without silent corrections.
 *  Naz's Q1 decision is explicit: do not silently change wording.
 *
 * Slug values follow Naz's Q1 decision: her original wording (Ya Darr,
 * Al Sabur, Ya Jami, Ya Muhaimin) appears in the slug too, NOT the
 * canonical Arabic transliteration.
 *
 * Country values follow Naz's Q2 decision: null where the original
 * Squarespace title didn't supply one. No inference.
 */

export type PostMetadata = {
  oldPostId: string;
  postNumber: string; // display "1", "45/46"
  postNumberSort: number; // sort key 1..50
  slug: string; // URL slug
  name: { english: string; meaning: string };
  secondName?: { english: string; meaning: string };
  song: {
    title: string;
    artist: string;
    country: string | null;
  };
};

/**
 * Indexed by oldPostId. The order in this array also doubles as the
 * canonical post-number sort order — Post 1 first, Post 50 last.
 */
export const POST_METADATA: PostMetadata[] = [
  {
    oldPostId: "1",
    postNumber: "1",
    postNumberSort: 1,
    slug: "01-al-karim",
    name: { english: "Al Karim", meaning: "The Generous" },
    song: {
      title: "Man in the Mirror",
      artist: "Michael Jackson",
      country: "USA",
    },
  },
  {
    oldPostId: "3",
    postNumber: "2",
    postNumberSort: 2,
    slug: "02-al-mutakabbir",
    name: { english: "Al Mutakabbir", meaning: "The Majestic" },
    song: {
      title: "I adore the Sea",
      artist: "Nagat Al Saghira",
      country: "Egypt",
    },
  },
  {
    oldPostId: "5",
    postNumber: "3",
    postNumberSort: 3,
    slug: "03-al-batin",
    name: { english: "Al Batin", meaning: "The Hidden" },
    song: {
      title: "Hidden Place",
      artist: "Björk",
      country: null, // no country in Squarespace title
    },
  },
  {
    oldPostId: "7",
    postNumber: "4",
    postNumberSort: 4,
    slug: "04-al-mumit",
    name: { english: "Al Mumit", meaning: "The Causer of Death" },
    song: {
      title: "Let Go",
      artist: "Clinton Cerejo feat. Master Saleem (Coke Studio India)",
      country: "India",
    },
  },
  {
    oldPostId: "13",
    postNumber: "5",
    postNumberSort: 5,
    slug: "05-al-gafur",
    name: { english: "Al Gafur", meaning: "The Forgiving" },
    song: { title: "Hello", artist: "Adele", country: "UK" },
  },
  {
    oldPostId: "15",
    postNumber: "6",
    postNumberSort: 6,
    slug: "06-al-rashid",
    name: { english: "Al Rashid", meaning: "The Guide" },
    song: {
      title: "Amay Bhashaili",
      artist: "Alamgir & Fariha Pervez (Coke Studio)",
      country: "Pakistan",
    },
  },
  {
    oldPostId: "19",
    postNumber: "7",
    postNumberSort: 7,
    slug: "07-al-wadud",
    name: { english: "Al Wadud", meaning: "The Loving One" },
    song: {
      title: "Remember the Loveliness",
      artist: "Mercan Dede",
      country: "Turkey",
    },
  },
  {
    oldPostId: "9",
    postNumber: "8",
    postNumberSort: 8,
    slug: "08-al-muqit",
    name: { english: "Al Muqit", meaning: "The Sustainer" },
    song: {
      title: "When Am I Going to Make a Living?",
      artist: "Sade",
      country: "UK",
    },
  },
  {
    oldPostId: "11",
    postNumber: "9",
    postNumberSort: 9,
    slug: "09-al-badi",
    name: { english: "Al Badi", meaning: "The Originator" },
    song: {
      title: "Yny Maj Hyrynh",
      artist: "Marlui Miranda",
      country: "Brazil",
    },
  },
  {
    oldPostId: "17",
    postNumber: "10",
    postNumberSort: 10,
    slug: "10-al-nur",
    name: { english: "Al Nur", meaning: "The Light" },
    song: {
      title: "Khallini Biljao",
      artist: "Maya Nasri",
      country: "Lebanon",
    },
  },
  {
    oldPostId: "29",
    postNumber: "11",
    postNumberSort: 11,
    slug: "11-al-khafid",
    name: { english: "Al Khafid", meaning: "The Abaser" },
    song: {
      title: "Nezlen Ala El Boustan",
      artist: "Kulna Sawa",
      country: "Syria",
    },
  },
  {
    oldPostId: "31",
    postNumber: "12",
    postNumberSort: 12,
    slug: "12-ar-raqib",
    name: { english: "Ar Raqib", meaning: "The Watchful" },
    song: {
      title: "Guardian",
      artist: "Alanis Morissette",
      country: "Canada",
    },
  },
  {
    oldPostId: "33",
    postNumber: "13",
    postNumberSort: 13,
    slug: "13-al-muhyi",
    name: { english: "Al Muhyi", meaning: "The Giver of Life" },
    song: {
      title: "Zariya",
      artist: "A.R. Rahman, Ani Choying & Farah Siraj (Coke Studio India)",
      country: "India",
    },
  },
  {
    oldPostId: "41",
    postNumber: "14",
    postNumberSort: 14,
    slug: "14-ar-rahman",
    name: { english: "Ar Rahman", meaning: "The Most Compassionate" },
    song: {
      title: "Faraway",
      artist: "Demis Roussos",
      country: "Egypt/Greece",
    },
  },
  {
    oldPostId: "35",
    postNumber: "15",
    postNumberSort: 15,
    slug: "15-al-quddus",
    name: { english: "Al Quddus", meaning: "The Most Holy" },
    song: { title: "Didi", artist: "Cheb Khaled", country: "Algeria" },
  },
  {
    oldPostId: "37",
    postNumber: "16",
    postNumberSort: 16,
    slug: "16-al-afuw",
    name: { english: "Al Afuw", meaning: "The Pardoner" },
    song: {
      title: "Chaadni Ratey",
      artist: "Noor Jahan",
      country: "Pakistan",
    },
  },
  {
    oldPostId: "39",
    postNumber: "17",
    postNumberSort: 17,
    slug: "17-as-salam",
    name: { english: "As Salam", meaning: "The All Peaceful" },
    song: {
      title: "Peace",
      artist: "Ajeet Kaur",
      country: null, // no country in Squarespace title
    },
  },
  {
    oldPostId: "43",
    postNumber: "18",
    postNumberSort: 18,
    slug: "18-al-mudhill",
    name: { english: "Al Mudhill", meaning: "The Humiliator" },
    song: { title: "I Am Eve", artist: "Mahsa Vahdat", country: "Iran" },
  },
  {
    oldPostId: "45",
    postNumber: "19",
    postNumberSort: 19,
    slug: "19-al-majid",
    name: { english: "Al Majid", meaning: "The Most Glorious" },
    song: {
      title: "Gold",
      artist: "Prince",
      country: "USA",
    },
  },
  {
    oldPostId: "49",
    postNumber: "20",
    postNumberSort: 20,
    slug: "20-al-mani",
    name: { english: "Al Mani", meaning: "The Preventer of Harm" },
    song: {
      title: "",
      artist: "Mariem Hassan",
      country: "Western Sahara",
    },
  },
  {
    oldPostId: "47",
    postNumber: "21",
    postNumberSort: 21,
    slug: "21-al-khaliq",
    name: { english: "Al Khaliq", meaning: "The Creator" },
    song: {
      title: "",
      artist: "Niyaz / Azam Ali",
      country: "Canada/Iran",
    },
  },
  {
    oldPostId: "51",
    postNumber: "22",
    postNumberSort: 22,
    slug: "22-al-haqq",
    name: { english: "Al Haqq", meaning: "The Truth" },
    song: { title: "", artist: "Abrar-ul-Haq", country: "Pakistan" },
  },
  {
    oldPostId: "57",
    postNumber: "23",
    postNumberSort: 23,
    slug: "23-al-awwal",
    name: { english: "Al-Awwal", meaning: "The First" },
    song: {
      title: "Poem of the Cloak (Burdah)",
      artist: "Khalid Belrhouzi",
      country: "France",
    },
  },
  {
    oldPostId: "53",
    postNumber: "24",
    postNumberSort: 24,
    slug: "24-al-kabir",
    name: { english: "Al Kabir", meaning: "The Most Great" },
    song: {
      title: "Kabir Poetry",
      artist: "(various readings)",
      country: "India",
    },
  },
  {
    oldPostId: "55",
    postNumber: "25",
    postNumberSort: 25,
    slug: "25-al-hayy",
    name: { english: "Al Hayy", meaning: "The Forever Living" },
    song: { title: "Lay Next to You", artist: "Sam Smith", country: "UK" },
  },
  {
    oldPostId: "61",
    postNumber: "26",
    postNumberSort: 26,
    slug: "26-al-akhir",
    name: { english: "Al Akhir", meaning: "The Last" },
    song: { title: "Eid Mubarak", artist: "Harris J", country: "UK" },
  },
  {
    oldPostId: "59",
    postNumber: "27",
    postNumberSort: 27,
    slug: "27-al-wahid",
    name: { english: "Al-Wahid", meaning: "The One" },
    song: { title: "Englistan", artist: "Riz MC", country: "UK" },
  },
  {
    oldPostId: "63",
    postNumber: "28",
    postNumberSort: 28,
    slug: "28-al-musawwir",
    name: {
      english: "Al Musawwir",
      meaning: "The Bestower of Form, The Shaper",
    },
    song: { title: "", artist: "Arooj Aftab", country: "USA/Pakistan" },
  },
  {
    oldPostId: "65",
    postNumber: "29",
    postNumberSort: 29,
    slug: "29-al-mutaali",
    name: { english: "Al Muta'ali", meaning: "The Most Exalted" },
    song: {
      title: "The Mirror of My Soul",
      artist: "Rim Banna",
      country: "Palestine",
    },
  },
  {
    oldPostId: "67",
    postNumber: "30",
    postNumberSort: 30,
    slug: "30-al-bari",
    name: { english: "Al Bari", meaning: "The Maker" },
    song: { title: "", artist: "Desert Dwellers", country: "USA" },
  },
  {
    oldPostId: "71",
    postNumber: "31",
    postNumberSort: 31,
    slug: "31-al-tawwab",
    name: {
      english: "Al Tawwab",
      meaning: "The Granter and Accepter of Repentance",
    },
    song: {
      title: "",
      artist: "Louisa Marks & Carroll Thompson",
      country: "UK",
    },
  },
  {
    oldPostId: "69",
    postNumber: "32",
    postNumberSort: 32,
    slug: "32-al-hafiz",
    name: { english: "Al Hafiz", meaning: "The Preserver" },
    song: { title: "Ya Sen Ya Hiç", artist: "Bendeniz", country: "Turkey" },
  },
  {
    oldPostId: "23",
    postNumber: "33",
    postNumberSort: 33,
    slug: "33-al-baqi",
    name: { english: "Al Baqi", meaning: "The Everlasting" },
    song: {
      title: "Saa Magni (Death Is Terrible)",
      artist: "Oumou Sangaré",
      country: "Mali",
    },
  },
  {
    oldPostId: "21",
    postNumber: "34",
    postNumberSort: 34,
    slug: "34-ya-darr",
    name: { english: "Ya Darr", meaning: "The Aflicter" },
    song: {
      title: "Sidi Mansour",
      artist: "Cheikha Rimitti (ft. Robert Fripp & Flea)",
      country: "Algeria",
    },
  },
  {
    oldPostId: "73",
    postNumber: "35",
    postNumberSort: 35,
    slug: "35-al-muid",
    name: { english: "Al Muid", meaning: "The Restorer of Life" },
    song: { title: "Sheep", artist: "Gonjasufi", country: "USA" },
  },
  {
    oldPostId: "25",
    postNumber: "36",
    postNumberSort: 36,
    slug: "36-al-alim",
    name: { english: "Al Alim", meaning: "The All Knowing" },
    song: {
      title: "Miracle",
      artist: "Above & Beyond / OceanLab",
      country: "UK",
    },
  },
  {
    oldPostId: "27",
    postNumber: "37",
    postNumberSort: 37,
    slug: "37-malikal-mulk",
    name: { english: "Malikal Mulk", meaning: "Owner of Kingdom" },
    song: { title: "Royals", artist: "Lorde", country: "New Zealand" },
  },
  {
    oldPostId: "83",
    postNumber: "38",
    postNumberSort: 38,
    slug: "38-al-muqsit",
    name: { english: "Al Muqsit", meaning: "The Equitable" },
    song: {
      title: "Nadia",
      artist: "Nitin Sawhney & Nicki Wells",
      country: "UK",
    },
  },
  {
    oldPostId: "77",
    postNumber: "39",
    postNumberSort: 39,
    slug: "39-al-qabid",
    name: { english: "Al Qabid", meaning: "The Withholder" },
    song: {
      title: "",
      artist: "The Verve",
      country: "UK",
    },
  },
  {
    oldPostId: "79",
    postNumber: "40",
    postNumberSort: 40,
    slug: "40-al-muntaqim",
    name: { english: "Al Muntaqim", meaning: "The Avenger" },
    song: {
      title: "",
      artist: "Lauryn Hill",
      country: "USA",
    },
  },
  {
    oldPostId: "81",
    postNumber: "41",
    postNumberSort: 41,
    slug: "41-al-sabur",
    name: { english: "Al Sabur", meaning: "The Patient One" },
    song: {
      title: "Looking Through Patient Eyes",
      artist: "PM Dawn",
      country: "USA",
    },
  },
  {
    oldPostId: "75",
    postNumber: "42",
    postNumberSort: 42,
    slug: "42-al-aliyy",
    name: { english: "Al Aliyy", meaning: "The Most High" },
    song: {
      title: "I Only Have Eyes for You",
      artist: "The Flamingos",
      country: "USA",
    },
  },
  {
    oldPostId: "85",
    postNumber: "43",
    postNumberSort: 43,
    slug: "43-al-qahhar",
    name: { english: "Al Qahhar", meaning: "The Subduer" },
    song: { title: "Eye of the Tiger", artist: "Survivor", country: "USA" },
  },
  {
    oldPostId: "87",
    postNumber: "44",
    postNumberSort: 44,
    slug: "44-al-halim",
    name: { english: "Al Halim", meaning: "The Forbearing" },
    song: {
      title: "Nimma Nimma",
      artist: "Shani Arshad",
      country: "Pakistan",
    },
  },
  {
    oldPostId: "89",
    postNumber: "45/46",
    postNumberSort: 45,
    slug: "45-46-al-mumin-al-qayyum",
    name: { english: "Al Mumin", meaning: "The Granter of Security" },
    secondName: { english: "Al Qayyum", meaning: "The Self-Existing" },
    song: { title: "", artist: "Tina Turner", country: "USA" },
  },
  {
    oldPostId: "95",
    postNumber: "47",
    postNumberSort: 47,
    slug: "47-al-muqtadir",
    name: { english: "Al Muqtadir", meaning: "The Powerful" },
    song: {
      title: "Poems of Rumi",
      artist: "Madonna & Deepak Chopra",
      country: "USA/India",
    },
  },
  {
    oldPostId: "91",
    postNumber: "48",
    postNumberSort: 48,
    slug: "48-ya-jami",
    name: { english: "Ya Jami", meaning: "The Gatherer" },
    song: { title: "Bag Lady", artist: "Erykah Badu", country: "USA" },
  },
  {
    oldPostId: "93",
    postNumber: "49",
    postNumberSort: 49,
    slug: "49-al-basit",
    name: { english: "Al Basit", meaning: "The Expander" },
    song: {
      title: "Disco Deewane",
      artist: "Nazia & Zoheb Hassan",
      country: "Pakistan",
    },
  },
  {
    oldPostId: "97",
    postNumber: "50",
    postNumberSort: 50,
    slug: "50-ya-muhaimin",
    name: { english: "Ya Muhaimin", meaning: "The Guardian" },
    song: {
      title: "Moornie",
      artist: "Punjabi MC",
      country: "UK/India",
    },
  },
];

if (POST_METADATA.length !== 49) {
  throw new Error(
    `POST_METADATA must have exactly 49 entries; got ${POST_METADATA.length}`,
  );
}

export const METADATA_BY_OLD_ID: Record<string, PostMetadata> = Object.fromEntries(
  POST_METADATA.map((m) => [m.oldPostId, m]),
);

export const METADATA_BY_SLUG: Record<string, PostMetadata> = Object.fromEntries(
  POST_METADATA.map((m) => [m.slug, m]),
);