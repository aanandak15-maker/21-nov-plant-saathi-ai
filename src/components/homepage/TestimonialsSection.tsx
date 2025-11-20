import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "राजेश कुमार",
    nameEn: "Rajesh Kumar",
    location: "Meerut, Uttar Pradesh",
    crop: "Wheat & Sugarcane",
    image: "👨‍🌾",
    quote: "Plant Saathi ने मेरी खेती बदल दी। Satellite data से मुझे पता चला कि मेरे खेत के किस हिस्से में पानी की कमी है। AI chatbot ने sustainable solution दिया और मेरी पैदावार 30% बढ़ गई!",
    quoteEn: "Plant Saathi transformed my farming. Satellite data showed me exactly which parts of my field needed water. The AI chatbot gave sustainable solutions and my yield increased by 30%!",
    rating: 5,
    highlight: "30% yield increase"
  },
  {
    id: 2,
    name: "गुरप्रीत सिंह",
    nameEn: "Gurpreet Singh",
    location: "Ludhiana, Punjab",
    crop: "Rice & Wheat",
    image: "👨‍🌾",
    quote: "Disease detection feature ने मेरी फसल बचाई। Early warning मिली और organic treatment से समस्या solve हो गई। Chemical spray की जरूरत ही नहीं पड़ी। Paisa aur environment dono bachaye!",
    quoteEn: "Disease detection saved my crop. Got early warning and organic treatment solved the problem. Didn't need chemical spray at all. Saved money and environment both!",
    rating: 5,
    highlight: "Saved entire crop"
  },
  {
    id: 3,
    name: "विक्रम यादव",
    nameEn: "Vikram Yadav",
    location: "Rohtak, Haryana",
    crop: "Mustard & Bajra",
    image: "👨‍🌾",
    quote: "Mandi prices aur weather forecast ek saath milte hain. AI advisor bilkul mere field ke liye specific advice deta hai. Pehle 5 jagah jaana padta tha information ke liye, ab sab kuch phone mein!",
    quoteEn: "Mandi prices and weather forecast together. AI advisor gives advice specific to my field. Earlier had to go 5 places for information, now everything on phone!",
    rating: 5,
    highlight: "All-in-one solution"
  }
];

export const TestimonialsSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-green-50/30 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <header className="text-center mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {t('homepage.testimonials.title', 'Real Farmers, Real Results')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('homepage.testimonials.subtitle', 'Hear from farmers across North India who are growing smarter with Plant Saathi AI')}
          </p>
        </header>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6 bg-green-600 rounded-full p-3 shadow-lg">
                <Quote className="w-5 h-5 text-white" />
              </div>

              <div className="space-y-4 mt-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>

                {/* Highlight Badge */}
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ✓ {testimonial.highlight}
                </div>

                {/* Farmer Info */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                    <div className="text-xs text-green-600 font-medium">{testimonial.crop}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white">
          <p className="text-2xl font-bold mb-2">
            {t('homepage.testimonials.cta', 'Join 12,500+ Successful Farmers')}
          </p>
          <p className="text-green-100 mb-6">
            {t('homepage.testimonials.ctaSubtitle', 'Start your free trial today and see results in your first week')}
          </p>
        </div>
      </div>
    </section>
  );
};
