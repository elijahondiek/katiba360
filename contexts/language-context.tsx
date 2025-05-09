"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Define supported languages
export type Language = "en" | "sw" | "kik" | "luo" | "kal" | "kam"

export const languages = {
  en: { name: "English", flag: "kenya.svg", nativeName: "English" },
  sw: { name: "Kiswahili", flag: "kenya.svg", nativeName: "Kiswahili" },
  kik: { name: "Kikuyu", flag: "kenya.svg", nativeName: "Gĩkũyũ" },
  luo: { name: "Luo", flag: "kenya.svg", nativeName: "Dholuo" },
  kal: { name: "Kalenjin", flag: "kenya.svg", nativeName: "Kalenjin" },
  kam: { name: "Kamba", flag: "kenya.svg", nativeName: "Kikamba" },
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Define translations directly in the code instead of importing JSON files
const translations = {
  en: {
    "app.title": "Katiba360",
    "app.tagline": "Kenya's Constitution, Made Simple",
    "app.description":
      "Explore, understand, and engage with Kenya's constitution in a way that's accessible to everyone.",
    "nav.chapters": "Chapters",
    "nav.rights": "Rights",
    "nav.learn": "Learn",
    "nav.about": "About",
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "search.placeholder": "Search the constitution or ask a question...",
    "home.explore": "Explore the Constitution",
    "home.viewAllChapters": "View All Chapters",
    "home.rightOfDay": "Right of the Day",
    "home.readFullArticle": "Read Full Article",
    "home.shareRight": "Share This Right",
    "home.commonScenarios": "Common Scenarios",
    "home.viewAllScenarios": "View All Scenarios",
    "chapter.sovereignty": "Sovereignty of the People",
    "chapter.sovereignty.desc": "Chapters 1-2: Sovereignty, Republic, National Values",
    "chapter.rights": "Bill of Rights",
    "chapter.rights.desc": "Chapter 4: Fundamental Rights and Freedoms",
    "chapter.governance": "Governance Structure",
    "chapter.governance.desc": "Chapters 8-12: Executive, Legislature, Judiciary",
    "chapter.devolution": "Devolution",
    "chapter.devolution.desc": "Chapter 11: Devolved Government and County Powers",
    "scenario.arrest": "Know Your Rights During Arrest",
    "scenario.arrest.desc": "Learn about your constitutional rights when interacting with law enforcement.",
    "scenario.property": "Property Rights & Land Ownership",
    "scenario.property.desc": "Understand constitutional protections for property and land rights in Kenya.",
    "scenario.services": "Accessing Government Services",
    "scenario.services.desc": "Know your rights when dealing with government offices and services.",
    "scenario.workplace": "Workplace Rights",
    "scenario.workplace.desc": "Explore your constitutional rights in employment and labor relations.",
    "scenario.healthcare": "Healthcare Rights",
    "scenario.healthcare.desc": "Learn about your right to healthcare and medical services in Kenya.",
    "scenario.education": "Education Rights",
    "scenario.education.desc": "Understand constitutional provisions for education in Kenya.",
    "footer.mission":
      "Making Kenya's constitution accessible to everyone through simple language and practical examples.",
    "footer.explore": "Explore",
    "footer.about": "About",
    "footer.connect": "Connect",
    "footer.copyright": "All rights reserved.",
  },
  sw: {
    "app.title": "Katiba360",
    "app.tagline": "Katiba ya Kenya, Kwa Njia Rahisi",
    "app.description": "Chunguza, elewa, na shiriki na katiba ya Kenya kwa njia inayofikika kwa kila mtu.",
    "nav.chapters": "Sura",
    "nav.rights": "Haki",
    "nav.learn": "Jifunze",
    "nav.about": "Kuhusu",
    "auth.signin": "Ingia",
    "auth.signup": "Jisajili",
    "search.placeholder": "Tafuta katiba au uliza swali...",
    "home.explore": "Chunguza Katiba",
    "home.viewAllChapters": "Tazama Sura Zote",
    "home.rightOfDay": "Haki ya Siku",
    "home.readFullArticle": "Soma Kifungu Kamili",
    "home.shareRight": "Shiriki Haki Hii",
    "home.commonScenarios": "Hali za Kawaida",
    "home.viewAllScenarios": "Tazama Hali Zote",
    "chapter.sovereignty": "Mamlaka ya Wananchi",
    "chapter.sovereignty.desc": "Sura 1-2: Mamlaka, Jamhuri, Maadili ya Kitaifa",
    "chapter.rights": "Mswada wa Haki",
    "chapter.rights.desc": "Sura 4: Haki na Uhuru wa Msingi",
    "chapter.governance": "Muundo wa Utawala",
    "chapter.governance.desc": "Sura 8-12: Utendaji, Bunge, Mahakama",
    "chapter.devolution": "Ugatuzi",
    "chapter.devolution.desc": "Sura 11: Serikali za Kaunti na Mamlaka",
    "scenario.arrest": "Fahamu Haki Zako Wakati wa Kukamatwa",
    "scenario.arrest.desc": "Jifunze kuhusu haki zako za kikatiba unaposhirikiana na vyombo vya usalama.",
    "scenario.property": "Haki za Mali na Umiliki wa Ardhi",
    "scenario.property.desc": "Elewa ulinzi wa kikatiba kwa haki za mali na ardhi nchini Kenya.",
    "scenario.services": "Kupata Huduma za Serikali",
    "scenario.services.desc": "Fahamu haki zako unaposhughulika na ofisi na huduma za serikali.",
    "scenario.workplace": "Haki za Mahali pa Kazi",
    "scenario.workplace.desc": "Chunguza haki zako za kikatiba katika ajira na mahusiano ya kazi.",
    "scenario.healthcare": "Haki za Afya",
    "scenario.healthcare.desc": "Jifunze kuhusu haki yako ya huduma za afya nchini Kenya.",
    "scenario.education": "Haki za Elimu",
    "scenario.education.desc": "Elewa masharti ya kikatiba ya elimu nchini Kenya.",
    "footer.mission": "Kufanya katiba ya Kenya ifikike kwa kila mtu kupitia lugha rahisi na mifano halisi.",
    "footer.explore": "Chunguza",
    "footer.about": "Kuhusu",
    "footer.connect": "Unganisha",
    "footer.copyright": "Haki zote zimehifadhiwa.",
  },
  kik: {
    "app.title": "Katiba360",
    "app.tagline": "Katiba ya Kenya, Na Njĩra Ĩrĩa Yorĩtie",
    "app.description": "Tuĩria, menya, na ĩkĩra katiba ya Kenya na njĩra ĩrĩa ĩngĩkinya kũrĩ o mũndũ.",
    "nav.chapters": "Icigo",
    "nav.rights": "Kihooto",
    "nav.learn": "Thoma",
    "nav.about": "Uhoro",
    "search.placeholder": "Caria katiba kana ũrie kĩũria...",
    "home.explore": "Tuĩria Katiba",
    "home.viewAllChapters": "Ona Icigo Ciothe",
    "home.rightOfDay": "Kihooto kĩa Mũthenya",
    "home.readFullArticle": "Thoma Kĩrĩkanĩro Gĩothe",
    "home.shareRight": "Gaya Kihooto Gĩkĩ",
    "home.commonScenarios": "Maũndũ ma Kawaida",
    "home.viewAllScenarios": "Ona Maũndũ Mothe",
    "footer.copyright": "Kihooto gĩothe kĩgitĩtwo.",
  },
  luo: {
    "app.title": "Katiba360",
    "app.tagline": "Katiba mar Kenya, E Yo Mayot",
    "app.description": "Nono, winj, kendo donjni e katiba mar Kenya e yo ma nyalore ni ji duto.",
    "nav.chapters": "Sula",
    "nav.rights": "Ratiro",
    "nav.learn": "Puonjri",
    "nav.about": "Kuom",
    "search.placeholder": "Manye katiba kata penje penjo...",
    "home.explore": "Nono Katiba",
    "home.viewAllChapters": "Ne Sula Duto",
    "home.rightOfDay": "Ratiro mar Odiechieng",
    "home.readFullArticle": "Som Ndiko Duto",
    "home.shareRight": "Pogne Ratiro Ma",
    "home.commonScenarios": "Gik Mapile",
    "home.viewAllScenarios": "Ne Gik Mapile Duto",
    "footer.copyright": "Ratiro duto okan.",
  },
  kal: {
    "app.title": "Katiba360",
    "app.tagline": "Katiba ne Kenya, Eng Oret Ne Leel",
    "app.description": "Seet, nai, ak tesetai katiba ne Kenya eng oret ne nyolu chi piik tugul.",
    "nav.chapters": "Chapters",
    "nav.rights": "Rights",
    "nav.learn": "Learn",
    "nav.about": "About",
    "search.placeholder": "Cheng katiba anan teep saalan...",
    "home.explore": "Seet Katiba",
    "home.viewAllChapters": "Iro Chapters Tugul",
    "home.rightOfDay": "Right ne Betut",
    "home.readFullArticle": "Som Article Komie",
    "home.shareRight": "Konoren Right Ni",
    "home.commonScenarios": "Scenarios Ne Piik",
    "home.viewAllScenarios": "Iro Scenarios Tugul",
    "footer.copyright": "Rights tugul ko reserved.",
  },
  kam: {
    "app.title": "Katiba360",
    "app.tagline": "Katiba ya Kenya, Kwa Nzia Yivikie",
    "app.description": "Thathaya, manya, na ukwatanie na katiba ya Kenya kwa nzia yivikie kwa kila mundu.",
    "nav.chapters": "Chapters",
    "nav.rights": "Rights",
    "nav.learn": "Learn",
    "nav.about": "About",
    "search.placeholder": "Manisa katiba kana ukulye kyuulyo...",
    "home.explore": "Thathaya Katiba",
    "home.viewAllChapters": "Ona Chapters Syonthe",
    "home.rightOfDay": "Right ya Muthenya",
    "home.readFullArticle": "Some Article Yonthe",
    "home.shareRight": "Eanisya Right Ino",
    "home.commonScenarios": "Maundũ ma Kawaida",
    "home.viewAllScenarios": "Ona Maundũ Onthe",
    "footer.copyright": "Rights syonthe ni syakwatwa.",
  },
}

// Update the LanguageProvider component to use the in-memory translations
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && Object.keys(languages).includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  const value = {
    language,
    setLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
