import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Accordion from '../ui/Accordion';
import SectionHeader from '../ui/SectionHeader';
import { useThemeMode } from '../../context/ThemeContext';

export function FAQBlock({
  kicker,
  title,
  subtitle,
  items,
  injectSchema = true,
  className = '',
  align = 'center',
}) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  const schema = injectSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((it) => ({
          '@type': 'Question',
          name: it.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: it.answer,
          },
        })),
      }
    : null;

  return (
    <section
      className={`section-padding ${isLight ? 'bg-white' : 'bg-secondary/30'} ${className}`}
      aria-labelledby="faq-block-title"
    >
      {schema && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
      )}
      <motion.div className="container-premium max-w-3xl">
        <SectionHeader kicker={kicker} title={title} subtitle={subtitle} align={align} />
        <Accordion items={items} />
      </motion.div>
    </section>
  );
}

export default FAQBlock;
