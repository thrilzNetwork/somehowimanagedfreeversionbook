/**
 * Static assets for the digital book chapters.
 * 
 * To replace an image and avoid using Gemini API tokens:
 * 1. Place your image in the public/ folder (e.g., public/assets/foreword.jpg)
 * 2. Update the corresponding ID below with the path (e.g., ch0: "/assets/foreword.jpg")
 * 
 * If the value is an empty string "", the app will automatically generate 
 * a cinematic visual using the Gemini API.
 */
export const STATIC_CHAPTER_IMAGES: Record<string, string> = {
  ch0: "", // Foreword: The Houseman Who Fell in Love
  ch1: "", // Day Zero: Opening a Hotel From Scratch
  ch2: "", // The Turnaround: Walking Into a Broken Property
  ch3: "", // The Money People: Ownership & Investors
  ch4: "", // Your Team Is Everything: Real culture, real retention
  ch5: "", // F&B Is Not an Amenity: Revenue strategy
  ch6: "", // Modernization: The Last Industry to Modernize
  ch7: "", // Running on Empty: COVID, family, resilience
  ch8: "", // Closing Notes: What I Know Now
};
