"use client"

import { useAdmin } from '@/components/AdminProvider'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { toast } from 'sonner'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Trash, ClipboardCopy, RefreshCw, Home, Grid2X2, Image as ImageIcon, Tags, Settings } from 'lucide-react'

function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [pinExists, setPinExists] = useState(false)
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')

  useEffect(() => {
    try {
      const sess = sessionStorage.getItem('adminAuthed')
      if (sess === '1') { setAuthed(true); return }
      const saved = localStorage.getItem('adminPin')
      setPinExists(!!saved)
    } catch {}
  }, [])

  if (authed) return children as any

  return (
    <div className="max-w-md mx-auto py-12">
      <Card className="p-6 space-y-4">
        {!pinExists ? (
          <>
            <h2 className="text-xl font-semibold">Set Admin Passcode</h2>
            <Input type="password" placeholder="New passcode" value={newPin} onChange={e => setNewPin(e.target.value)} />
            <Input type="password" placeholder="Confirm passcode" value={confirmPin} onChange={e => setConfirmPin(e.target.value)} />
            <Button onClick={() => { if (!newPin || newPin !== confirmPin) return; try { localStorage.setItem('adminPin', newPin); setPinExists(true); setNewPin(''); setConfirmPin('') } catch {} }}>Save</Button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Admin Login</h2>
            <Input type="password" placeholder="Enter passcode" value={pin} onChange={e => setPin(e.target.value)} />
            <Button onClick={() => { try { const saved = localStorage.getItem('adminPin'); if (pin && pin === saved) { sessionStorage.setItem('adminAuthed', '1'); setAuthed(true) } } catch {} }}>Enter</Button>
          </>
        )}
      </Card>
    </div>
  )
}

