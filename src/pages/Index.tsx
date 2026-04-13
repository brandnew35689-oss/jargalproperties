import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { useFeaturedProperties, useProperties } from "@/hooks/useProperties";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-property.jpg";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { data: featured = [] } = useFeaturedProperties();
  const { data: allProperties = [] } = useProperties();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState({ location: "", type: "", country: "" });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.country) params.set("country", search.country);
    if (search.location) params.set("location", search.location);
    if (search.type) params.set("type", search.type);
    navigate(`/properties?${params.toString()}`);
  };

  const countries = useMemo(() => [...new Set(allProperties.map((p) => p.country).filter(Boolean))], [allProperties]);

  const filteredFeatured = useMemo(() => {
    return featured.filter((p) => {
      if (search.country && p.country !== search.country) return false;
      if (search.type && p.type !== search.type) return false;
      return true;
    });
  }, [featured, search.country, search.type]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        <img
          src={heroImage}
          alt="Luxury property"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">
            {t("hero.subtitle")}
          </p>

          <form onSubmit={handleSearch} className="mt-8 bg-card/95 backdrop-blur rounded-lg p-4 flex flex-col sm:flex-row gap-3">
            <select
              value={search.country}
              onChange={(e) => setSearch({ ...search, country: e.target.value })}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">{t("filter.allCountries")}</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={search.type}
              onChange={(e) => setSearch({ ...search, type: e.target.value })}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">{t("hero.allTypes")}</option>
              {[...new Set(allProperties.map((p) => p.type))].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Search size={16} className="mr-2" /> {t("hero.search")}
            </Button>
          </form>
        </div>
      </section>

      {/* Featured */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">{t("featured.label")}</p>
              <h2 className="font-display text-3xl font-bold text-foreground mt-1">{t("featured.title")}</h2>
            </div>
            <Link to="/properties" className="hidden sm:flex items-center gap-1 text-accent font-medium text-sm hover:underline">
              {t("featured.viewAll")} <ArrowRight size={16} />
            </Link>
          </div>
          {filteredFeatured.length === 0 && featured.length > 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("properties.noMatch")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(filteredFeatured.length > 0 ? filteredFeatured : featured).map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/properties">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">{t("featured.viewAllProperties")}</Button>
            </Link>
          </div>
        </div>
      </section>




      {/* CTA */}
      <section className="section-padding bg-accent">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-bold text-accent-foreground">{t("cta.title")}</h2>
          <p className="mt-3 text-accent-foreground/80 max-w-md mx-auto">
            {t("cta.desc")}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/properties">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t("cta.viewProperties")}
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground text-foreground hover:bg-primary-foreground/10">
                {t("cta.contactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
