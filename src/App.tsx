import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Navigation from "./components/Navigation"
import Hero from "./components/Hero"
import BrandShowcase from "./components/BrandShowcase"
import CategoriesGrid from "./components/CategoriesGrid"
import Footer from "./components/Footer"
import CategoryPage from "./pages/CategoryPage"
import { I18nProvider } from "@/components/I18nProvider"
import AdminProvider from "@/components/AdminProvider"

export default function App() {
  return (
    <Router>
      <I18nProvider>
        <AdminProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <Navigation />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <BrandShowcase />
                    <CategoriesGrid />
                  </>
                }
              />
              <Route path="/category/:name" element={<CategoryPage />} />
            </Routes>
            <Footer />
          </div>
        </AdminProvider>
      </I18nProvider>
    </Router>
  )
}
