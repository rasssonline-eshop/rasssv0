"use client"

import { useState } from "react"
import { useAdmin } from "@/components/AdminProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CategoriesPage() {
    const { store, addCategory, updateCategory, removeCategory } = useAdmin()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        image: "",
        comingSoon: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (editingCategory) {
            updateCategory(editingCategory, formData)
        } else {
            addCategory(formData)
        }

        setFormData({ name: "", image: "", comingSoon: false })
        setEditingCategory(null)
        setIsDialogOpen(false)
    }

    const handleEdit = (category: any) => {
        setEditingCategory(category.name)
        setFormData({
            name: category.name,
            image: category.image || "",
            comingSoon: category.comingSoon || false,
        })
        setIsDialogOpen(true)
    }

    const handleDelete = (name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"? This will also remove all products in this category.`)) {
            removeCategory(name)
        }
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setEditingCategory(null)
        setFormData({ name: "", image: "", comingSoon: false })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-1">Manage your product categories</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Category Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    placeholder="e.g., Skincare"
                                    disabled={!!editingCategory}
                                />
                            </div>
                            <div>
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="comingSoon"
                                    checked={formData.comingSoon}
                                    onChange={(e) => setFormData(prev => ({ ...prev, comingSoon: e.target.checked }))}
                                    className="w-4 h-4"
                                />
                                <Label htmlFor="comingSoon" className="cursor-pointer">Mark as Coming Soon</Label>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1">
                                    {editingCategory ? 'Update' : 'Create'} Category
                                </Button>
                                <Button type="button" variant="outline" onClick={handleDialogClose}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.categories.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="py-12 text-center">
                            <FolderTree className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500 mb-4">No categories yet</p>
                            <Button onClick={() => setIsDialogOpen(true)}>Add Your First Category</Button>
                        </CardContent>
                    </Card>
                ) : (
                    store.categories.map((category) => {
                        const productCount = store.productsByCategory[category.name]?.length || 0

                        return (
                            <Card key={category.name} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{category.name}</CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {productCount} product{productCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        {category.comingSoon && (
                                            <Badge variant="secondary">Coming Soon</Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {category.image && (
                                        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 h-32">
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleEdit(category)}
                                        >
                                            <Pencil className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(category.name)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
