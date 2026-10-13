import { useSyncExternalStore } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from './api'

let country = sessionStorage.getItem('billing-country') || ''
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener) } }
export function usePricing() {
  const selectedCountry = useSyncExternalStore(subscribe, () => country)
  const query = useQuery({ queryKey: ['pricing', selectedCountry], queryFn: () => api.getPricing(selectedCountry), staleTime: 5 * 60000, refetchInterval: 5 * 60000 })
  const setCountry = (value: string) => { country = value; sessionStorage.setItem('billing-country', value); listeners.forEach(listener => listener()) }
  const price = (tier: string, cycle = 'semi-annual') => {
    if (query.isPending) return 'Loading…'
    if (query.isError) return 'Price unavailable'
    const amount = query.data?.plans[tier]?.[cycle]
    if (amount === undefined || !query.data?.currency) return 'Contact support'
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: query.data.currency }).format(amount)
  }
  return { ...query, price, country: selectedCountry, setCountry }
}
