import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Blog — Guides & Récits de Voyage',
  description: 'Guides de destination, conseils voyage, et récits d\'aventure par Ça Crée Voyage.',
}

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: articles } = await payload.find({
    collection: 'articles',
    limit: 20,
    depth: 1,
    sort: '-publishedAt',
  })

  return (
    <>
      <main className="relative min-h-screen bg-slate-50 dark:bg-brand-dark transition-colors duration-700 overflow-hidden">
        <section className="relative pt-32 pb-24 px-6">
          <div className="absolute top-20 left-1/3 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="uppercase tracking-[0.2em] text-brand-blue text-xs font-sans font-medium mb-4 block">
                Blog
              </span>
              <h1 className="font-serif text-4xl md:text-6xl text-slate-900 dark:text-white mb-4">
                Guides & Récits de Voyage
              </h1>
              <p className="text-slate-600 dark:text-brand-silver text-lg max-w-xl mx-auto">
                Inspirations, conseils pratiques et histoires de nos voyageurs.
              </p>
            </div>

            {articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-600 dark:text-brand-silver text-lg italic">
                  Les articles arrivent bientôt. Restez connectés ! ✈️
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: any) => {
                  const coverUrl = typeof article.coverImage === 'object' && article.coverImage?.url
                    ? article.coverImage.url
                    : null

                  return (
                    <Link
                      key={article.id}
                      href={`/blog/${article.slug}`}
                      className="group block rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 transition-all duration-300 hover:border-brand-blue/30 bg-white dark:bg-white/5 shadow-sm dark:shadow-none"
                      style={{
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      {/* Cover Image */}
                      <div className="relative aspect-[3/2] overflow-hidden">
                        {coverUrl ? (
                          <Image
                            src={coverUrl}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 dark:from-brand-dark via-slate-200 dark:via-[#1a2744] to-slate-100 dark:to-brand-dark" />
                        )}
                        {/* Category badge */}
                        {article.category && (
                          <span className="absolute top-4 left-4 px-3 py-1 text-[11px] uppercase tracking-wider text-brand-blue bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md rounded-full border border-slate-200 dark:border-white/10">
                            {article.category}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h2 className="font-serif text-xl md:text-2xl text-slate-900 dark:text-white mb-2 group-hover:text-brand-blue transition-colors leading-tight">
                          {article.title}
                        </h2>
                        {article.excerpt && (
                          <p className="text-slate-600 dark:text-brand-silver text-sm leading-relaxed line-clamp-3 mb-4">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-brand-silver">
                          {article.readTimeMinutes && (
                            <span>📖 {article.readTimeMinutes} min</span>
                          )}
                          {article.publishedAt && (
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
