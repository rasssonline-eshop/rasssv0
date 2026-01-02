"use client"

import * as React from "react"

type Lang = "en" | "ur"

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
  dir: "ltr" | "rtl"
}

const dict: Record<Lang, Record<string, string>> = {
  en: {
    "deliverTo": "Deliver to",
    "login": "Login",
    "search.placeholder": "Search for products, brands and more",
    "nav.shopByCategory": "Shop by Category",
    "nav.eServices": "E-Services",
    "nav.flashSales": "Flash Sales",
    "nav.global": "Global",
    "nav.healthcareCenter": "Healthcare Center",
    "nav.sellWithRass": "Sell with Rass",
    "brands.shopBy": "Shop by Brands",
    "home.browseCategories": "Browse Categories",
    "home.findFast": "Find what you need, fast",
    "home.viewCategories": "View Categories",
    "home.shopNow": "Shop Now",
    "footer.rasssOnline": "Rasss Online",
    "footer.home": "Home",
    "footer.allCategories": "All Categories",
    "footer.flashSales": "Flash Sales",
    "footer.guestServices": "Guest Services",
    "footer.deliveryInfo": "Delivery Information",
    "footer.returnsExchange": "Returns & Exchange",
    "footer.contactUs": "Contact Us",
    "footer.quickLinks": "Quick Links",
    "footer.fragrances": "Fragrances",
    "footer.makeup": "Makeup",
    "footer.babyCare": "Baby Care",
    "footer.vitamins": "Vitamins",
    "button.addToCart": "Add to Cart",
    "category.showing": "Showing",
    "common.products": "products",
    "badge.comingSoon": "Coming Soon",
    "badge.save": "Save",
    "sort.sort": "Sort",
    "sort.relevance": "Relevance",
    "sort.priceAsc": "Price: Low to High",
    "sort.priceDesc": "Price: High to Low",
    "sort.rating": "Rating",
    "filter.brand": "Brand",
    "filter.price": "Price",
    "filter.to": "to",
    "product.cashOnDelivery": "Cash on Delivery available",
    "product.inStock": "In Stock",
    "product.highlights": "Highlights",
    "product.genuineBrands": "Genuine brands",
    "product.temperatureControlled": "Temperature Controlled",
    "mobile.home": "Home",
    "mobile.categories": "Categories",
    "mobile.brands": "Brands",
    "mobile.cart": "Cart",
    "mobile.account": "Account",
    "hero.slide1.title": "Beauty & Wellness",
    "hero.slide1.subtitle": "Made for Pakistan",
    "hero.slide2.title": "Great Prices",
    "hero.slide2.subtitle": "Exclusive online deals every day",
    "hero.slide3.title": "Same-Day Delivery",
    "hero.slide3.subtitle": "Available in Lahore",
    "auth.logout": "Logout",
    "auth.customerLogin": "Customer Login",
    "auth.sellerLogin": "Seller Login",
    "auth.phoneNumber": "Phone Number",
    "auth.enterOtp": "Enter OTP",
    "auth.verify": "Verify",
    "auth.sendOtp": "Send OTP",
    "profile.myProfile": "My Profile",
    "profile.orders": "Orders",
    "profile.wishlist": "Wishlist",
    "profile.addresses": "Addresses",
    "seller.dashboard": "Seller Dashboard",
    "seller.pending": "Pending Approval",
    "seller.approved": "Approved",
    "seller.rejected": "Rejected",
    "seller.waitingApproval": "Waiting for admin approval",
    "seller.sellOurProducts": "Sell Our Products",
    "seller.sellYourProducts": "Sell Your Products",
    "seller.rejectionReason": "Rejection Reason",
    "admin.sellers": "Sellers",
    "admin.approve": "Approve",
    "admin.reject": "Reject",
    "admin.allSellers": "All Sellers",
    "admin.pendingSellers": "Pending",
    "admin.approvedSellers": "Approved",
    "admin.rejectedSellers": "Rejected",
  },
  ur: {
    "deliverTo": "ڈیلیور کریں",
    "login": "لاگ ان",
    "search.placeholder": "مصنوعات، برانڈز اور مزید تلاش کریں",
    "nav.shopByCategory": "زمرہ کے مطابق خریدیں",
    "nav.eServices": "ای-سروسز",
    "nav.flashSales": "فلیش سیلز",
    "nav.global": "گلوبل",
    "nav.healthcareCenter": "ہیلتھ کیئر سینٹر",
    "nav.sellWithRass": "راسس کے ساتھ بیچیں",
    "brands.shopBy": "برانڈز کے مطابق خریدیں",
    "home.browseCategories": "زمرہ جات دیکھیں",
    "home.findFast": "جو چاہیں فوراً تلاش کریں",
    "home.viewCategories": "زمرہ جات دیکھیں",
    "home.shopNow": "ابھی خریدیں",
    "footer.rasssOnline": "راسس آن لائن",
    "footer.home": "ہوم",
    "footer.allCategories": "تمام زمرہ جات",
    "footer.flashSales": "فلیش سیلز",
    "footer.guestServices": "مہمان خدمات",
    "footer.deliveryInfo": "ڈیلیوری معلومات",
    "footer.returnsExchange": "واپسی اور تبادلہ",
    "footer.contactUs": "ہم سے رابطہ کریں",
    "footer.quickLinks": "فوری روابط",
    "footer.fragrances": "خوشبوئیں",
    "footer.makeup": "میک اپ",
    "footer.babyCare": "بچے کی دیکھ بھال",
    "footer.vitamins": "وٹامنز",
    "button.addToCart": "کارٹ میں شامل کریں",
    "category.showing": "دکھائے جا رہے ہیں",
    "common.products": "مصنوعات",
    "badge.comingSoon": "جلد آ رہا ہے",
    "badge.save": "بچت",
    "sort.sort": "ترتیب",
    "sort.relevance": "اہمیت",
    "sort.priceAsc": "قیمت: کم سے زیادہ",
    "sort.priceDesc": "قیمت: زیادہ سے کم",
    "sort.rating": "ریٹنگ",
    "filter.brand": "برانڈ",
    "filter.price": "قیمت",
    "filter.to": "سے",
    "product.cashOnDelivery": "کیش آن ڈیلیوری دستیاب",
    "product.inStock": "اسٹاک میں موجود",
    "product.highlights": "اہم خصوصیات",
    "product.genuineBrands": "اصلی برانڈز",
    "product.temperatureControlled": "درجۂ حرارت کنٹرولڈ",
    "mobile.home": "ہوم",
    "mobile.categories": "زمرہ جات",
    "mobile.brands": "برانڈز",
    "mobile.cart": "کارٹ",
    "mobile.account": "اکاؤنٹ",
    "hero.slide1.title": "خوبصورتی اور تندرستی",
    "hero.slide1.subtitle": "پاکستان کے لیے تیار",
    "hero.slide2.title": "بہترین قیمتیں",
    "hero.slide2.subtitle": "خصوصی آن لائن ڈیلز روزانہ",
    "hero.slide3.title": "اسی دن ڈیلیوری",
    "hero.slide3.subtitle": "صرف لاہور میں دستیاب",
    "auth.logout": "لاگ آؤٹ",
    "auth.customerLogin": "کسٹمر لاگ ان",
    "auth.sellerLogin": "سیلر لاگ ان",
    "auth.phoneNumber": "فون نمبر",
    "auth.enterOtp": "OTP درج کریں",
    "auth.verify": "تصدیق کریں",
    "auth.sendOtp": "OTP بھیجیں",
    "profile.myProfile": "میری پروفائل",
    "profile.orders": "آرڈرز",
    "profile.wishlist": "خواہش کی فہرست",
    "profile.addresses": "پتے",
    "seller.dashboard": "سیلر ڈیش بورڈ",
    "seller.pending": "منظوری زیر التواء",
    "seller.approved": "منظور شدہ",
    "seller.rejected": "مسترد",
    "seller.waitingApproval": "ایڈمن کی منظوری کا انتظار",
    "seller.sellOurProducts": "ہماری مصنوعات بیچیں",
    "seller.sellYourProducts": "اپنی مصنوعات بیچیں",
    "seller.rejectionReason": "مسترد کرنے کی وجہ",
    "admin.sellers": "سیلرز",
    "admin.approve": "منظور کریں",
    "admin.reject": "مسترد کریں",
    "admin.allSellers": "تمام سیلرز",
    "admin.pendingSellers": "زیر التواء",
    "admin.approvedSellers": "منظور شدہ",
    "admin.rejectedSellers": "مسترد شدہ",
  },
}

const I18nContext = React.createContext<I18nContextValue | null>(null)

export function useI18n() {
  const ctx = React.useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>("en")

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("lang") as Lang | null
      if (saved === "en" || saved === "ur") setLang(saved)
    } catch { }
  }, [])

  React.useEffect(() => {
    try { localStorage.setItem("lang", lang) } catch { }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang === "ur" ? "ur" : "en")
      document.documentElement.setAttribute("dir", lang === "ur" ? "rtl" : "ltr")
    }
  }, [lang])

  const t = React.useCallback((key: string) => {
    const table = dict[lang]
    return table[key] ?? key
  }, [lang])

  const value: I18nContextValue = {
    lang,
    setLang,
    t,
    dir: lang === "ur" ? "rtl" : "ltr",
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

