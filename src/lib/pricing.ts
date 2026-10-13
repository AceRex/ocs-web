import { useQuery } from '@tanstack/react-query'
import { api } from './api'

export function usePricing() {
  const query = useQuery({ queryKey: ['pricing'], queryFn: api.getPricing })
  const price = (tier: string, cycle = 'semi-annual') => {
    const amount = query.data?.plans[tier]?.[cycle]
    if (amount === undefined || !query.data?.currency) return 'Contact support'
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: query.data.currency }).format(amount)
  }
  return { ...query, price }
}
