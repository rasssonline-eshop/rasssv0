"use client"

import * as React from "react"

type LocationContextValue = {
  city: string
  setCity: (city: string) => void
}

const LocationContext = React.createContext<LocationContextValue | null>(null)

export const cities = [
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Multan",
  "Faisalabad",
  "Gujranwala",
  "Sialkot",
  "Peshawar",
  "Quetta",
]

export function useLocation() {
  const ctx = React.useContext(LocationContext)
  if (!ctx) throw new Error("useLocation must be used within LocationProvider")
  return ctx
}

export default function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = React.useState<string>("Lahore")

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("deliveryCity")
      if (saved) setCity(saved)
    } catch {}
  }, [])

  const updateCity = React.useCallback((c: string) => {
    setCity(c)
    try {
      localStorage.setItem("deliveryCity", c)
    } catch {}
  }, [])

  return (
    <LocationContext.Provider value={{ city, setCity: updateCity }}>
      {children}
    </LocationContext.Provider>
  )
}
