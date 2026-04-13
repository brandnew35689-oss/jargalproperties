import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useProperty } from "@/hooks/useProperties";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const PropertyDetail = () => {
  const { id } = useParams();
  const { data: property, isLoading } = useProperty(id || "");
  const { lang, t } = useLanguage();

  // Build images array from both `images` and legacy `image` field
  const allImages = property
    ? [
        ...(property.images && property.images.length > 0 ? property.images : []),
        ...(property.image && !(property.images || []).includes(property.image) ? [property.image] : []),
      ].filter(Boolean)
    : [];
  const images = allImages.length > 0 ? allImages : property ? [property.image] : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Reset index when property changes
  useEffect(() => { setActiveIndex(0); }, [id]);

  const goTo = useCallback((idx: number) => {
    if (idx === activeIndex || idx < 0 || idx >= images.length) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [activeIndex, images.length]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < images.length - 1) goTo(activeIndex + 1);
      else if (diff < 0 && activeIndex > 0) goTo(activeIndex - 1);
    }
    touchStartX.current = null;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="section-padding flex justify-center items-center min-h-[50vh]">
          <Loader2 className="animate-spin text-accent" size={32} />
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">{t("detail.notFound")}</h1>
          <Link to="/properties" className="text-accent mt-4 inline-block hover:underline">
            ← {t("detail.back")}
          </Link>
        </div>
      </Layout>
    );
  }

  const title = lang === "mn" && property.title_mn ? property.title_mn : property.title;
  const description = lang === "mn" && property.description_mn ? property.description_mn : property.description;

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <Link to="/properties" className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent text-sm mb-6">
            <ArrowLeft size={16} /> {t("detail.back")}
          </Link>

          {/* Main Image */}
          <div
            className="relative rounded-lg overflow-hidden mb-3"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[activeIndex]}
              alt={title}
              width={800}
              height={600}
              className={`w-full h-[300px] sm:h-[450px] lg:h-[500px] object-contain bg-muted transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
            />
            {images.length > 1 && (
              <>
                {activeIndex > 0 && (
                  <button onClick={() => goTo(activeIndex - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 text-foreground rounded-full p-1.5 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                )}
                {activeIndex < images.length - 1 && (
                  <button onClick={() => goTo(activeIndex + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 text-foreground rounded-full p-1.5 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/70 text-foreground text-xs px-2.5 py-1 rounded-full">
                  {activeIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <ScrollArea className="w-full mb-8">
              <div className="flex gap-2 pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`shrink-0 rounded-md overflow-hidden border-2 transition-all ${i === activeIndex ? "border-accent opacity-100" : "border-transparent opacity-60 hover:opacity-90"}`}
                  >
                    <img src={img} alt={`${title} ${i + 1}`} className="w-20 h-14 sm:w-24 sm:h-16 object-cover" />
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}

          {images.length <= 1 && <div className="mb-8" />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">{property.type}</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">{title}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mt-2">
                <MapPin size={16} /> {property.location}
              </div>

              <div className="flex items-center gap-6 mt-6 py-4 border-y border-border text-muted-foreground">
                <span className="flex items-center gap-2"><BedDouble size={18} /> {property.bedrooms} {t("detail.beds")}</span>
                <span className="flex items-center gap-2"><Bath size={18} /> {property.bathrooms} {t("detail.baths")}</span>
                <span className="flex items-center gap-2"><Maximize size={18} /> {property.area} sqft</span>
              </div>

              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">{t("detail.description")}</h2>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>

              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">{t("detail.features")}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-accent" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>

              <div>
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <p className="text-accent font-bold text-3xl">${property.price.toLocaleString()}</p>
                  <p className="text-muted-foreground text-sm mt-1">{t("detail.askingPrice")}</p>
                  {((property as any).status === "sold" || (property as any).status === "rented") ? (
                    <div className="mt-6 text-center">
                      <span className={`inline-block text-sm font-semibold px-4 py-2 rounded-full ${(property as any).status === "sold" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`}>
                        {t("status.notAvailable")}
                      </span>
                    </div>
                  ) : (
                    <Link to="/contact" className="block mt-6">
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                        {t("detail.contact")}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PropertyDetail;
