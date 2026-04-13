import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Property } from "@/hooks/useProperties";
import { Loader2, X, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PROPERTY_TYPES = ["House", "Apartment", "Villa", "Townhouse", "Condo", "Cottage"] as const;
const COUNTRIES = ["Mongolia", "UAE", "USA", "South Korea", "Japan", "China"] as const;

interface PropertyFormProps {
  property?: Property | null;
  onClose: () => void;
}

const PROPERTY_STATUSES = ["available", "sold", "rented"] as const;

const emptyForm = {
  title: "",
  title_mn: "",
  price: "",
  location: "",
  country: "Mongolia" as string,
  type: "House" as string,
  bedrooms: "",
  bathrooms: "",
  area: "",
  description: "",
  description_mn: "",
  features: "",
  featured: false,
  status: "available" as string,
};

const PropertyForm = ({ property, onClose }: PropertyFormProps) => {
  const isEditing = !!property;
  const { t } = useLanguage();
  const [form, setForm] = useState(() =>
    property
      ? {
          title: property.title,
          title_mn: property.title_mn || "",
          price: String(property.price),
          location: property.location,
          country: (property as any).country || "Mongolia",
          type: property.type,
          bedrooms: String(property.bedrooms),
          bathrooms: String(property.bathrooms),
          area: String(property.area),
          description: property.description,
          description_mn: property.description_mn || "",
          features: property.features.join(", "),
          featured: property.featured,
          status: property.status || "available",
        }
      : emptyForm
  );
  // Multiple images support
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(() => {
    if (property) {
      const existing = property.images && property.images.length > 0 ? [...property.images] : [];
      if (property.image && !existing.includes(property.image)) existing.unshift(property.image);
      return existing.filter(Boolean);
    }
    return [];
  });
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast({ title: "Please select image files", variant: "destructive" });
      return;
    }
    setImageFiles(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...validFiles.map(f => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    // Check if this is an existing URL or a new file
    const existingUrlCount = imagePreviews.length - imageFiles.length;
    if (index < existingUrlCount) {
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      const fileIndex = index - existingUrlCount;
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file, { contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from("property-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.location || !form.description) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    if (!isEditing && imagePreviews.length === 0) {
      toast({ title: "Please upload at least one property image", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      // Upload new files
      const newUrls: string[] = [];
      for (const file of imageFiles) {
        newUrls.push(await uploadImage(file));
      }

      // Combine existing URLs (non-blob) with newly uploaded
      const existingUrlCount = imagePreviews.length - imageFiles.length;
      const existingUrls = imagePreviews.slice(0, existingUrlCount).filter(u => !u.startsWith("blob:"));
      const allImageUrls = [...existingUrls, ...newUrls];

      const propertyData = {
        title: form.title,
        title_mn: form.title_mn || null,
        price: Number(form.price),
        location: form.location,
        country: form.country,
        type: form.type,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area) || 0,
        description: form.description,
        description_mn: form.description_mn || null,
        features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
        image: allImageUrls[0] || property?.image || "",
        images: allImageUrls,
        featured: form.featured,
        is_dubai: form.country === "UAE",
        status: form.status,
      } as any;

      if (isEditing && property) {
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", property.id);
        if (error) throw error;
        toast({ title: "Property updated successfully" });
      } else {
        const { error } = await supabase.from("properties").insert(propertyData);
        if (error) throw error;
        toast({ title: "Property created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onClose();
    } catch (err: any) {
      toast({ title: "Error saving property", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const selectClass = "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground w-full h-10";

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">
          {isEditing ? t("form.edit") : t("form.addNew")}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">{t("form.image")} *</label>
          <div className="flex flex-wrap items-start gap-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative group">
                <img src={src} alt={`Preview ${i + 1}`} className="w-20 h-14 rounded-md object-cover border border-border" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-14 rounded-md border-2 border-dashed border-border hover:border-accent cursor-pointer flex items-center justify-center transition-colors"
            >
              <div className="text-center text-muted-foreground">
                <ImageIcon size={18} className="mx-auto" />
                <span className="text-[10px]">Add</span>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t("form.titleEn")} *</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Property title (English)" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t("form.titleMn")}</label>
            <Input value={form.title_mn} onChange={(e) => setForm({ ...form, title_mn: e.target.value })} placeholder="Гарчиг (Монгол)" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t("form.price")} *</label>
            <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="450000" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t("form.country")} *</label>
            <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={selectClass}>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t("form.location")} *</label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Downtown" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t("form.type")}</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("form.bedrooms")}</label>
              <Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} placeholder="3" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("form.bathrooms")}</label>
              <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} placeholder="2" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t("form.area")}</label>
              <Input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="1800" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">{t("form.descEn")} *</label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the property (English)..." rows={3} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">{t("form.descMn")}</label>
          <Textarea value={form.description_mn} onChange={(e) => setForm({ ...form, description_mn: e.target.value })} placeholder="Тодорхойлолт (Монгол)..." rows={3} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">{t("form.features")}</label>
          <Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="City View, Gym, Parking, Pool" />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">{t("form.status")}</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}>
            {PROPERTY_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">{t(`admin.status.${s}`)}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded border-input"
            />
            <label htmlFor="featured" className="text-sm text-foreground">{t("form.featured")}</label>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={saving}>
            {saving && <Loader2 className="animate-spin mr-2" size={16} />}
            {isEditing ? t("form.update") : t("form.create")}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>{t("form.cancel")}</Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
