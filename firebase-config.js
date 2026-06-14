/* =============================================================
   LOKMA CDN — Firebase configuration
   -------------------------------------------------------------
   1) Go to https://console.firebase.google.com  →  Add project.
   2) Add a "Web app" (the </> icon). Copy the config it shows you
      and paste the values below, replacing every PASTE_... part.
   3) Build → Authentication → Sign-in method → enable "Phone".
   4) Build → Firestore Database → Create database (Production mode).
   5) Upgrade the project to the "Blaze" plan (required to send SMS).
      The first 10 SMS each day are free; after that it's a few
      cents each. Set a budget alert/cap so there are no surprises.
   ============================================================= */

window.firebaseConfig = {
  apiKey:            "PASTE_API_KEY",
  authDomain:        "PASTE_PROJECT_ID.firebaseapp.com",
  projectId:         "PASTE_PROJECT_ID",
  storageBucket:     "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId:             "PASTE_APP_ID"
};

/* Card settings — change once here, applies everywhere. */
window.LOKMA = {
  TOTAL_STAMPS: 8,    // slots on the card
  HEAD_START:   2,    // stamps granted free at signup (endowed-progress head start)
  ORDER_URL:    "https://order.online/business/~338911/en-US", // "Full menu" link
  STAFF_PIN:    "1234" // local gate on staff page (Firestore rules are the real lock — see README)
};
