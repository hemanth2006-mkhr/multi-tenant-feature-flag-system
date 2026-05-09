import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [orgs, setOrgs] = useState([])
  const [selectedOrg, setSelectedOrg] = useState('')
  const [featureKey, setFeatureKey] = useState('')
  const [allFlags, setAllFlags] = useState([])        // all flags for selected org
  const [suggestions, setSuggestions] = useState([])  // filtered dropdown list
  const [showDropdown, setShowDropdown] = useState(false)
  const [flagsLoading, setFlagsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [orgsLoading, setOrgsLoading] = useState(true)

  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // ── Fetch organizations on mount ──
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/flags/org-list")
        setOrgs(res.data)
      } catch (err) {
        setError('Failed to load organizations')
      } finally {
        setOrgsLoading(false)
      }
    }
    fetchOrgs()
  }, [])

  // ── Close dropdown when clicking outside ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── When org changes → fetch all its flags for autocomplete ──
  const handleOrgChange = async (e) => {
    const orgId = e.target.value
    setSelectedOrg(orgId)
    setFeatureKey('')
    setAllFlags([])
    setSuggestions([])
    setShowDropdown(false)
    setResult(null)
    setError('')

    if (!orgId) return

    try {
      setFlagsLoading(true)
      const res = await axios.get(`http://localhost:3000/api/user/list/${orgId}`)
      setAllFlags(res.data || [])
    } catch {
      setAllFlags([])
    } finally {
      setFlagsLoading(false)
    }
  }

  // ── While typing → filter suggestions ──
  const handleKeyChange = (e) => {
    const value = e.target.value
    setFeatureKey(value)
    setResult(null)
    setError('')

    if (!value.trim()) {
      // empty input → show all flags
      setSuggestions(allFlags)
      setShowDropdown(allFlags.length > 0)
      return
    }

    const filtered = allFlags.filter((flag) =>
      flag.featureKey.toLowerCase().includes(value.toLowerCase())
    )
    setSuggestions(filtered)
    setShowDropdown(true)
  }

  // ── Input focused → show all flags ──
  const handleInputFocus = () => {
    if (!selectedOrg || allFlags.length === 0) return
    setSuggestions(featureKey.trim() ? suggestions : allFlags)
    setShowDropdown(true)
  }

  // ── Click a suggestion → fill input + instant result ──
  const handleSelectSuggestion = (flag) => {
    setFeatureKey(flag.featureKey)
    setShowDropdown(false)
    setError('')
    // Show result immediately without needing to press submit
    setResult({
      featureKey: flag.featureKey,
      enabled: flag.enabled
    })
  }

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedOrg) return setError('Please select an organization')
    if (!featureKey.trim()) return setError('Please enter a feature key')

    setLoading(true)
    setError('')
    setResult(null)
    setShowDropdown(false)

    try {
      const res = await axios.post(`http://localhost:3000/api/user/check`, {
        orgId: selectedOrg,
        featureKey: featureKey.trim().toLowerCase()
      })
      setResult(res.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setError(`Feature "${featureKey}" not found for this organization`)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Highlight matched text in dropdown ──
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text
    const index = text.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return text
    return (
      <>
        {text.slice(0, index)}
        <span className="bg-yellow-100 text-slate-800 font-bold">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </>
    )
  }

  const selectedOrgName = orgs.find((o) => o._id === selectedOrg)?.name

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10 font-sans">

      {/* ── Header ── */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🚀</div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Feature Flag Checker
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          Check whether a feature is enabled for your organization
        </p>
      </div>

      {/* ── Main Card ── */}
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Step 1 — Organization */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-600">
              Step 1 — Select Organization
            </label>
            {orgsLoading ? (
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
              <select
                value={selectedOrg}
                onChange={handleOrgChange}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-slate-700
                           text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400
                           cursor-pointer transition"
              >
                <option value="">-- Select Organization --</option>
                {orgs.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Step 2 — Feature Key with Autocomplete */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              Step 2 — Enter Feature Key

              {/* Loading badge */}
              {flagsLoading && (
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  Loading flags...
                </span>
              )}

              {/* Count badge */}
              {!flagsLoading && allFlags.length > 0 && (
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                  {allFlags.length} flags available
                </span>
              )}
            </label>

            {/* Autocomplete wrapper — position relative is the key */}
            <div className="relative">

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={featureKey}
                onChange={handleKeyChange}
                onFocus={handleInputFocus}
                placeholder={
                  selectedOrg
                    ? 'Type or click to browse flags...'
                    : 'Select an organization first'
                }
                disabled={!selectedOrg}
                autoComplete="off"
                className={`w-full px-3 py-2.5 border border-slate-200 text-slate-700 text-sm
                            focus:outline-none focus:ring-2 focus:ring-slate-400 transition
                            disabled:bg-slate-50 disabled:cursor-not-allowed
                            ${showDropdown
                              ? 'rounded-t-lg rounded-b-none border-b-0'
                              : 'rounded-lg'
                            }`}
              />

              {/* Dropdown List */}
              {showDropdown && (
                <ul
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 bg-white border border-slate-200
                             border-t-0 rounded-b-lg shadow-lg z-50 max-h-48 overflow-y-auto"
                >
                  {suggestions.length > 0 ? (
                    suggestions.map((flag, index) => (
                      <li
                        key={index}
                        // onMouseDown not onClick — prevents input blur before selection
                        onMouseDown={() => handleSelectSuggestion(flag)}
                        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer
                                   hover:bg-slate-50 transition-colors border-b
                                   border-slate-100 last:border-b-0"
                      >
                        {/* Status dot */}
                        <span className={`w-2 h-2 rounded-full flex-shrink-0
                                          ${flag.enabled ? 'bg-green-400' : 'bg-red-400'}`}
                        />

                        {/* Feature key with highlight */}
                        <span className="flex-1 text-sm text-slate-700">
                          {highlightMatch(flag.featureKey, featureKey)}
                        </span>

                        {/* ON / OFF badge */}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                                          ${flag.enabled
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-red-50 text-red-600'
                                          }`}>
                          {flag.enabled ? '✅ ON' : '❌ OFF'}
                        </span>
                      </li>
                    ))
                  ) : (
                    // No match
                    <li className="px-3 py-3 text-sm text-slate-400 text-center">
                      No flags matching "{featureKey}"
                    </li>
                  )}
                </ul>
              )}
            </div>

            <span className="text-xs text-slate-400">
              💡 Click the input to see all available flags
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-60
                       disabled:cursor-not-allowed text-white font-semibold rounded-lg
                       text-sm transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Checking...
              </>
            ) : (
              '🔍 Check Feature'
            )}
          </button>

        </form>

        {/* ── Error Box ── */}
        {error && (
          <div className="mt-4 flex items-start gap-2 px-4 py-3 bg-red-50 border
                          border-red-200 rounded-lg text-red-600 text-sm">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* ── Result Box ── */}
        {result && (
          <div className={`mt-6 rounded-xl border-2 p-6 text-center flex flex-col
                           items-center gap-3 transition-all duration-300
                           ${result.enabled
                             ? 'bg-green-50 border-green-300'
                             : 'bg-red-50 border-red-300'
                           }`}>

            {/* Big Icon */}
            <span className="text-5xl">
              {result.enabled ? '✅' : '❌'}
            </span>

            {/* Feature Key Badge */}
            <span className="px-4 py-1 bg-white border border-slate-200 rounded-full
                             text-slate-700 font-bold text-base shadow-sm">
              {result.featureKey}
            </span>

            {/* Status Text */}
            <p className={`text-lg font-bold
                           ${result.enabled ? 'text-green-700' : 'text-red-700'}`}>
              {result.enabled
                ? 'This feature is ENABLED'
                : 'This feature is DISABLED'}
            </p>

            {/* Org Name */}
            <p className="text-slate-500 text-sm">
              for <span className="font-semibold text-slate-700">
                {selectedOrgName || 'org'}
              </span>
            </p>

            {/* Visual Checkbox Row */}
            <div className={`flex items-center gap-2 mt-1 px-4 py-2 rounded-lg text-sm
                             ${result.enabled
                               ? 'bg-green-100 text-green-800'
                               : 'bg-red-100 text-red-800'
                             }`}>
              <input
                type="checkbox"
                checked={result.enabled}
                readOnly
                className="w-4 h-4 accent-green-600 cursor-default"
              />
              <span className="font-medium">
                {result.enabled ? 'Feature is active' : 'Feature is inactive'}
              </span>
            </div>

          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <p className="mt-6 text-xs text-slate-400 text-center">
        Contact your organization admin to enable or disable features
      </p>

    </div>
  )
}

export default App