import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug.toLowerCase() } },
    limit: 1,
    depth: 1,
  })
  const article = docs[0]
  if (!article) return { title: 'Article non trouvé' }

  return {
    title: (article as any).seo?.metaTitle || article.title,
    description: (article as any).seo?.metaDescription || (article as any).excerpt,
  }
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug.toLowerCase() } },
    limit: 1,
    depth: 2,
  })

  const article = docs[0] as any
  if (!article) return notFound()

  return (
    <>
      <main className="relative min-h-screen bg-brand-dark overflow-hidden">
        <article className="relative pt-32 pb-24 px-6">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[150px] pointer-events-none" />
          <div className="max-w-3xl mx-auto relative z-10">
            {/* Category */}
            {article.category && (
              <span className="uppercase tracking-[0.2em] text-brand-blue text-xs font-sans font-medium mb-4 block">
                {article.category}
              </span>
            )}

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-6xl text-white mb-6 leading-[1.1]">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-sm text-brand-silver mb-12">
              {article.readTimeMinutes && (
                <span>📖 {article.readTimeMinutes} min de lecture</span>
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

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:font-serif [&_h3]:text-2xl [&_p]:text-brand-silver [&_p]:leading-relaxed [&_a]:text-brand-blue [&_a]:no-underline hover:[&_a]:underline [&_strong]:text-white [&_blockquote]:border-brand-blue/30 [&_blockquote]:text-brand-silver [&_blockquote]:italic">
              {article.content && (
                <RichText data={article.content} />
              )}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
