import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "mn";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { en: "Home", mn: "Нүүр" },
  "nav.properties": { en: "Properties", mn: "Үл хөдлөх" },
  "nav.about": { en: "About", mn: "Бидний тухай" },
  "nav.contact": { en: "Contact", mn: "Холбоо барих" },

  // Hero
  "hero.title": { en: "Find Your Dream Property", mn: "Мөрөөдлийн үл хөдлөх хөрөнгөө олоорой" },
  "hero.subtitle": { en: "Discover exceptional homes and investment opportunities with Jargal Properties.", mn: "Jargal Properties-тай хамт онцгой гэр орон, хөрөнгө оруулалтын боломжуудыг нээгээрэй." },
  "hero.allLocations": { en: "All Locations", mn: "Бүх байршил" },
  "hero.allTypes": { en: "All Types", mn: "Бүх төрөл" },
  "hero.search": { en: "Search", mn: "Хайх" },

  // Featured
  "featured.label": { en: "Featured", mn: "Онцлох" },
  "featured.title": { en: "Top Properties", mn: "Шилдэг үл хөдлөх" },
  "featured.viewAll": { en: "View All", mn: "Бүгдийг харах" },
  "featured.viewAllProperties": { en: "View All Properties", mn: "Бүх үл хөдлөхийг харах" },

  // About snippet
  "about.label": { en: "About Us", mn: "Бидний тухай" },
  "about.whyTitle": { en: "Why Jargal Properties?", mn: "Яагаад Jargal Properties?" },
  "about.whyDesc": { en: "With years of expertise in the real estate market, we provide personalized service to help you find the perfect property that matches your lifestyle and investment goals.", mn: "Үл хөдлөх хөрөнгийн зах зээл дээрх олон жилийн туршлагатай бид таны амьдралын хэв маяг, хөрөнгө оруулалтын зорилгод нийцсэн төгс хөрөнгийг олоход тусална." },
  "about.trusted": { en: "Trusted", mn: "Итгэлтэй" },
  "about.trustedDesc": { en: "Transparent dealings with every client", mn: "Үйлчлүүлэгч бүртэй ил тод харилцаа" },
  "about.personalized": { en: "Personalized", mn: "Хувь хүнд зориулсан" },
  "about.personalizedDesc": { en: "Tailored service for your unique needs", mn: "Таны онцгой хэрэгцээнд нийцсэн үйлчилгээ" },
  "about.expert": { en: "Expert", mn: "Мэргэжлийн" },
  "about.expertDesc": { en: "Deep market knowledge and insights", mn: "Зах зээлийн гүн мэдлэг, ойлголт" },

  // CTA
  "cta.title": { en: "Ready to Find Your Home?", mn: "Гэрээ олоход бэлэн үү?" },
  "cta.desc": { en: "Browse our full collection of properties or get in touch with our team today.", mn: "Манай бүх үл хөдлөх хөрөнгийн жагсаалтыг үзэх эсвэл манай багтай холбоо барина уу." },
  "cta.viewProperties": { en: "View Properties", mn: "Үл хөдлөх харах" },
  "cta.contactUs": { en: "Contact Us", mn: "Холбоо барих" },

  // Properties page
  "properties.browse": { en: "Browse", mn: "Үзэх" },
  "properties.title": { en: "Our Properties", mn: "Манай үл хөдлөх" },
  "properties.noMatch": { en: "No properties match your filters.", mn: "Шүүлтүүрт тохирох үл хөдлөх олдсонгүй." },

  // Filters
  "filter.allCountries": { en: "All Countries", mn: "Бүх улс" },
  "filter.allStatuses": { en: "All Statuses", mn: "Бүх төлөв" },

  // Form
  "form.country": { en: "Country", mn: "Улс" },

  "detail.back": { en: "Back to Properties", mn: "Буцах" },
  "detail.notFound": { en: "Property Not Found", mn: "Үл хөдлөх олдсонгүй" },
  "detail.description": { en: "Description", mn: "Тодорхойлолт" },
  "detail.features": { en: "Features", mn: "Онцлогууд" },
  "detail.askingPrice": { en: "Asking Price", mn: "Үнэ" },
  "detail.contact": { en: "Contact About This Property", mn: "Энэ үл хөдлөхийн талаар холбоо барих" },
  "detail.beds": { en: "Beds", mn: "Өрөө" },
  "detail.baths": { en: "Baths", mn: "Угаалга" },

  // About page
  "aboutPage.title": { en: "Jargal Properties", mn: "Jargal Properties" },
  "aboutPage.subtitle": { en: "Building lasting relationships through exceptional real estate experiences since our founding.", mn: "Үүсгэн байгуулагдсан цагаасаа хойш онцгой үл хөдлөх хөрөнгийн туршлагаар удаан хугацааны харилцаа холбоог бий болгож байна." },
  "aboutPage.storyTitle": { en: "Our Story", mn: "Бидний түүх" },
  "aboutPage.storyP1": { en: "Jargal Properties was founded with a simple mission: to make the real estate journey seamless, transparent, and rewarding for every client. We believe that finding the right property is more than a transaction — it's a life-changing decision.", mn: "Jargal Properties нь энгийн зорилготойгоор байгуулагдсан: үл хөдлөх хөрөнгийн аяллыг үйлчлүүлэгч бүрт хялбар, ил тод, үр дүнтэй болгох. Бид зөв хөрөнгө олох нь зүгээр нэг гүйлгээ биш — амьдрал өөрчлөгдөх шийдвэр гэдэгт итгэдэг." },
  "aboutPage.storyP2": { en: "Our team of dedicated professionals combines deep market knowledge with a genuine passion for helping people find their perfect home. Whether you're a first-time buyer, seasoned investor, or looking to sell, we bring the same level of commitment and expertise to every interaction.", mn: "Манай зориулалтын мэргэжлийн баг нь зах зээлийн гүн мэдлэгийг хүмүүст төгс гэрээ нь олоход туслах жинхэнэ хүсэл тэмүүлэлтэй хослуулдаг." },
  "aboutPage.missionTitle": { en: "Our Mission", mn: "Бидний эрхэм зорилго" },
  "aboutPage.missionDesc": { en: "To provide exceptional real estate services that exceed expectations, built on integrity, expertise, and a deep understanding of our clients' needs.", mn: "Шударга ёс, мэргэжлийн ур чадвар, үйлчлүүлэгчдийн хэрэгцээг гүнзгий ойлгох дээр суурилсан, хүлээлтээс давсан онцгой үл хөдлөх хөрөнгийн үйлчилгээ үзүүлэх." },
  "aboutPage.visionTitle": { en: "Our Vision", mn: "Бидний алсын хараа" },
  "aboutPage.visionDesc": { en: "To be the most trusted and respected real estate partner in the market, known for our unwavering commitment to client success and community growth.", mn: "Зах зээл дээр хамгийн итгэлтэй, хүндлэгдсэн үл хөдлөх хөрөнгийн түнш байх." },
  "aboutPage.valuesTitle": { en: "What We Stand For", mn: "Бидний үнэт зүйлс" },
  "aboutPage.integrity": { en: "Integrity", mn: "Шударга байдал" },
  "aboutPage.integrityDesc": { en: "Honest and transparent in every deal", mn: "Хэлцэл бүрт шударга, ил тод" },
  "aboutPage.excellence": { en: "Excellence", mn: "Шилдэг чанар" },
  "aboutPage.excellenceDesc": { en: "Going above and beyond always", mn: "Үргэлж хүлээлтээс давах" },
  "aboutPage.focus": { en: "Focus", mn: "Төвлөрөл" },
  "aboutPage.focusDesc": { en: "Client goals drive every decision", mn: "Үйлчлүүлэгчийн зорилго шийдвэр бүрийг удирдана" },
  "aboutPage.innovation": { en: "Innovation", mn: "Инноваци" },
  "aboutPage.innovationDesc": { en: "Modern approach to real estate", mn: "Үл хөдлөх хөрөнгөд орчин үеийн хандлага" },

  // Contact page
  "contact.label": { en: "Get In Touch", mn: "Холбоо барина уу" },
  "contact.title": { en: "Contact Us", mn: "Бидэнтэй холбоо барих" },
  "contact.name": { en: "Name", mn: "Нэр" },
  "contact.namePlaceholder": { en: "Your name", mn: "Таны нэр" },
  "contact.email": { en: "Email", mn: "Имэйл" },
  "contact.message": { en: "Message", mn: "Мессеж" },
  "contact.messagePlaceholder": { en: "How can we help you?", mn: "Бид танд хэрхэн тусалж чадах вэ?" },
  "contact.send": { en: "Send Message", mn: "Мессеж илгээх" },
  "contact.phone": { en: "Phone", mn: "Утас" },
  "contact.address": { en: "Address", mn: "Хаяг" },
  "contact.success": { en: "Message sent!", mn: "Мессеж илгээгдлээ!" },
  "contact.successDesc": { en: "We'll get back to you shortly.", mn: "Бид тантай удахгүй холбогдох болно." },
  "contact.fillAll": { en: "Please fill in all fields", mn: "Бүх талбарыг бөглөнө үү" },
  "contact.purpose": { en: "Contact us for property inquiries, partnerships, or support", mn: "Үл хөдлөх хөрөнгийн лавлагаа, хамтын ажиллагаа, дэмжлэгийн талаар бидэнтэй холбоо барина уу" },
  "contact.sendMessage": { en: "Send a Message", mn: "Мессеж илгээх" },
  "contact.scrollToForm": { en: "Use the form to reach us", mn: "Маягтаар бидэнтэй холбогдоорой" },
  "admin.messages": { en: "Messages", mn: "Мессежүүд" },
  "admin.noMessages": { en: "No messages yet.", mn: "Мессеж байхгүй байна." },

  // Footer
  "footer.desc": { en: "Your trusted partner in finding the perfect property. We bring expertise, integrity, and personalized service to every transaction.", mn: "Төгс хөрөнгө олоход таны итгэлтэй түнш. Бид гүйлгээ бүрт мэргэжлийн ур чадвар, шударга ёс, хувь хүнд зориулсан үйлчилгээг авчирдаг." },
  "footer.followUs": { en: "Follow Us", mn: "Биднийг дагаарай" },
  "footer.contactInfo": { en: "Contact Info", mn: "Холбоо барих мэдээлэл" },
  "footer.aboutUs": { en: "About Us", mn: "Бидний тухай" },
  "footer.rights": { en: "All rights reserved.", mn: "Бүх эрх хуулиар хамгаалагдсан." },

  // Admin
  "admin.login": { en: "Admin Login", mn: "Админ нэвтрэх" },
  "admin.signInDesc": { en: "Sign in to manage properties", mn: "Үл хөдлөх хөрөнгийг удирдахын тулд нэвтэрнэ үү" },
  "admin.email": { en: "Email", mn: "Имэйл" },
  "admin.password": { en: "Password", mn: "Нууц үг" },
  "admin.signIn": { en: "Sign In", mn: "Нэвтрэх" },
  "admin.dashboard": { en: "Admin Dashboard", mn: "Админ самбар" },
  "admin.manageListings": { en: "Manage your property listings", mn: "Үл хөдлөх хөрөнгийн жагсаалтаа удирдах" },
  "admin.addProperty": { en: "Add Property", mn: "Үл хөдлөх нэмэх" },
  "admin.logout": { en: "Logout", mn: "Гарах" },
  "admin.property": { en: "Property", mn: "Үл хөдлөх" },
  "admin.location": { en: "Location", mn: "Байршил" },
  "admin.type": { en: "Type", mn: "Төрөл" },
  "admin.price": { en: "Price", mn: "Үнэ" },
  "admin.actions": { en: "Actions", mn: "Үйлдлүүд" },
  "admin.noAccess": { en: "You don't have admin access. Please sign in with an admin account.", mn: "Танд админ хандалт байхгүй байна. Админ бүртгэлээр нэвтэрнэ үү." },
  "admin.signOut": { en: "Sign out", mn: "Гарах" },

  // Property form
  "form.addNew": { en: "Add New Property", mn: "Шинэ үл хөдлөх нэмэх" },
  "form.edit": { en: "Edit Property", mn: "Үл хөдлөх засах" },
  "form.image": { en: "Property Image", mn: "Зураг" },
  "form.clickUpload": { en: "Click to upload", mn: "Зураг оруулах" },
  "form.remove": { en: "Remove", mn: "Устгах" },
  "form.titleEn": { en: "Title (EN)", mn: "Гарчиг (EN)" },
  "form.titleMn": { en: "Title (MN)", mn: "Гарчиг (MN)" },
  "form.price": { en: "Price ($)", mn: "Үнэ ($)" },
  "form.location": { en: "Location", mn: "Байршил" },
  "form.type": { en: "Type", mn: "Төрөл" },
  "form.bedrooms": { en: "Bedrooms", mn: "Унтлагын өрөө" },
  "form.bathrooms": { en: "Bathrooms", mn: "Угаалгын өрөө" },
  "form.area": { en: "Area (sqft)", mn: "Талбай (sqft)" },
  "form.descEn": { en: "Description (EN)", mn: "Тодорхойлолт (EN)" },
  "form.descMn": { en: "Description (MN)", mn: "Тодорхойлолт (MN)" },
  "form.features": { en: "Features (comma-separated)", mn: "Онцлогууд (таслалаар тусгаарлах)" },
  "form.featured": { en: "Mark as featured property", mn: "Онцлох үл хөдлөхөөр тэмдэглэх" },
  "form.isDubai": { en: "Dubai property", mn: "Дубай үл хөдлөх" },
  "form.create": { en: "Create Property", mn: "Үл хөдлөх үүсгэх" },
  "form.update": { en: "Update Property", mn: "Шинэчлэх" },
  "form.cancel": { en: "Cancel", mn: "Цуцлах" },
  "form.status": { en: "Status", mn: "Төлөв" },

  // Admin status & search
  "admin.status.all": { en: "All", mn: "Бүгд" },
  "admin.status.available": { en: "Available", mn: "Боломжтой" },
  "admin.status.sold": { en: "Sold", mn: "Зарагдсан" },
  "admin.status.rented": { en: "Rented", mn: "Түрээслэгдсэн" },
  "admin.statusLabel": { en: "Status", mn: "Төлөв" },
  "admin.searchPlaceholder": { en: "Search by title or location...", mn: "Гарчиг эсвэл байршлаар хайх..." },
  "admin.noResults": { en: "No properties match your search.", mn: "Хайлтад тохирох үл хөдлөх олдсонгүй." },
  "status.notAvailable": { en: "Not Available", mn: "Боломжгүй" },
  "admin.deleteConfirmTitle": { en: "Delete Property", mn: "Үл хөдлөх устгах" },
  "admin.deleteConfirmDesc": { en: "Are you sure you want to delete this property? This action cannot be undone.", mn: "Та энэ үл хөдлөхийг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй." },
  "admin.deleteConfirm": { en: "Delete", mn: "Устгах" },
  "admin.backToProperties": { en: "Back to Properties", mn: "Үл хөдлөх рүү буцах" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
