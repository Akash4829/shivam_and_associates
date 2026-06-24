/**
 * Image registry for the firm site.
 *
 * IMPORTANT: every image here is bundled locally (imported, not hot-linked).
 * This guarantees the correct asset ships with the production build — no
 * external CDN dependency that could change, break, or resolve to the wrong
 * picture.
 *
 * Two groups:
 *   1. Premium legal imagery (scales of justice, gavel, law library, court) —
 *      used for hero backgrounds, section banners and cards. No people.
 *   2. Advocate photography — used ONLY on the About page where the advocate
 *      is introduced.
 */

// Premium legal imagery (no identifiable people).
import heroJustice from './image/law-hero-justice.jpg';
import practiceGavel from './image/law-practice-gavel.jpg';
import lawLibraryImg from './image/law-library.jpg';
import scalesStatue from './image/law-scales-statue.jpg';
import courtBuilding from './image/law-court-building.jpg';

// Advocate photography (About page only).
import advocatePortrait from './image/advocate-portrait.jpeg';
import advocateExterior from './image/advocate-exterior.jpeg';
import advocateCourtCorridor from './image/advocate-court-corridor.jpeg';
import advocateOffice from './image/advocate-office.jpeg';
import highCourtLucknow from './image/high-court-lucknow.jpeg';

export const images = {
  // Advocate photography — About page only.
  advocatePortrait,
  advocateExterior,
  advocateCourtCorridor,
  advocateOffice,
  highCourtLucknow,

  // Site-wide semantic keys (face-free legal imagery).
  hero: heroJustice,
  lawLibrary: lawLibraryImg,
  officeTeam: practiceGavel,
  meeting: practiceGavel,
  cityLegal: courtBuilding,
  documents: practiceGavel,
  courtSteps: courtBuilding,
  cta: scalesStatue,
  building: courtBuilding,

  // Practice-area card images (varied justice motifs).
  card1: practiceGavel,
  card2: scalesStatue,
  card3: lawLibraryImg,
  card4: practiceGavel,
  card5: courtBuilding,
  card6: lawLibraryImg,

  // Page-hero banner backgrounds.
  testimonialsHero: scalesStatue,
  caseStudiesHero: lawLibraryImg,
  servicesHero: practiceGavel,
  focusAreasHero: heroJustice,
  contactHero: courtBuilding,
  internshipHero: lawLibraryImg,
  aboutHero: courtBuilding,
};

export const imageSrc = (key) => images[key] || images.hero;

export default images;
