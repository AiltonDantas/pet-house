import { useState, useEffect, useCallback } from 'react'

export function useCrud(service) {
  const [items,       setItems]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen,   setModalOpen]   = useState(false)
  const [editItem,    setEditItem]    = useState(null)
  const [deleteItem,  setDeleteItem]  = useState(null)
  const pageSize = 8

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await service.getAll()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [service])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditItem(null); setModalOpen(true) }
  const openEdit   = (item) => { setEditItem(item); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditItem(null) }

  const handleDelete = async () => {
    if (service.delete) await service.delete(deleteItem.id)
    setDeleteItem(null)
    load()
  }

  const filtered = items.filter(item =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated  = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return {
    items, loading, search, setSearch,
    currentPage, setCurrentPage,
    modalOpen, editItem, deleteItem, setDeleteItem,
    openCreate, openEdit, closeModal, handleDelete, load,
    filtered, paginated, totalPages, pageSize,
  }
}
