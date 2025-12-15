"use client"

import { useAdmin } from '@/components/AdminProvider'
import type { AdminProduct } from '@/components/AdminProvider'
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
import { Plus, Eye, Trash, ClipboardCopy, RefreshCw, Home, Grid2X2, Image as ImageIcon, Tags, Settings, TrendingUp, TrendingDown, User, ClipboardList, Building2, FileText } from 'lucide-react'

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
        {(Object.entries(store.productsByCategory) as [string, AdminProduct[]][]).map(([cat, list]) => (
          <Card key={cat} className="p-4">
            <div className="font-semibold mb-2">{cat}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {list.map((p: AdminProduct) => (
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
          <Button variant="outline" onClick={() => { const ok = confirm('Reset all admin data?'); if (!ok) return; setStore({ categories: [], productsByCategory: {}, slides: [], brands: [], inventory: [], orders: [], ledger: [], accountant: undefined, suppliers: [], purchaseOrders: [], invoices: [] }); toast.success('Reset complete') }}>Reset</Button>
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
            <TabsTrigger value="inventory" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Inventory</TabsTrigger>
            <TabsTrigger value="suppliers" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Suppliers</TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Purchases</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Orders</TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Invoices</TabsTrigger>
            <TabsTrigger value="accounting" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Accounting</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="categories"><CategoriesTab /></TabsContent>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="slides"><SlidesTab /></TabsContent>
          <TabsContent value="brands"><BrandsTab /></TabsContent>
          <TabsContent value="inventory"><InventoryTab /></TabsContent>
          <TabsContent value="suppliers"><SuppliersTab /></TabsContent>
          <TabsContent value="purchases"><PurchasesTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="invoices"><InvoicesTab /></TabsContent>
          <TabsContent value="accounting"><AccountingTab /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </AdminGate>
  )
}

function InventoryTab() {
  const { store, addMovement, removeMovement } = useAdmin()
  const [productId, setProductId] = useState('')
  const [type, setType] = useState<'in'|'out'>('in')
  const [qty, setQty] = useState('')
  const [unit, setUnit] = useState('pcs')
  const [note, setNote] = useState('')
  const productOpts = (Object.entries(store.productsByCategory) as [string, AdminProduct[]][]) .flatMap(([cat, list]) => list.map((p: AdminProduct) => ({ id: p.id, name: p.name })))
  const incoming = store.inventory.filter(i => i.type==='in').reduce((a,b)=>a+b.qty,0)
  const outgoing = store.inventory.filter(i => i.type==='out').reduce((a,b)=>a+b.qty,0)
  return (
    <div className="space-y-4">
      <Card className="p-4 grid grid-cols-1 md:grid-cols-5 gap-2">
        <Select value={productId} onValueChange={setProductId}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select product" /></SelectTrigger>
          <SelectContent>
            {productOpts.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={v=>setType(v as any)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="in">Incoming</SelectItem>
            <SelectItem value="out">Outgoing</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Qty" value={qty} onChange={e=>setQty(e.target.value)} />
        <Input placeholder="Unit" value={unit} onChange={e=>setUnit(e.target.value)} />
        <Input placeholder="Note" value={note} onChange={e=>setNote(e.target.value)} />
        <Button onClick={() => { if (!productId || !qty) return; const prod = productOpts.find(p=>p.id===productId)!; addMovement({ id: `${Date.now()}`, productId, productName: prod.name, type, qty: Number(qty), unit, note, date: new Date().toISOString() }); toast.success('Movement recorded'); setProductId(''); setQty(''); setNote('') }}>Add</Button>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4"><div className="text-xs">Incoming</div><div className="text-2xl font-bold flex items-center gap-2 text-green-600"><TrendingDown className="w-5 h-5" /> {incoming}</div></Card>
        <Card className="p-4"><div className="text-xs">Outgoing</div><div className="text-2xl font-bold flex items-center gap-2 text-red-600"><TrendingUp className="w-5 h-5" /> {outgoing}</div></Card>
      </div>
      <div className="space-y-2">
        {store.inventory.slice().reverse().map(m => (
          <Card key={m.id} className="p-3 flex items-center gap-2">
            <div className="flex-1">
              <div className="font-semibold text-sm">{m.productName}</div>
              <div className="text-xs text-gray-600">{m.type.toUpperCase()} · {m.qty} {m.unit} · {new Date(m.date).toLocaleString()}</div>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${m.type==='in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.type}</div>
            <Button variant="outline" onClick={() => { removeMovement(m.id); toast.success('Removed') }}>
              <Trash className="w-4 h-4 mr-1" /> Remove
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function OrdersTab() {
  const { store, upsertOrder, removeOrder } = useAdmin()
  const [items, setItems] = useState<{ productId: string, qty: number }[]>([])
  const [note, setNote] = useState('')
  const productOpts = (Object.entries(store.productsByCategory) as [string, AdminProduct[]][]) .flatMap(([cat, list]) => list.map((p: AdminProduct) => ({ id: p.id, name: p.name, price: p.price })))
  const addItem = () => { const p = productOpts[0]; if (!p) return; setItems([...items, { productId: p.id, qty: 1 }]) }
  const total = items.reduce((a, it) => { const p = productOpts.find(x=>x.id===it.productId); return a + (p ? p.price * it.qty : 0) }, 0)
  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-2">
        <div className="flex flex-col gap-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Select value={it.productId} onValueChange={v => { const next = items.slice(); next[idx] = { ...next[idx], productId: v }; setItems(next) }}>
                <SelectTrigger className="w-64"><SelectValue placeholder="Product" /></SelectTrigger>
                <SelectContent>
                  {productOpts.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                </SelectContent>
              </Select>
              <Input type="number" className="w-24" value={String(it.qty)} onChange={e => { const next = items.slice(); next[idx] = { ...next[idx], qty: Number(e.target.value||'0') }; setItems(next) }} />
              <Button variant="outline" onClick={() => { const next = items.slice(); next.splice(idx,1); setItems(next) }}>Remove</Button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => addItem()}><ClipboardList className="w-4 h-4 mr-1" /> Add Item</Button>
          <Input placeholder="Note" value={note} onChange={e=>setNote(e.target.value)} />
          <div className="ml-auto font-bold">Total: {total}</div>
          <Button onClick={() => { const id = `o-${Date.now()}`; const itemsFull = items.map(it => { const p = productOpts.find(x=>x.id===it.productId)!; return { productId: p.id, name: p.name, qty: it.qty, price: p.price } }); upsertOrder({ id, status: 'pending', items: itemsFull, total, placedAt: new Date().toISOString(), note }); toast.success('Order created'); setItems([]); setNote('') }}>Create Order</Button>
        </div>
      </Card>
      <div className="space-y-2">
        {store.orders.slice().reverse().map(o => (
          <Card key={o.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Order {o.id}</div>
              <div className="text-sm">{new Date(o.placedAt).toLocaleString()}</div>
            </div>
            <div className="text-sm text-gray-600">Status: {o.status} · Items: {o.items.length} · Total: {o.total}</div>
            <div className="mt-2 flex items-center gap-2">
              <Select value={o.status} onValueChange={v => { upsertOrder({ ...o, status: v as any }); toast.success('Status updated') }}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => { removeOrder(o.id); toast.success('Order removed') }}>Remove</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function SuppliersTab() {
  const { store, upsertSupplier, removeSupplier } = useAdmin() as any
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  return (
    <div className="space-y-4">
      <Card className="p-4 flex items-center gap-2">
        <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <Input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <Button onClick={() => { if (!name) return; const id = `sup-${Date.now()}`; upsertSupplier({ id, name, email, phone }); toast.success('Supplier added'); setName(''); setEmail(''); setPhone('') }}>
          <Building2 className="w-4 h-4 mr-1" /> Add Supplier
        </Button>
      </Card>
      <div className="space-y-2">
        {store.suppliers?.map((s: any) => (
          <Card key={s.id} className="p-3 flex items-center gap-2">
            <div className="flex-1 text-sm">{s.name} · {s.email} · {s.phone}</div>
            <Button variant="outline" onClick={() => { removeSupplier(s.id); toast.success('Removed') }}>Remove</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PurchasesTab() {
  const { store, upsertPurchaseOrder, removePurchaseOrder } = useAdmin() as any
  const supplierOpts = store.suppliers || []
  const productOpts = (Object.entries(store.productsByCategory) as [string, AdminProduct[]][]) .flatMap(([cat, list]) => list.map((p: AdminProduct) => ({ id: p.id, name: p.name, price: p.price })))
  const [supplierId, setSupplierId] = useState('')
  const [items, setItems] = useState<{ productId: string, qty: number, unitCost: number }[]>([])
  const total = items.reduce((a, it) => a + (it.qty * it.unitCost), 0)
  return (
    <div className="space-y-4">
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Supplier" /></SelectTrigger>
            <SelectContent>
              {supplierOpts.map((s:any)=> (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Button onClick={() => { const p = productOpts[0]; if (!p) return; setItems([...items, { productId: p.id, qty: 1, unitCost: p.price }]) }}>
            <ClipboardList className="w-4 h-4 mr-1" /> Add Line
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Select value={it.productId} onValueChange={v => { const next = items.slice(); next[idx] = { ...next[idx], productId: v }; setItems(next) }}>
                <SelectTrigger className="w-64"><SelectValue placeholder="Product" /></SelectTrigger>
                <SelectContent>
                  {productOpts.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                </SelectContent>
              </Select>
              <Input type="number" className="w-24" value={String(it.qty)} onChange={e => { const next = items.slice(); next[idx] = { ...next[idx], qty: Number(e.target.value||'0') }; setItems(next) }} />
              <Input type="number" className="w-32" value={String(it.unitCost)} onChange={e => { const next = items.slice(); next[idx] = { ...next[idx], unitCost: Number(e.target.value||'0') }; setItems(next) }} />
              <Button variant="outline" onClick={() => { const next = items.slice(); next.splice(idx,1); setItems(next) }}>Remove</Button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="ml-auto font-bold">Total: {total}</div>
          <Button onClick={() => { if (!supplierId || items.length===0) return; const id = `po-${Date.now()}`; const poItems = items.map(it => ({ productId: it.productId, name: productOpts.find(x=>x.id===it.productId)?.name || '', qty: it.qty, unitCost: it.unitCost })); upsertPurchaseOrder({ id, supplierId, items: poItems, total, status: 'ordered', createdAt: new Date().toISOString() }); toast.success('Purchase order created'); setSupplierId(''); setItems([]) }}>Create PO</Button>
        </div>
      </Card>
      <div className="space-y-2">
        {store.purchaseOrders?.slice().reverse().map((po:any) => (
          <Card key={po.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">PO {po.id}</div>
              <div className="text-sm">{new Date(po.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-sm text-gray-600">Supplier: {supplierOpts.find((s:any)=>s.id===po.supplierId)?.name || po.supplierId} · Items: {po.items.length} · Total: {po.total} · Status: {po.status}</div>
            <div className="mt-2 flex items-center gap-2">
              <Select value={po.status} onValueChange={v => { upsertPurchaseOrder({ ...po, status: v as any }); toast.success('Status updated') }}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => { removePurchaseOrder(po.id); toast.success('Removed') }}>Remove</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function InvoicesTab() {
  const { store, upsertInvoice, removeInvoice } = useAdmin() as any
  const orderOpts = store.orders || []
  const [orderId, setOrderId] = useState('')
  const [amount, setAmount] = useState('')
  return (
    <div className="space-y-4">
      <Card className="p-4 flex items-center gap-2">
        <Select value={orderId} onValueChange={setOrderId}>
          <SelectTrigger className="w-64"><SelectValue placeholder="Order" /></SelectTrigger>
          <SelectContent>
            {orderOpts.map((o:any)=> (<SelectItem key={o.id} value={o.id}>{o.id} · {o.total}</SelectItem>))}
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <Button onClick={() => { if (!orderId || !amount) return; const id = `inv-${Date.now()}`; upsertInvoice({ id, orderId, amount: Number(amount), status: 'unpaid', issuedAt: new Date().toISOString() }); toast.success('Invoice created'); setOrderId(''); setAmount('') }}>
          <FileText className="w-4 h-4 mr-1" /> Create Invoice
        </Button>
      </Card>
      <div className="space-y-2">
        {store.invoices?.slice().reverse().map((inv:any) => (
          <Card key={inv.id} className="p-3 flex items-center gap-2">
            <div className="flex-1 text-sm">{inv.id} · Order {inv.orderId} · {inv.amount} · {inv.status}</div>
            <Select value={inv.status} onValueChange={v => { upsertInvoice({ ...inv, status: v as any }); toast.success('Status updated') }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { removeInvoice(inv.id); toast.success('Removed') }}>Remove</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AccountingTab() {
  const { store, addLedger, removeLedger, setAccountant } = useAdmin()
  const [name, setName] = useState(store.accountant?.name || '')
  const [email, setEmail] = useState(store.accountant?.email || '')
  const [phone, setPhone] = useState(store.accountant?.phone || '')
  const [notes, setNotes] = useState(store.accountant?.notes || '')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income'|'expense'>('income')
  const income = store.ledger.filter(l=>l.type==='income').reduce((a,b)=>a+b.amount,0)
  const expense = store.ledger.filter(l=>l.type==='expense').reduce((a,b)=>a+b.amount,0)
  const net = income - expense
  return (
    <div className="space-y-4">
      <Card className="p-4 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
          <Input placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
          <Button onClick={() => { setAccountant({ name, email, phone, notes, lastAuditDate: new Date().toISOString().slice(0,10) }); toast.success('Accountant updated') }}>Save</Button>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4"><div className="text-xs">Income</div><div className="text-2xl font-bold text-green-600">{income}</div></Card>
        <Card className="p-4"><div className="text-xs">Expense</div><div className="text-2xl font-bold text-red-600">{expense}</div></Card>
        <Card className="p-4"><div className="text-xs">Net</div><div className="text-2xl font-bold">{net}</div></Card>
      </div>
      <Card className="p-4 grid grid-cols-1 md:grid-cols-4 gap-2">
        <Select value={type} onValueChange={v=>setType(v as any)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <Input placeholder="Note" />
        <Button onClick={() => { if (!amount) return; addLedger({ id: `${Date.now()}`, type, amount: Number(amount), date: new Date().toISOString() }); toast.success('Ledger added'); setAmount('') }}>Add</Button>
      </Card>
      <div className="space-y-2">
        {store.ledger.slice().reverse().map(l => (
          <Card key={l.id} className="p-3 flex items-center gap-2">
            <div className="flex-1 text-sm">{new Date(l.date).toLocaleString()} · {l.type} · {l.amount}</div>
            <Button variant="outline" onClick={() => { removeLedger(l.id); toast.success('Removed') }}>Remove</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
