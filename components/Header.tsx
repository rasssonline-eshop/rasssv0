"use client"

import { Heart, ShoppingCart, Globe, User, MapPin, Store, ShoppingBag, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"
import { useCart } from "@/components/CartProvider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLocation, cities } from "@/components/LocationProvider"
import { useI18n } from "@/components/I18nProvider"
import { useSession, signOut } from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export default function Header() {
  const ref = useRef<HTMLElement | null>(null)
  const { count, setOpen } = useCart()
  const { city, setCity } = useLocation()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { lang, setLang, t } = useI18n()
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const user = session?.user
  const isAuthenticated = status === "authenticated"
  
  // Determine if user is in seller mode (on seller pages)
  const isSellerMode = pathname?.startsWith('/seller')
  const isSeller = user?.role === 'seller'
  const isAdmin = user?.role === 'admin'

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

  useEffect(() => {
    const update = () => {
      const h = ref.current?.offsetHeight ?? 0
      document.documentElement.style.setProperty("--header-height", `${h}px`)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
          setShowResults(true)
        }
      } catch (e) {
        console.error(e)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = () => {
    if (!query) return
    setShowResults(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <header
      ref={ref}
      className="bg-primary text-white sticky top-0 shadow-sm backdrop-blur-sm"
      style={{ zIndex: 9999 }}
    >
      <div className="px-3 py-1 sm:py-2">
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/Rasss-logo1.png"
              alt="Rasss"
              width={96}
              height={26}
              className="opacity-95"
              priority
              sizes="96px"
            />
          </Link>

          {/* Deliver Location */}
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-1 sm:gap-2 ml-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-white/90">{t("deliverTo")}</span>
                <span className="font-medium">{city}</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{lang === 'ur' ? 'ڈیلیوری مقام منتخب کریں' : 'Select delivery location'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder={lang === 'ur' ? 'شہر تلاش کریں' : 'Search city'}
                  className="bg-white"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCity(c)}
                      className={`px-3 py-2 rounded-md border text-sm ${c === city ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-gray-50'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Search Bar (hidden on mobile) */}
          <div className="hidden sm:block flex-1 min-w-0 relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch()
              }}
              onFocus={() => { if (results.length > 0) setShowResults(true) }}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder={t("search.placeholder")}
              className="w-full h-9 bg-white/10 text-white placeholder:text-white/60 border border-white/20 rounded-xl backdrop-blur-sm"
            />
            {showResults && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border overflow-hidden p-2 z-50 text-gray-900">
                {results.map((r) => (
                  <Link href={`/product/${r.slug}`} key={r.id} onClick={() => setShowResults(false)} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                      {r.image && <Image src={r.image} fill className="object-cover" alt={r.name} />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{r.name}</div>
                      <div className="text-xs text-primary font-bold">PKR {r.price}</div>
                    </div>
                  </Link>
                ))}
                <div className="border-t mt-2 pt-2">
                  <button onClick={handleSearch} className="w-full text-center text-xs text-primary font-medium hover:underline py-1">
                    View all results for "{query}"
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">

            {/* Stores Link */}
            <Link href="/stores">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/20 rounded-xl transition-all"
              >
                <Store className="w-4 h-4" />
                Stores
              </Button>
            </Link>

            {/* Role Switcher for Sellers */}
            {isSeller && (
              <>
                {/* Mobile Role Switcher */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 sm:hidden rounded-xl transition-all"
                  onClick={() => router.push(isSellerMode ? '/' : '/seller')}
                  title={isSellerMode ? 'Switch to Buying' : 'Switch to Selling'}
                >
                  {isSellerMode ? <ShoppingBag className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                </Button>

                {/* Desktop Role Switcher */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/20 rounded-xl transition-all"
                  onClick={() => router.push(isSellerMode ? '/' : '/seller')}
                >
                  {isSellerMode ? (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Switch to Buying
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4" />
                      Switch to Selling
                    </>
                  )}
                </Button>
              </>
            )}

            {/* Language (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 sm:hidden rounded-xl transition-all"
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            >
              <Globe className="w-4 h-4" />
            </Button>

            {/* Language (Desktop) */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/20 rounded-xl transition-all"
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            >
              <Globe className="w-4 h-4" />
              {lang === 'en' ? 'EN | اردو' : 'اردو | EN'}
            </Button>

            {/* User (Mobile) */}
            {!isAuthenticated ? (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 sm:hidden rounded-xl transition-all">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 sm:hidden rounded-xl transition-all cursor-pointer w-9 h-9 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {isSeller && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href={isSellerMode ? '/' : '/seller'} className="cursor-pointer flex items-center">
                          {isSellerMode ? (
                            <>
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Switch to Buying
                            </>
                          ) : (
                            <>
                              <Store className="w-4 h-4 mr-2" />
                              Switch to Selling
                            </>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer flex items-center">
                          <Store className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 flex items-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User (Desktop) */}
            {!isAuthenticated ? (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/20 rounded-xl transition-all">
                  <User className="w-4 h-4" />
                  {t("login")}
                </Button>
              </Link>
            ) : (
              <div className="relative hidden sm:block" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex gap-2 items-center text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/20 rounded-xl transition-all cursor-pointer h-9"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name || "User"}</span>
                </button>
                {showUserMenu && (
                  <div className="fixed w-48 bg-white rounded-md shadow-xl border overflow-hidden" style={{ zIndex: 99999, right: '1rem', top: 'calc(var(--header-height, 60px) - 0.25rem)' }}>
                    {isSeller && (
                      <>
                        <Link 
                          href={isSellerMode ? '/' : '/seller'} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setShowUserMenu(false)}
                        >
                          {isSellerMode ? (
                            <>
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Switch to Buying
                            </>
                          ) : (
                            <>
                              <Store className="w-4 h-4 mr-2" />
                              Switch to Selling
                            </>
                          )}
                        </Link>
                        <div className="border-t border-gray-200" />
                      </>
                    )}
                    {isAdmin && (
                      <>
                        <Link 
                          href="/admin" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Store className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                        <div className="border-t border-gray-200" />
                      </>
                    )}
                    <button 
                      onClick={() => {
                        setShowUserMenu(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl transition-all"
            >
              <Heart className="w-5 h-5" />
            </Button>

            {/* Cart */}
            <Button
              size="sm"
              className="relative bg-white text-primary font-medium hover:bg-white/90 px-3 py-1.5 rounded-xl transition-all shadow-md"
              onClick={() => setOpen(true)}
            >
              <ShoppingCart className="w-4 h-4" />
              {count > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full px-1 shadow-md">{count}</span>}
            </Button>

          </div>
        </div>
      </div>
    </header>
  )
}
