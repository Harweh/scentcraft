/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const [items, setItems] = useState([])
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('aura-luxe-cart')
        if (saved) setItems(JSON.parse(saved))
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (hydrated) localStorage.setItem('aura-luxe-cart', JSON.stringify(items))
    }, [items, hydrated])

    function addItem(item) {
        setItems(prev => {
        const existing = prev.find(i => i.fragranceId === item.fragranceId && i.volume === item.volume)
        if (existing) {
            return prev.map(i => i === existing ? { ...i, qty: i.qty + item.qty } : i)
        }
        return [...prev, item]
        })
    }

    function removeItem(index) {
        setItems(prev => prev.filter((_, i) => i !== index))
    }

    function updateQty(index, qty) {
        setItems(prev => prev.map((item, i) => i === index ? { ...item, qty: Math.max(1, qty) } : item))
    }

    function clearCart() {
        setItems([])
    }

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart }}>
        {children}
        </CartContext.Provider>
    )
    }

    export function useCart() {
    return useContext(CartContext)
}