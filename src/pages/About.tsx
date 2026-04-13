import Layout from "@/components/Layout";
import { Target, Eye, Handshake, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-secondary">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider">{t("about.label")}</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mt-2">{t("aboutPage.title")}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
            {t("aboutPage.subtitle")}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-wide max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">{t("aboutPage.storyTitle")}</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">{t("aboutPage.storyP1")}</p>
          <p className="text-muted-foreground leading-relaxed">{t("aboutPage.storyP2")}</p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section-padding bg-secondary">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Target size={24} className="text-accent" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{t("aboutPage.missionTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.missionDesc")}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-8">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Eye size={24} className="text-accent" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{t("aboutPage.visionTitle")}</h3>
              <p className="text-muted-foreground leading-relaxed">{t("aboutPage.visionDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-wide text-center max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-foreground mb-10">{t("aboutPage.valuesTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Handshake, title: t("aboutPage.integrity"), desc: t("aboutPage.integrityDesc") },
              { icon: TrendingUp, title: t("aboutPage.excellence"), desc: t("aboutPage.excellenceDesc") },
              { icon: Target, title: t("aboutPage.focus"), desc: t("aboutPage.focusDesc") },
              { icon: Eye, title: t("aboutPage.innovation"), desc: t("aboutPage.innovationDesc") },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
