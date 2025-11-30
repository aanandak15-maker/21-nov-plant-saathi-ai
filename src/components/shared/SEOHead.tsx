import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    author?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
    title,
    description,
    image = '/og-image.png', // Default OG image
    url = window.location.href,
    type = 'website',
    publishedTime,
    author
}) => {
    const siteTitle = 'Plant Saathi AI';
    const fullTitle = `${title} | ${siteTitle}`;

    // Schema.org structured data
    const schema = type === 'article' ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "image": [image],
        "datePublished": publishedTime,
        "author": [{
            "@type": "Person",
            "name": author || "Plant Saathi Team"
        }],
        "publisher": {
            "@type": "Organization",
            "name": "Plant Saathi AI",
            "logo": {
                "@type": "ImageObject",
                "url": "https://plantsaathiai.com/logo.jpg"
            }
        },
        "description": description
    } : null;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Article Specific */}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {author && <meta name="author" content={author} />}

            {/* Structured Data */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};
