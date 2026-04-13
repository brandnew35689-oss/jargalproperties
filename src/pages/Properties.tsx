import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const { data: properties = [], isLoading, isError } = useProperties();
  const { t } = useLanguage();

  const countries = useMemo(() => [...new Set(properties.map((p) => p.country).filter(Boolean))], [properties]);

  const locations = useMemo(() => {
    const filtered = country ? properties.filter((p) => p.country === country) : properties;
    return [...new Set(filtered.map((p) => p.location).filter(Boolean))];
  }, [properties, country]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (country && p.country !== country) return false;
      if (type && p.type !== type) return false;
      if (location && p.location !== location) return false;
      return true;
    });
  }, [properties, country, type, location]);

  const selectClass = "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground";

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">{t("properties.browse")}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">{t("properties.title")}</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-secondary rounded-lg">
            <select value={country} onChange={(e) => { setCountry(e.target.value); setLocation(""); }} className={selectClass + " flex-1"}>
              <option value="">{t("filter.allCountries")}</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass + " flex-1"}>
              <option value="">{t("hero.allLocations")}</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass + " flex-1"}>
              <option value="">{t("hero.allTypes")}</option>
              {[...new Set(properties.map((p) => p.type))].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div>
          ) : isError ? (
            <p className="text-center text-muted-foreground py-16">Failed to load properties. Please refresh the page.</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">{t("properties.noMatch")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Properties;
