import { useState } from "react";
import { Phone, Mail, CheckCircle, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const WhatsAppIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

const ViberIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M12 7a5 5 0 0 1 5 5" />
    <path d="M12 9a3 3 0 0 1 3 3" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: t("contact.fillAll"), variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: t("contact.success"), description: t("contact.successDesc") });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">{t("contact.label")}</p>
            <h1 className="font-display text-4xl font-bold text-foreground mt-2">{t("contact.title")}</h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">{t("contact.purpose")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <CheckCircle size={48} className="text-accent mb-4" />
                <h2 className="font-display text-2xl font-bold text-foreground">{t("contact.success")}</h2>
                <p className="text-muted-foreground mt-2">{t("contact.successDesc")}</p>
                <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setSubmitted(false)}>
                  {t("contact.send")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("contact.name")}</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t("contact.namePlaceholder")}
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("contact.email")}</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("contact.message")}</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t("contact.messagePlaceholder")}
                    rows={5}
                    maxLength={1000}
                  />
                </div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={sending}>
                  {t("contact.send")}
                </Button>
              </form>
            )}

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <a href="mailto:jargalproperties28@gmail.com" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Mail size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("contact.email")}</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">jargalproperties28@gmail.com</p>
                  </div>
                </a>

                <a href="tel:+97689991628" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Phone size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("contact.phone")}</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">+976 8999-1628</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">+976 9967-1628</p>
                  </div>
                </a>

                <a href="https://wa.me/97689991628" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <WhatsAppIcon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">WhatsApp</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">+976 8999-1628</p>
                  </div>
                </a>

                <a href="viber://chat?number=%2B97689991628" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <ViberIcon size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Viber</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">+976 8999-1628</p>
                  </div>
                </a>

                <a href="https://www.instagram.com/jargal_properties/" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Instagram size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Instagram</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">@Jargal_Properties</p>
                  </div>
                </a>

                <a href="https://www.facebook.com/jargal.jargal.554238" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Facebook size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Facebook</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">Jargal Properties</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
