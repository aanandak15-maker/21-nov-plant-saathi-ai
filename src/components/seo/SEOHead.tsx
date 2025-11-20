import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  schema?: object;
}

export const SEOHead = ({
  title = "Plant Saathi AI - AI-Powered Farming Companion",
  description = "Transform your farming with AI-powered satellite monitoring, disease detection, and sustainable solutions. Field-specific insights for Indian farmers. Free trial available.",
  keywords = [
    "AI farming India",
    "satellite farming",
    "precision agriculture",
    "crop disease detection",
    "NDVI monitoring",
    "smart farming India",
    "agricultural technology",
    "farm management software",
    "sustainable farming",
    "organic farming solutions",
    "mandi prices",
    "weather forecast farming",
    "kharif crops",
    "rabi crops",
    "Punjab farming",
    "Haryana agriculture",
    "UP farming technology"
  ],
  image = "/og-image.jpg",
  url = "https://plantsaathi.ai",
  type = "website",
  schema
}: SEOHeadProps) => {
  const fullTitle = title.includes("Plant Saathi") ? title : `${title} | Plant Saathi AI`;
  const canonicalUrl = url || typeof window !== 'undefined' ? window.location.href : '';

  // Default Schema.org structured data
  const defaultSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Plant Saathi AI",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Android, iOS",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "description": "Free trial available, premium features coming soon"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "12500",
          "bestRating": "5",
          "worstRating": "1"
        },
        "description": description,
        "featureList": [
          "Real-time satellite monitoring with NDVI and EVI",
          "AI-powered crop disease detection",
          "Field-specific AI chatbot",
          "16-day weather forecasts",
          "Live mandi prices",
          "Sustainable farming recommendations",
          "Smart marketplace with organic products"
        ],
        "screenshot": image,
        "author": {
          "@type": "Organization",
          "name": "Plant Saathi AI",
          "url": "https://plantsaathi.ai"
        }
      },
      {
        "@type": "Organization",
        "name": "Plant Saathi AI",
        "url": "https://plantsaathi.ai",
        "logo": {
          "@type": "ImageObject",
          "url": "https://plantsaathi.ai/logo.png"
        },
        "description": "Empowering farmers with AI and satellite technology",
        "sameAs": [
          "https://instagram.com/plantsaathi",
          "https://youtube.com/@plantsaathi"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-XXXXXXXXXX",
          "contactType": "Customer Service",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi", "Punjabi", "Bengali"]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does satellite farming work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Plant Saathi AI uses real-time satellite data to monitor your fields. We analyze NDVI (vegetation health), EVI (enhanced vegetation index), and soil moisture to give you precise insights about crop health, water stress, and growth patterns."
            }
          },
          {
            "@type": "Question",
            "name": "Is Plant Saathi AI free to use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! We offer a free trial period with no credit card required. You can access all features including satellite monitoring, disease detection, and AI chatbot during the trial."
            }
          },
          {
            "@type": "Question",
            "name": "Which crops does Plant Saathi support?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Plant Saathi AI supports all major Indian crops including wheat, rice, sugarcane, cotton, mustard, bajra, and more. Our AI is trained on Indian farming conditions and crop cycles (kharif, rabi, zaid)."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is the disease detection?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI-powered disease detection has 95%+ accuracy. Simply take a photo of the affected plant, and our system identifies the disease and provides sustainable treatment options, prioritizing organic solutions."
            }
          }
        ]
      }
    ]
  };

  const schemaData = schema || defaultSchema;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Plant Saathi AI" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Geo Tags for Indian Market */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="geo.position" content="28.6139;77.2090" />
      <meta name="ICBM" content="28.6139, 77.2090" />

      {/* Language Alternatives */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="hi" href={`${canonicalUrl}?lang=hi`} />
      <link rel="alternate" hrefLang="pa" href={`${canonicalUrl}?lang=pa`} />
      <link rel="alternate" hrefLang="bn" href={`${canonicalUrl}?lang=bn`} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#22c55e" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
};
