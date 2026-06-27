/**
 * Image registry — every asset is bundled locally.
 *
 * Stock legal imagery: hero backgrounds, practice cards, page banners.
 * Advocate photography: About page, contact, and trust sections.
 */

import heroJustice from './image/law-hero-justice.jpg';
import practiceGavel from './image/law-practice-gavel.jpg';
import lawLibraryImg from './image/law-library.jpg';
import scalesStatue from './image/law-scales-statue.jpg';
import courtBuilding from './image/law-court-building.jpg';

import advocatePortrait from './image/advocate-portrait.jpeg';
import advocateExterior from './image/advocate-exterior.jpeg';
import advocateCourtCorridor from './image/advocate-court-corridor.jpeg';
import advocateOffice from './image/advocate-office.jpeg';
import highCourtLucknow from './image/high-court-lucknow.jpeg';

export const images = {
  // Raw assets
  heroJustice,
  practiceGavel,
  lawLibrary: lawLibraryImg,
  scalesStatue,
  courtBuilding,
  advocatePortrait,
  advocateExterior,
  advocateCourtCorridor,
  advocateOffice,
  highCourtLucknow,

  // Home
  hero: heroJustice,

  // Page heroes — one distinct image per page
  aboutHero: highCourtLucknow,
  focusAreasHero: courtBuilding,
  contactHero: advocateExterior,
  servicesHero: lawLibraryImg,
  caseStudiesHero: scalesStatue,
  testimonialsHero: advocateCourtCorridor,
  internshipHero: advocateOffice,

  // Practice-area cards (home + focus areas)
  practiceHighCourt: highCourtLucknow,
  practiceCivil: practiceGavel,
  practiceFamily: scalesStatue,
  practiceProperty: courtBuilding,

  // Misc / schema
  building: courtBuilding,
  cta: scalesStatue,
};

export const imageSrc = (key) => images[key] || images.hero;

export default images;
