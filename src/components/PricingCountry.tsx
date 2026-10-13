import { usePricing } from '@/lib/pricing'

const countries = { US: 'United States / USD', NG: 'Nigeria', GH: 'Ghana', KE: 'Kenya', ZA: 'South Africa', UG: 'Uganda', TZ: 'Tanzania', RW: 'Rwanda', GB: 'United Kingdom', CA: 'Canada', ZM: 'Zambia', EG: 'Egypt', CM: 'Cameroon', SN: 'Senegal', CI: 'Côte d’Ivoire', FR: 'France', DE: 'Germany', IE: 'Ireland', ES: 'Spain', IT: 'Italy', NL: 'Netherlands', BE: 'Belgium', PT: 'Portugal', AT: 'Austria', FI: 'Finland', GR: 'Greece', ZZ: 'Other country / USD' }
export function PricingCountry() {
  const { country, setCountry, data, isError, refetch } = usePricing()
  return <div className="my-4 space-y-2 text-sm text-slate-600">
    <label className="flex items-center justify-center gap-3">Billing country
      <select aria-label="Billing country" className="rounded-lg border bg-white px-3 py-2" value={country || (data?.country && data.country in countries ? data.country : '')} onChange={event => setCountry(event.target.value)}>
        <option value="">Auto-detect</option>
        {Object.entries(countries).map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>
    </label>
    {isError ? <p>Prices could not be loaded. <button type="button" className="underline" onClick={() => refetch()}>Retry</button> or select United States / USD.</p> : <p>Payment is charged in {data?.currency || 'the selected currency'}. Quotes are valid for 15 minutes.</p>}
    {data?.rateUpdatedAt && <p className="text-xs">Rates updated {new Date(data.rateUpdatedAt).toLocaleDateString()}. <a className="underline" href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">Rates by ExchangeRate-API</a></p>}
  </div>
}
