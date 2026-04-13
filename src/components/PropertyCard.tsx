import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import type { Property } from "@/hooks/useProperties";
import { useLanguage } from "@/contexts/LanguageContext";

const statusBadge: Record<string, string> = {
  available: "bg-accent/80 text-accent-foreground",
  sold: "bg-red-500 text-white",
  rented: "bg-orange-500 text-white",
};

const PropertyCard = ({ property }: { property: Property }) => {
  const { lang, t } = useLanguage();
  const title = lang === "mn" && property.title_mn ? property.title_mn : property.title;
  const status = property.status || "available";

  return (
    <Link
      to={`/properties/${property.id}`}
      className="group block bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image}
          alt={title}
          loading="lazy"
          width={800}
          height={600}
          className="w-full h-full object-contain bg-muted group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
          {property.type}
        </span>
        <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusBadge[status]}`}>
          {t(`admin.status.${status}`)}
        </span>
      </div>
      <div className="p-5">
        <p className="text-accent font-bold text-lg">${property.price.toLocaleString()}</p>
        <h3 className="font-display text-lg font-semibold text-card-foreground mt-1 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
          <MapPin size={14} />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-muted-foreground text-sm">
          <span className="flex items-center gap-1"><BedDouble size={14} /> {property.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath size={14} /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Maximize size={14} /> {property.area} sqft</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
