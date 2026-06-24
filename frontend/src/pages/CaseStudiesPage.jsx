import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import PageHero from '../components/sections/PageHero';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';
import { images } from '../lib/images';
import { useThemeMode } from '../context/ThemeContext';
import { caseStudiesService } from '../services/api';
import { fadeUp, staggerContainer, easePremium } from '../animations/variants';
import { SITE } from '../constants/site';

const PAGE_SIZE = 10;

function CaseStudiesPage() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStudy, setExpandedStudy] = useState(null);
  const [fetchVersion, setFetchVersion] = useState(0);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(totalCount / PAGE_SIZE)), [totalCount]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await caseStudiesService.list({ page: currentPage, limit: PAGE_SIZE });
        if (cancelled) return;
        setCaseStudies(data.data || []);
        setTotalCount(data.totalCount ?? 0);
      } catch (err) {
        if (!cancelled) {
          setError(t('cases.errorTitle'));
          setCaseStudies([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [currentPage, fetchVersion, t]);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const showPagination = totalCount > PAGE_SIZE;
  const hasNextPage = currentPage < pageCount;
  const hasPrevPage = currentPage > 1;

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{t('meta.cases')}</title>
        <meta name="description" content={t('meta.casesDesc')} />
        <meta property="og:title" content={t('meta.cases')} />
        <meta property="og:description" content={t('meta.casesDesc')} />
      </Helmet>

      <PageHero
        kicker={t('cases.kicker')}
        title={t('cases.pageTitle')}
        titleHighlight={t('cases.pageHighlight')}
        subtitle={t('cases.pageSubtitle')}
        backgroundImage={images.caseStudiesHero}
        primaryTo="/contact"
        primaryLabel={t('cta.form')}
        secondaryTo="/services"
        secondaryLabel={t('nav.services')}
      />

      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium">
          <SectionHeader
            kicker={t('cases.kicker')}
            title={t('cases.pageTitle')}
            subtitle={t('cases.pageSubtitle')}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <CardSkeleton key={i} lines={5} />
              ))}
            </div>
          ) : error ? (
            <GlassCard className="max-w-md mx-auto p-8 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={() => {
                  setCurrentPage(1);
                  setFetchVersion((v) => v + 1);
                }}
              >
                {t('cases.retry')}
              </Button>
            </GlassCard>
          ) : caseStudies.length === 0 ? (
            <GlassCard className="text-center py-20">
              <p className={isLight ? 'text-muted' : 'text-slate-400'}>{t('cases.empty')}</p>
            </GlassCard>
          ) : (
            <>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <AnimatePresence initial={false}>
                  {caseStudies.map((cs) => (
                    <GlassCard key={cs.id} layout variants={fadeUp} className="overflow-hidden h-full !p-0">
                      {cs.image_url && (
                        <div className="h-44 w-full overflow-hidden">
                          <img
                            src={cs.image_url}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6 md:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full border border-accent/30 bg-accent/10 text-accent">
                            {cs.court_name}
                          </span>
                          <span className={`text-xs ${isLight ? 'text-muted' : 'text-slate-500'}`}>
                            {formatDate(cs.date_posted)}
                          </span>
                        </div>
                        <h2 className={`text-xl md:text-2xl font-heading tracking-tight ${
                          isLight ? 'text-ink' : 'text-off-white'
                        }`}>
                          {cs.title}
                        </h2>
                        <p className={`mt-3 text-sm leading-relaxed ${
                          isLight ? 'text-muted' : 'text-slate-400'
                        }`}>
                          {cs.summary}
                        </p>

                        <AnimatePresence initial={false}>
                          {expandedStudy === cs.id && cs.full_content && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: easePremium }}
                              className="overflow-hidden"
                            >
                              <div
                                className={`mt-4 p-4 rounded-xl border ${
                                  isLight
                                    ? 'border-navy/10 bg-navy/[0.02] text-ink'
                                    : 'border-white/10 bg-white/[0.02] text-off-white/90'
                                } prose prose-sm max-w-none leading-relaxed`}
                                dangerouslySetInnerHTML={{ __html: cs.full_content }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div
                          className={`mt-4 pt-3 border-t flex flex-wrap gap-3 text-xs ${
                            isLight
                              ? 'border-navy/10 text-muted'
                              : 'border-white/10 text-slate-500'
                          }`}
                        >
                          <span>
                            <strong className="text-accent">{t('cases.court')}:</strong>{' '}
                            {cs.court_name}
                          </span>
                          {cs.created_at && (
                            <span>
                              <strong className="text-accent">{t('cases.posted')}:</strong>{' '}
                              {formatDate(cs.created_at)}
                            </span>
                          )}
                        </div>

                        <Button
                          variant="secondary"
                          className="!w-full mt-5 !py-3"
                          onClick={() =>
                            setExpandedStudy(expandedStudy === cs.id ? null : cs.id)
                          }
                        >
                          {expandedStudy === cs.id ? t('cases.closeFull') : t('cases.readFull')}
                        </Button>
                      </div>
                    </GlassCard>
                  ))}
                </AnimatePresence>
              </motion.div>

              {showPagination && (
                <nav
                  className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                  aria-label="Pagination"
                >
                  <Button
                    variant="secondary"
                    disabled={!hasPrevPage || isLoading}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    {t('cases.previous')}
                  </Button>
                  <p className={`text-sm font-medium ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                    {t('cases.pageOf', { current: currentPage, total: pageCount })}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCurrentPage(n)}
                        disabled={isLoading}
                        aria-current={n === currentPage ? 'page' : undefined}
                        className={`min-w-[44px] min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${
                          n === currentPage
                            ? 'bg-accent text-primary'
                            : isLight
                              ? 'border border-navy/10 text-ink hover:bg-navy/5'
                              : 'border border-white/15 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    disabled={!hasNextPage || isLoading}
                    onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                  >
                    {t('cases.next')}
                  </Button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

    </>
  );
}

export default CaseStudiesPage;
