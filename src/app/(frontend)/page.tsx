import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import DestinationSwiper from '@/components/DestinationSwiper'
import ReelsShowcase from '@/components/ReelsShowcase'
import Footer from '@/components/Footer'
import HeroGallery from '@/components/HeroGallery'
import CursorTrail from '@/components/CursorTrail'
import TestimonialsSection from '@/components/TestimonialsSection'
import DestinationTestimonials from '@/components/DestinationTestimonials'
import FeaturedToursGrid from '@/components/FeaturedToursGrid'
import FAQAccordion from '@/components/FAQAccordion'
import ReviewBadges from '@/components/ReviewBadges'
import MagneticButton from '@/components/MagneticButton'
import ScrollTextReveal from '@/components/ScrollTextReveal'
import HeroVideoSwitcher from '@/components/HeroVideoSwitcher'
import { PartnersSection } from '@/components/sections/partners-section'
import { getDictionary, Locale } from '@/i18n/dictionaries'

export default async function HomePage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const locale = (searchParams.locale as string) || 'fr';
  const t = getDictionary(locale).home;
  const payload = await getPayload({ config: configPromise })

  // Fetch international destinations
  const { docs: internationalDestinations } = await payload.find({
    collection: 'destinations',
    where: { scope: { equals: 'international' } },
    depth: 1,
    limit: 20,
    locale: locale as any,
  })

  // Fetch national (Maroc) destinations
  const { docs: nationalDestinations } = await payload.find({
    collection: 'destinations',
    where: { scope: { equals: 'national' } },
    depth: 1,
    limit: 20,
    locale: locale as any,
  })

  // Fetch featured tours
  const { docs: featuredTours } = await payload.find({
    collection: 'tours',
    where: { isFeatured: { equals: true } },
    depth: 1,
    limit: 6,
    sort: 'featuredOrder',
    locale: locale as any,
  })

  // Fallback: if no featured tours, get latest tours
  const toursToShow = featuredTours.length > 0 ? featuredTours : (await payload.find({
    collection: 'tours',
    depth: 1,
    limit: 6,
    sort: '-createdAt',
    locale: locale as any,
  })).docs

  // Fetch highlighted testimonials
  const { docs: testimonials } = await payload.find({
    collection: 'testimonials',
    depth: 1,
    limit: 10,
    locale: locale as any,
  })

  // Fetch trust stats from SiteSettings
  let trustStats: { number: string; label: string }[] = []
  let reviewBadges = undefined
  try {
    const settings = await payload.findGlobal({ slug: 'site-settings', locale: locale as any }) as any
    if (settings?.trustStats && settings.trustStats.length > 0) {
      trustStats = settings.trustStats
    }
    if (settings?.reviewBadges) {
      reviewBadges = settings.reviewBadges
    }
  } catch {
    // Fallback to defaults in component
  }

  // Fetch HeroGallery panels
  let heroPanels: any[] = []
  try {
    const heroGallery = await payload.findGlobal({
      slug: 'hero-gallery',
      depth: 1,
      locale: locale as any,
    }) as any
    if (heroGallery?.panels && heroGallery.panels.length > 0) {
      heroPanels = heroGallery.panels
    }
  } catch {
    // Fallback to defaults
  }

  // Fetch HeroSwitcher slides
  let heroSwitcherSlides: any[] | undefined = undefined;
  try {
    const heroSwitcherGlobal = await payload.findGlobal({
      slug: 'hero-switcher',
      depth: 1,
      locale: locale as any,
    }) as any;
    
    if (heroSwitcherGlobal?.slides && heroSwitcherGlobal.slides.length > 0) {
      heroSwitcherSlides = heroSwitcherGlobal.slides.map((slide: any) => ({
        id: slide.id || slide._id,
        label: slide.label,
        subtitle: slide.subtitle,
        title: slide.title,
        videoUrl: slide.backgroundVideo?.url || '',
      }));
    }
  } catch (err) {
    console.error('Error fetching hero-switcher global', err);
  }

  // Fetch Partners Config
  let partnersData: { title?: string; description?: string; columnCount?: string; partnersList?: any[] } = {}
  try {
    const partnersGlobal = await payload.findGlobal({
      slug: 'partners-config',
      depth: 1,
      locale: locale as any,
    }) as any
    if (partnersGlobal) {
      partnersData = partnersGlobal
    }
  } catch {
    // Fallback to defaults in component
  }

  return (
    <main className="relative w-full min-h-screen flex flex-col overflow-x-clip">
      {/* ──────────────────────────────────────────────────────────
          HERO SECTION — Cinematic canvas scroll portal
      ─────────────────────────────────────────────────────────── */}
      <HeroGallery />

      {/* ──────────────────────────────────────────────────────────
          DESTINATIONS TRAIL WRAPPER
      ─────────────────────────────────────────────────────────── */}
      <CursorTrail
        images={
          Array.from(
            new Set(
              [...(internationalDestinations as any[] || []), ...(nationalDestinations as any[] || [])]
                .map(d => typeof d.image === 'object' ? d.image?.url : d.image)
                .filter(Boolean)
            )
          ) as string[]
        }
      >
        {/* ──────────────────────────────────────────────────────────
            ROW 1 — ÉVASIONS INTERNATIONALES
        ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-slate-50 dark:bg-[#0B132B] w-full transition-colors duration-700">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />
        <DestinationSwiper
          destinations={internationalDestinations as any[]}
          title="Évasions Internationales"
          subtitle="Découvrez le monde"
        />
      </div>

      {/* ──────────────────────────────────────────────────────────
          ROW 2 — TRÉSORS DU MAROC
      ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-slate-50 dark:bg-[#0B132B] w-full transition-colors duration-700">
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
        <DestinationSwiper
          destinations={nationalDestinations as any[]}
          title="Trésors du Maroc"
          subtitle="L'âme du royaume"
        />
      </div>
      </CursorTrail>

      {/* ──────────────────────────────────────────────────────────
          FEATURED TOURS GRID
      ─────────────────────────────────────────────────────────── */}
      {toursToShow.length > 0 && (
        <FeaturedToursGrid tours={toursToShow as any[]} />
      )}


      {/* ──────────────────────────────────────────────────────────
          MID-PAGE IMMERSIVE BREAK
      ─────────────────────────────────────────────────────────── */}
      <HeroVideoSwitcher slides={heroSwitcherSlides} />

      {/* ──────────────────────────────────────────────────────────
          SUR MESURE PHILOSOPHY BLOCK
      ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-16 lg:py-24 bg-slate-50 dark:bg-brand-dark transition-colors duration-700 overflow-clip">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[180px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left — Text */}
          <div>
            <span className="uppercase text-brand-gold text-xs font-body mb-4 block font-semibold tracking-wider">
              {t.philosophySubtitle}
            </span>
            <h2 className="font-heading text-4xl md:text-6xl text-slate-900 dark:text-white mb-8 leading-[1.1] font-medium tracking-wide">
              {t.philosophyTitle}
            </h2>
            <ScrollTextReveal 
              text={t.philosophyText} 
              className="text-slate-700 dark:text-brand-silver text-lg leading-relaxed mb-8" 
            />
            <div className="space-y-4">
              {[
                t.philosophyBullet1,
                t.philosophyBullet2,
                t.philosophyBullet3,
                t.philosophyBullet4,
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-800 dark:text-white/80 font-medium dark:font-normal text-sm font-body">
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <MagneticButton>
              <Link
                href="/sur-mesure"
                className="inline-block mt-10 bg-brand-gold/10 dark:bg-brand-gold/20 border border-brand-gold/30 hover:bg-brand-gold/20 dark:hover:bg-brand-gold/30 text-yellow-700 dark:text-brand-gold px-8 py-4 rounded-full font-body text-sm uppercase dark:font-medium transition-all duration-300 font-semibold tracking-wider"
              >
                {t.philosophyCTA}
              </Link>
            </MagneticButton>
          </div>

          {/* Right — Review Badges */}
          <div className="flex justify-center lg:justify-end mt-12 lg:mt-0 relative z-20">
            <ReviewBadges 
              google={reviewBadges?.googleReviews} 
              trustpilot={reviewBadges?.trustpilot} 
            />
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          FAQ SECTION
      ─────────────────────────────────────────────────────────── */}
      <FAQAccordion />

      {/* ──────────────────────────────────────────────────────────
          FINAL CTA SECTION
      ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full py-16 lg:py-24 bg-slate-100 dark:bg-brand-deeper transition-colors duration-700 flex justify-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative z-20 flex flex-col items-center text-center p-12 rounded-[2.5rem] bg-white dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none ring-1 ring-black/5 dark:ring-white/10 max-w-4xl w-full">
          <h2 className="text-5xl md:text-7xl font-heading text-slate-900 dark:text-white mb-6 drop-shadow-md dark:drop-shadow-none font-medium tracking-wide">
            {t.readyTitle}
          </h2>
          <p className="text-slate-600 dark:text-white/80 text-xl font-light mb-10 max-w-xl mx-auto leading-relaxed">
            {t.readyText}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <MagneticButton>
              <Link
                href="/sur-mesure"
                className="inline-block bg-brand-blue hover:bg-brand-blue/90 text-white px-10 py-5 rounded-full font-medium text-lg transition-all shadow-[0_0_30px_rgba(56,163,165,0.3)] hover:shadow-[0_0_40px_rgba(56,163,165,0.5)]"
              >
                {t.readyCTA}
              </Link>
            </MagneticButton>
            <MagneticButton>
              <a
                href="https://wa.me/212661373347?text=Bonjour, je souhaite en savoir plus sur vos voyages"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#25D366]/20 border border-[#25D366]/30 hover:bg-[#25D366]/30 text-[#25D366] px-10 py-5 rounded-full font-medium text-lg transition-all"
              >
                💬 WhatsApp
              </a>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          CLIENT REVIEWS / VIDEO TESTIMONIALS
      ─────────────────────────────────────────────────────────── */}
      {testimonials && testimonials.length > 0 && (
        <DestinationTestimonials testimonials={testimonials as any[]} />
      )}

      {/* ──────────────────────────────────────────────────────────
          PARTNER LOGOS CAROUSEL — Social proof between testimonials
      ─────────────────────────────────────────────────────────── */}
      <PartnersSection
        title={partnersData.title}
        description={partnersData.description}
        columnCount={Number(partnersData.columnCount) || 3}
        partners={partnersData.partnersList?.map((p: any) => ({
          name: p.name,
          logo: typeof p.logo === 'object' ? p.logo : { url: '' },
        }))}
      />

      {/* ──────────────────────────────────────────────────────────
          CLIENT REVIEWS / REVIEW GRID
      ─────────────────────────────────────────────────────────── */}
      <TestimonialsSection testimonials={testimonials as any[]} />

      {/* ── FOOTER ── */}
      <Footer />
    </main>
  )
}
