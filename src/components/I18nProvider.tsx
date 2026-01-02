"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

type Lang = "en" | "ur"

interface I18nContextType {
    lang: Lang
    setLang: (lang: Lang) => void
    t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<string, Record<Lang, string>> = {
    "login": { en: "Login", ur: "لاگ ان" },
    "search.placeholder": { en: "Search for products...", ur: "مصنوعات تلاش کریں..." },
    "nav.shopByCategory": { en: "Shop by Category", ur: "زمرہ جات" },
    "nav.flashSales": { en: "Flash Sales", ur: "فلیش سیلز" },
    "nav.global": { en: "Global", ur: "عالمی" },
    "nav.healthcareCenter": { en: "Healthcare Center", ur: "ہیلتھ کیئر سینٹر" },
    "nav.eServices": { en: "E-Services", ur: "ای سروسز" },
    "nav.sellWithRass": { en: "Sell with Rass", ur: "راس کے ساتھ فروخت کریں" },
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>("en")

    const t = (key: string) => {
        if (translations[key]) {
            return translations[key][lang]
        }
        return key.split('.').pop() || key
    }

    return (
        <I18nContext.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useI18n() {
    const context = useContext(I18nContext)
    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider")
    }
    return context
}
