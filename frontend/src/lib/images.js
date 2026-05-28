/**
 * Curated Unsplash sources — law / business, consistent tone. Pass ?auto=format&fit=crop for CDN optimization.
 * Replace with local /public assets in production if preferred.
 */

/** Bundled — avoids CDN / referrer issues for the Focus areas “courts & city” split */
import focusCourtsCity from './images/WhatsApp Image 2026-04-25 at 1.51.21 PM.jpeg';

const q = 'auto=format&fit=crop&w=2000&q=80';



export const images = {
  hero: `https://images.unsplash.com/photo-1497366754035-f200968a6e72?${q}`,
  lawLibrary: `https://images.unsplash.com/photo-1505664194779-8beaceb93744?${q}`,
  officeTeam: `https://images.unsplash.com/photo-1522071820081-009f0129c71c?${q}`,
  meeting: `https://images.unsplash.com/photo-1600880292203-757bb62b4baf?${q}`,
  cityLegal: `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?${q}`,
  documents: `https://images.unsplash.com/photo-1450101499163-c8848c66ca85?${q}`,
  handshake: `https://images.unsplash.com/photo-1521791136064-7986c2920216?${q}`,
  courtSteps: `https://images.unsplash.com/photo-1589829085411-e56a44ce1e2f?${q}`,
  building: focusCourtsCity,
  cta: `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?${q}`,
  card1: `https://images.unsplash.com/photo-1507679799987-c73779587ccf?${q}`,
  card2: `https://images.unsplash.com/photo-1521737604893-d14cc237f11d?${q}`,
  card3: `https://images.unsplash.com/photo-1551836022-d5d88e9218df?${q}`,
  card4: `https://images.unsplash.com/photo-1560179707-f14e90ef3623?${q}`,
};

export const imageSrc = (key) => images[key] || images.hero;