function CategoriesTab() {
  const { store, addCategory, updateCategory, removeCategory, setStore } = useAdmin()
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [subs, setSubs] = useState('')
  return (
    <div className="space-y-4">
      <Card id="categories-form" className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} />
          <Input placeholder="Subcategories comma-separated" value={subs} onChange={e => setSubs(e.target.value)} />
          <div className="flex gap-2">
            <Button className="w-full md:w-auto" onClick={() => { if (!name) return; addCategory({ name, image, subcategories: subs.split(',').map(s => s.trim()).filter(Boolean) }); toast.success('Category added'); setName(''); setImage(''); setSubs('') }}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
            <Button variant="ghost" onClick={() => { setName(''); setImage(''); setSubs('') }}>
              <RefreshCw className="w-4 h-4 mr-1" /> Clear
            </Button>
          </div>
        </div>
      </Card>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setStore({ ...store, categories: [...store.categories].sort((a,b)=>a.name.localeCompare(b.name)) })}>Sort A–Z</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {store.categories.map(c => (
          <Card key={c.name} className="p-4 space-y-2">
            <div className="font-semibold flex items-center justify-between">
              <span>{c.name}</span>
              <div className="flex items-center gap-2">
                <Link className="text-xs underline" href={`/category/${encodeURIComponent(c.name)}`}>Preview</Link>
                <Button size="sm" variant="ghost" onClick={() => { try { navigator.clipboard.writeText(`/category/${encodeURIComponent(c.name)}`); toast.success('Link copied') } catch {} }}>
                  <ClipboardCopy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {c.image && (
                <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                  <Image src={c.image} alt={c.name} fill className="object-cover" sizes="48px" />
                </div>
              )}
              <div className="text-sm text-gray-600 flex-1">{(c.subcategories||[]).join(', ')}</div>
              <Badge variant="secondary" className="shrink-0">{(c.subcategories||[]).length} subs</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Input placeholder="Image URL" defaultValue={c.image} onBlur={e => { updateCategory(c.name, { image: e.target.value }); toast.success('Category image updated') }} />
              <Button variant="outline" onClick={() => { removeCategory(c.name); toast.success('Category removed') }}>
                <Trash className="w-4 h-4 mr-1" /> Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ProductsTab() {
  const { store, addProduct, updateProduct, removeProduct } = useAdmin()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const uploadFile = async (file: File) => {
    const token = localStorage.getItem('adminPin') || ''
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'x-admin-token': token }, body: fd })
    if (!res.ok) throw new Error('upload_failed')
    const json = await res.json()
    return String(json.url || '')
  }
  return (
    <div className="space-y-4">
      <Card id="products-form" className="p-4 grid grid-cols-1 md:grid-cols-5 gap-2">
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {store.categories.map(c => (<SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <div className="flex items-center gap-2">
          <Input placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} />
          <input type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; try { const url = await uploadFile(f); setImage(url); toast.success('Image uploaded') } catch { toast.error('Upload failed') } }} />
        </div>
        <div className="flex gap-2">
        <Button onClick={() => {
          if (!name || !category) return
          const id = `${category}:${name}`
          const slug = name.toLowerCase().replace(/\s+/g, '-')
          addProduct({ id, name, slug, price: Number(price||'0'), image, category })
          toast.success('Product added')
          setName(''); setCategory(''); setPrice(''); setImage('')
        }}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
        <Button variant="ghost" onClick={() => { setName(''); setCategory(''); setPrice(''); setImage('') }}>
          <RefreshCw className="w-4 h-4 mr-1" /> Clear
        </Button>
        </div>
      </Card>
      <div className="space-y-2">
        {Object.entries(store.productsByCategory).map(([cat, list]) => (
          <Card key={cat} className="p-4">
            <div className="font-semibold mb-2">{cat}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {list.map(p => (
                <Card key={p.id} className="p-3 flex items-center gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-xs text-gray-600">{p.price}</div>
                  </div>
                  {p.image && (
                    <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                    </div>
                  )}
                  <Input className="w-36" type="number" defaultValue={String(p.price)} onBlur={e => { updateProduct(p.id, { price: Number(e.target.value||'0') }); toast.success('Price updated') }} />
                  <div className="flex items-center gap-2">
                    <Input className="w-56" defaultValue={p.image} onBlur={e => { updateProduct(p.id, { image: e.target.value }); toast.success('Image updated') }} />
                    <input type="file" accept="image/*" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; try { const url = await uploadFile(f); updateProduct(p.id, { image: url }); toast.success('Image uploaded') } catch { toast.error('Upload failed') } }} />
                  </div>
                  <Link href={`/product/${encodeURIComponent(p.slug||'')}`} className="text-xs underline flex items-center gap-1"><Eye className="w-3 h-3" /> Preview</Link>
                  <Button size="sm" variant="ghost" onClick={() => { try { navigator.clipboard.writeText(`/product/${encodeURIComponent(p.slug||'')}`); toast.success('Link copied') } catch {} }}>
                    <ClipboardCopy className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" onClick={() => { const id = `${p.id}-copy`; const slug = `${(p.slug||p.name.toLowerCase().replace(/\s+/g,'-'))}-copy`; addProduct({ id, name: p.name + ' Copy', slug, price: p.price, image: p.image, category: cat }); toast.success('Product duplicated') }}>
                    Duplicate
                  </Button>
                  <Button variant="outline" onClick={() => { removeProduct(p.id); toast.success('Product removed') }}>
                    <Trash className="w-4 h-4 mr-1" /> Remove
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SlidesTab() {
  const { store, upsertSlide, removeSlide, setStore } = useAdmin()
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [image, setImage] = useState('')
  return (
    <div className="space-y-4">
      <Card id="slides-form" className="p-4 flex items-center gap-2">
        <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <Input placeholder="Subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
        <Input placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} />
        <Button onClick={() => { if (!title) return; const id = `${title}`; upsertSlide({ id, title, subtitle, image }); toast.success('Slide added'); setTitle(''); setSubtitle(''); setImage('') }}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
        <Button variant="ghost" onClick={() => { setTitle(''); setSubtitle(''); setImage('') }}>
          <RefreshCw className="w-4 h-4 mr-1" /> Clear
        </Button>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {store.slides.map((s, idx) => (
          <Card key={s.id} className="p-3 flex items-center gap-2">
            <div className="flex-1">
              <div className="font-semibold text-sm">{s.title}</div>
              <div className="text-xs text-gray-600">{s.subtitle}</div>
            </div>
            <Input className="w-56" defaultValue={s.image} onBlur={e => { upsertSlide({ ...s, image: e.target.value }); toast.success('Slide image updated') }} />
            <div className="flex items-center gap-1">
              <Button variant="ghost" disabled={idx===0} onClick={() => { const next = [...store.slides]; [next[idx-1], next[idx]] = [next[idx], next[idx-1]]; setStore({ ...store, slides: next }); toast.success('Moved up') }}>↑</Button>
              <Button variant="ghost" disabled={idx===store.slides.length-1} onClick={() => { const next = [...store.slides]; [next[idx+1], next[idx]] = [next[idx], next[idx+1]]; setStore({ ...store, slides: next }); toast.success('Moved down') }}>↓</Button>
            </div>
            <Button variant="outline" onClick={() => { removeSlide(s.id); toast.success('Slide removed') }}>
              <Trash className="w-4 h-4 mr-1" /> Remove
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function BrandsTab() {
  const { store, upsertBrand, removeBrand } = useAdmin()
  const [name, setName] = useState('')
  const [logo, setLogo] = useState('')
  return (
    <div className="space-y-4">
      <Card id="brands-form" className="p-4 flex items-center gap-2">
        <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <Input placeholder="Logo URL" value={logo} onChange={e => setLogo(e.target.value)} />
        <Button onClick={() => { if (!name) return; const id = name; upsertBrand({ id, name, logo }); toast.success('Brand added'); setName(''); setLogo('') }}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
        <Button variant="ghost" onClick={() => { setName(''); setLogo('') }}>
          <RefreshCw className="w-4 h-4 mr-1" /> Clear
        </Button>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {store.brands.map(b => (
          <Card key={b.id} className="p-3 flex items-center gap-2">
            <div className="flex-1 font-semibold text-sm">{b.name}</div>
            <Input className="w-56" defaultValue={b.logo} onBlur={e => { upsertBrand({ ...b, logo: e.target.value }); toast.success('Logo updated') }} />
            <Button variant="outline" onClick={() => { removeBrand(b.id); toast.success('Brand removed') }}>
              <Trash className="w-4 h-4 mr-1" /> Remove
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SettingsTab() {
  const { store, importJson, exportJson, setStore } = useAdmin()
  const [raw, setRaw] = useState('')
  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-2">
        <Button variant="outline" onClick={() => setRaw(exportJson())}>Export JSON</Button>
        <Textarea placeholder="Paste JSON here" value={raw} onChange={e => setRaw(e.target.value)} className="min-h-32" />
        <div className="flex items-center gap-2">
          <Button onClick={() => { try { importJson(JSON.parse(raw)); toast.success('Imported'); setRaw('') } catch { toast.error('Invalid JSON') } }}>Import</Button>
          <Button variant="outline" onClick={() => { const ok = confirm('Reset all admin data?'); if (!ok) return; setStore({ categories: [], productsByCategory: {}, slides: [], brands: [] }); toast.success('Reset complete') }}>Reset</Button>
          <Button variant="ghost" onClick={() => { try { sessionStorage.removeItem('adminAuthed') } catch {}; location.assign('/admin') }}>Sign out</Button>
        </div>
        <div className="text-xs text-gray-600">Categories: {store.categories.length} · Products: {Object.values(store.productsByCategory).reduce((a,b)=>a+b.length,0)} · Slides: {store.slides.length} · Brands: {store.brands.length}</div>
      </Card>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { store } = useAdmin()
  const [tab, setTab] = useState('categories')
  const productCount = Object.values(store.productsByCategory).reduce((a,b)=>a+b.length,0)
  return (
    <AdminGate>
      <div className="container py-8">
        <div className="bg-gradient-to-r from-purple-900 to-purple-800 rounded-lg p-6 text-white mb-6">
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-white/80 text-sm">Manage storefront content in real time.</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="bg-white/10 border-white/20 text-white">
              <div className="px-4">
                <div className="text-xs uppercase opacity-80">Categories</div>
                <div className="text-2xl font-bold">{store.categories.length}</div>
              </div>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <div className="px-4">
                <div className="text-xs uppercase opacity-80">Products</div>
                <div className="text-2xl font-bold">{productCount}</div>
              </div>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <div className="px-4">
                <div className="text-xs uppercase opacity-80">Slides</div>
                <div className="text-2xl font-bold">{store.slides.length}</div>
              </div>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <div className="px-4">
                <div className="text-xs uppercase opacity-80">Brands</div>
                <div className="text-2xl font-bold">{store.brands.length}</div>
              </div>
            </Card>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" onClick={() => { setTab('categories'); document.getElementById('categories-form')?.scrollIntoView({ behavior: 'smooth' }) }}><Grid2X2 className="w-4 h-4 mr-1" /> Add Category</Button>
          <Button variant="outline" onClick={() => { setTab('products'); document.getElementById('products-form')?.scrollIntoView({ behavior: 'smooth' }) }}><Tags className="w-4 h-4 mr-1" /> Add Product</Button>
          <Button variant="outline" onClick={() => { setTab('slides'); document.getElementById('slides-form')?.scrollIntoView({ behavior: 'smooth' }) }}><ImageIcon className="w-4 h-4 mr-1" /> Add Slide</Button>
          <Button variant="outline" onClick={() => { setTab('brands'); document.getElementById('brands-form')?.scrollIntoView({ behavior: 'smooth' }) }}><Tags className="w-4 h-4 mr-1" /> Add Brand</Button>
          <Button variant="ghost" onClick={() => setTab('settings')}><Settings className="w-4 h-4 mr-1" /> Settings</Button>
          <Button variant="secondary" asChild><Link href="/"><Home className="w-4 h-4 mr-1" /> Home</Link></Button>
          <Button variant="secondary" asChild><Link href="/#categories"><Grid2X2 className="w-4 h-4 mr-1" /> Categories</Link></Button>
          <Button variant="secondary" asChild><Link href="/#brands"><Tags className="w-4 h-4 mr-1" /> Brands</Link></Button>
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-primary/5">
            <TabsTrigger value="categories" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Categories</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Products</TabsTrigger>
            <TabsTrigger value="slides" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Slides</TabsTrigger>
            <TabsTrigger value="brands" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Brands</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="categories"><CategoriesTab /></TabsContent>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="slides"><SlidesTab /></TabsContent>
          <TabsContent value="brands"><BrandsTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  )
}
