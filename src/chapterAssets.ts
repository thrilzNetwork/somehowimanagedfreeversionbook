/**
 * Static assets for the digital book chapters.
 *
 * To replace an image and avoid using Gemini API tokens:
 * 1. Place your image in the public/ folder (e.g., public/assets/foreword.jpg)
 * 2. Update the corresponding ID below with the path (e.g., ch0: "/assets/foreword.jpg")
 *
 * If the value is an empty string "", the app will automatically generate
 * a cinematic visual using the Gemini API.
 *
 * Fallback placeholders use picsum.photos seeded images so new deployments
 * don't hit blank spaces while Firestore loads. Replace with your own
 * hosted images when available.
 */
export const STATIC_CHAPTER_IMAGES: Record<string, string> = {
  ch0: "https://picsum.photos/seed/ch0-foreword/800/450", // Foreword: The Houseman Who Fell in Love
  ch1: "https://picsum.photos/seed/ch1-dayzero/800/450", // Day Zero: Opening a Hotel From Scratch
  ch2: "https://picsum.photos/seed/ch2-turnaround/800/450", // The Turnaround: Walking Into a Broken Property
  ch3: "https://picsum.photos/seed/ch3-moneypeople/800/450", // The Money People: Ownership & Investors
  ch4: "https://picsum.photos/seed/ch4-team/800/450", // Your Team Is Everything: Real culture, real retention
  ch5: "https://picsum.photos/seed/ch5-fandb/800/450", // F&B Is Not an Amenity: Revenue strategy
  ch6: "https://picsum.photos/seed/ch6-modernize/800/450", // Modernization: The Last Industry to Modernize
  ch7: "https://picsum.photos/seed/ch7-running/800/450", // Running on Empty: COVID, family, resilience
  ch8: "https://picsum.photos/seed/ch8-closing/800/450", // Closing Notes: What I Know Now
};
