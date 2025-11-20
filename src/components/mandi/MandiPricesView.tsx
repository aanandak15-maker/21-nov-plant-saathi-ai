import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, MapPin, Calendar, IndianRupee, RefreshCw, ArrowLeft, TrendingDown, Sparkles, Filter, X, Navigation, Clock, Fuel, BarChart3, Phone, Share2, Star, Bell, Zap } from 'lucide-react';
import { mandiPriceService, MandiPrice } from '../../lib/mandiPriceService';
import { MandiPriceCharts } from './MandiPriceCharts';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import '../../styles/mandi-animations.css';

export const MandiPricesView: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [allPrices, setAllPrices] = useState<MandiPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedVariety, setSelectedVariety] = useState('');
  const [commodities, setCommodities] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [varieties, setVarieties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceStats, setPriceStats] = useState({ highest: 0, lowest: 0, average: 0 });
  const [sortByDistance, setSortByDistance] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [fuelCostPerKm] = useState(8); // ₹8 per km average
  const [showCharts, setShowCharts] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'all' | 'nearby' | 'best' | 'new'>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compare'>('grid');

  useEffect(() => {
    loadInitialData();
    getUserLocation();
    
    const handleUpdate = (event: any) => {
      setLastUpdateTime(event.detail.timestamp);
      loadInitialData();
    };
    
    window.addEventListener('mandiPricesUpdated', handleUpdate);
    return () => window.removeEventListener('mandiPricesUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allPrices, selectedCommodity, selectedState, selectedVariety, searchTerm, priceRange, sortByDistance, userLocation, quickFilter]);

  useEffect(() => {
    // Load favorites from localStorage
    const saved = localStorage.getItem('mandi_favorites');
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    if (filteredPrices.length > 0) {
      // Filter valid prices (positive, finite numbers)
      const modalPrices = filteredPrices
        .map(p => p.modal_price)
        .filter(p => p > 0 && isFinite(p) && !isNaN(p));
      
      if (modalPrices.length > 0) {
        const sum = modalPrices.reduce((a, b) => a + b, 0);
        const avg = sum / modalPrices.length;
        
        setPriceStats({
          highest: Math.max(...modalPrices),
          lowest: Math.min(...modalPrices),
          average: Math.round(avg)
        });
      } else {
        // Fallback to safe defaults
        setPriceStats({ highest: 0, lowest: 0, average: 0 });
      }
    } else {
      setPriceStats({ highest: 0, lowest: 0, average: 0 });
    }
  }, [filteredPrices]);

  useEffect(() => {
    // Update varieties when commodity changes
    if (selectedCommodity && allPrices.length > 0) {
      const commodityPrices = allPrices.filter(p => p.commodity === selectedCommodity);
      const uniqueVarieties = [...new Set(commodityPrices.map(p => p.variety))].filter(Boolean);
      setVarieties(uniqueVarieties);
    } else {
      setVarieties([]);
      setSelectedVariety('');
    }
  }, [selectedCommodity, allPrices]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [statesList, commoditiesList, todayPrices] = await Promise.all([
        mandiPriceService.getAvailableStates(),
        mandiPriceService.getAvailableCommodities(),
        mandiPriceService.getTodaysPrices(),
      ]);
      
      setStates(statesList);
      setCommodities(commoditiesList);
      
      // Add crop images
      let enrichedPrices = mandiPriceService.addCropImages(todayPrices);
      
      // Sort by location if enabled
      if (sortByDistance && userLocation) {
        enrichedPrices = await mandiPriceService.sortByLocation(enrichedPrices, userLocation.lat, userLocation.lon);
      }
      
      setAllPrices(enrichedPrices);
      setLastUpdateTime(mandiPriceService.getLastUpdateTime());
    } catch (error) {
      console.error('Error loading mandi data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          maximumAge: 300000
        });
      });
      setUserLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      });
    } catch (error) {
      console.log('Location access denied or unavailable');
    }
  };

  const applyFilters = async () => {
    let filtered = [...allPrices];

    // Apply quick filters first
    if (quickFilter === 'nearby' && userLocation) {
      filtered = await mandiPriceService.sortByLocation(filtered, userLocation.lat, userLocation.lon);
      filtered = filtered.filter(p => p.distance !== undefined && p.distance < 50);
    } else if (quickFilter === 'best') {
      filtered = filtered.filter(p => p.modal_price >= priceStats.highest * 0.9);
    } else if (quickFilter === 'new') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(p => p.arrival_date === today);
    }

    // Apply state filter
    if (selectedState) {
      filtered = filtered.filter(p => p.state === selectedState);
    }

    // Apply commodity filter
    if (selectedCommodity) {
      filtered = filtered.filter(p => p.commodity === selectedCommodity);
    }

    // Apply variety filter
    if (selectedVariety) {
      filtered = filtered.filter(p => p.variety === selectedVariety);
    }

    // Apply price range filter
    filtered = filtered.filter(p => 
      p.modal_price >= priceRange.min && p.modal_price <= priceRange.max
    );

    // Apply search filter (comprehensive)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.commodity?.toLowerCase().includes(search) ||
        p.variety?.toLowerCase().includes(search) ||
        p.market?.toLowerCase().includes(search) ||
        p.district?.toLowerCase().includes(search) ||
        p.state?.toLowerCase().includes(search)
      );
    }

    // Sort by distance if enabled (and not already sorted by quick filter)
    if (sortByDistance && userLocation && quickFilter !== 'nearby') {
      filtered = await mandiPriceService.sortByLocation(filtered, userLocation.lat, userLocation.lon);
    }

    setFilteredPrices(filtered);
  };

  const toggleFavorite = (priceId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(priceId)) {
      newFavorites.delete(priceId);
    } else {
      newFavorites.add(priceId);
    }
    setFavorites(newFavorites);
    // Save to localStorage
    localStorage.setItem('mandi_favorites', JSON.stringify(Array.from(newFavorites)));
  };

  const callMandi = (market: string) => {
    // In production, this would have actual mandi phone numbers
    alert(`Calling ${market}...\n\nPhone numbers will be available soon!`);
  };

  const getDirections = (market: string, district: string, state: string) => {
    const query = encodeURIComponent(`${market}, ${district}, ${state}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const sharePrice = (price: MandiPrice) => {
    const text = `${price.commodity} (${price.variety}) - ₹${price.modal_price}/${price.unit}\n${price.market}, ${price.district}\nDate: ${new Date(price.arrival_date).toLocaleDateString('en-IN')}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mandi Price',
        text: text,
      }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Price copied to clipboard!');
    }
  };

  const handleRefresh = async () => {
    mandiPriceService.clearCache();
    await loadInitialData();
  };

  const clearFilters = () => {
    setSelectedCommodity('');
    setSelectedState('');
    setSelectedVariety('');
    setSearchTerm('');
    setPriceRange({ min: 0, max: 100000 });
  };

  const hasActiveFilters = selectedState || selectedCommodity || selectedVariety || searchTerm || priceRange.min > 0 || priceRange.max < 100000;

  const getPriceColor = (price: number) => {
    if (price >= priceStats.highest * 0.9) return 'text-green-600';
    if (price <= priceStats.lowest * 1.1) return 'text-red-600';
    return 'text-blue-600';
  };

  const getPriceTrend = (price: number) => {
    if (price >= priceStats.highest * 0.9) return { icon: TrendingUp, text: '↑ High', color: 'text-green-600' };
    if (price <= priceStats.lowest * 1.1) return { icon: TrendingDown, text: '↓ Low', color: 'text-red-600' };
    return { icon: IndianRupee, text: '→ Avg', color: 'text-blue-600' };
  };

  const calculateTransportCost = (distance?: number) => {
    if (!distance || distance >= 9999) return null;
    return Math.round(distance * fuelCostPerKm * 2); // Round trip
  };

  const calculateNetProfit = (price: number, transportCost: number | null, unit: string) => {
    if (!transportCost) return null;
    
    // Assume 1 quintal (100kg) for calculation
    const quantityInQuintals = unit.toLowerCase().includes('quintal') ? 1 : 
                               unit.toLowerCase().includes('kg') ? 0.01 : 1;
    
    const grossRevenue = price * quantityInQuintals;
    const netProfit = grossRevenue - transportCost;
    const profitPercentage = ((netProfit / grossRevenue) * 100).toFixed(1);
    
    return {
      netProfit: Math.round(netProfit),
      profitPercentage: parseFloat(profitPercentage)
    };
  };

  const getProfitIndicator = (profitPercentage: number) => {
    if (profitPercentage >= 90) return { text: '🔥 Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (profitPercentage >= 80) return { text: '✅ Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (profitPercentage >= 70) return { text: '⚠️ Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: '❌ Low', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-20">
      {/* Sticky Header - IMPROVED */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-green-100">
        <div className="p-4">
          {/* Top Bar */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-green-50 rounded-lg transition-all active:scale-95"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">
                {t('mandiPrices') || 'Mandi Prices'}
              </h1>
              <p className="text-xs text-gray-600">
                {filteredPrices.length} markets • Updated {lastUpdateTime ? new Date(lastUpdateTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'now'}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-green-50 rounded-lg transition-all active:scale-95"
            >
              <RefreshCw className={`w-5 h-5 text-gray-700 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-all active:scale-95 ${hasActiveFilters ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'}`}
            >
              <Filter className={`w-5 h-5 ${showFilters ? 'rotate-180' : ''} transition-transform`} />
            </button>
          </div>

          {/* Search Bar - Always Visible */}
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crops, markets, districts..."
                className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters - Always Visible */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setQuickFilter('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                quickFilter === 'all'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">All</span>
            </button>
            <button
              onClick={() => setQuickFilter('nearby')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                quickFilter === 'nearby'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={!userLocation}
            >
              <Navigation className="w-4 h-4" />
              <span className="text-sm font-medium">Nearby</span>
            </button>
            <button
              onClick={() => setQuickFilter('best')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                quickFilter === 'best'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Best Price</span>
            </button>
            <button
              onClick={() => setQuickFilter('new')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                quickFilter === 'new'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">New Today</span>
            </button>
            <button
              onClick={() => setShowCharts(!showCharts)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                showCharts
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Charts</span>
            </button>
          </div>

          {/* Quick Stats Bar - Always Visible */}
          {filteredPrices.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="stat-item bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2.5 text-center transform hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-700 font-medium">Highest</p>
                </div>
                <p className="text-base font-bold text-green-600">₹{priceStats.highest}</p>
              </div>
              <div className="stat-item bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2.5 text-center transform hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <IndianRupee className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-700 font-medium">Average</p>
                </div>
                <p className="text-base font-bold text-blue-600">₹{priceStats.average}</p>
              </div>
              <div className="stat-item bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-2.5 text-center transform hover:scale-105 transition-all cursor-pointer">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  <p className="text-xs text-red-700 font-medium">Lowest</p>
                </div>
                <p className="text-base font-bold text-red-600">₹{priceStats.lowest}</p>
              </div>
            </div>
          )}

          {/* Collapsible Filters */}
          <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 space-y-3">
              {/* Row 1: State & Commodity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {t('selectState') || 'State'}
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all text-sm"
                  >
                    <option value="">{t('allStates') || 'All States'}</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {t('selectCommodity') || 'Commodity'}
                  </label>
                  <select
                    value={selectedCommodity}
                    onChange={(e) => setSelectedCommodity(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all text-sm"
                  >
                    <option value="">{t('allCommodities') || 'All Commodities'}</option>
                    {commodities.map(commodity => (
                      <option key={commodity} value={commodity}>{commodity}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Variety (conditional) */}
              {varieties.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Variety</label>
                  <select
                    value={selectedVariety}
                    onChange={(e) => setSelectedVariety(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all text-sm"
                  >
                    <option value="">All Varieties</option>
                    {varieties.map(variety => (
                      <option key={variety} value={variety}>{variety}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Row 3: Search */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Search className="w-3 h-3" />
                  {t('search') || 'Search'}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search commodity, market, district..."
                    className="w-full pl-10 pr-10 py-2 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row 4: Sort Toggle & Actions */}
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-blue-100">
                <div className="flex items-center gap-2">
                  <Navigation className={`w-4 h-4 ${sortByDistance ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium text-gray-700">Sort by Distance</span>
                </div>
                <button
                  onClick={() => setSortByDistance(!sortByDistance)}
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    sortByDistance ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      sortByDistance ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Row 5: Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all active:scale-95 shadow-lg text-sm font-medium"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  {t('refresh') || 'Refresh'}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all active:scale-95 flex items-center gap-2 text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>

              {/* Last Update Time */}
              {lastUpdateTime && (
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <Clock className="w-3 h-3" />
                  <span>Updated: {lastUpdateTime.toLocaleString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Smart Recommendation Banner */}
        {filteredPrices.length > 0 && priceStats.highest > 0 && (
          (() => {
            const bestDeals = filteredPrices
              .filter(p => p.modal_price >= priceStats.highest * 0.95)
              .filter(p => p.distance !== undefined && p.distance < 50)
              .slice(0, 1);
            
            if (bestDeals.length > 0 && quickFilter !== 'best') {
              const deal = bestDeals[0];
              return (
                <div className="mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg animate-slide-in-up">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">💡 Best Deal Nearby!</p>
                      <p className="text-white/90 text-sm mb-2">
                        {deal.commodity} at ₹{deal.modal_price}/{deal.unit} in {deal.market}
                      </p>
                      <p className="text-white/80 text-xs">
                        {deal.distance && `${Math.round(deal.distance)}km away • `}
                        {deal.modal_price >= priceStats.highest * 0.95 && 'Top 5% price in market'}
                      </p>
                    </div>
                    <button
                      onClick={() => setQuickFilter('best')}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-all active:scale-95"
                    >
                      View All
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })()
        )}

        {/* Price Charts Section */}
        {showCharts && (
          <div className="mb-6 animate-slide-in-up">
            <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-lg text-gray-800">
                    {selectedCommodity ? `${selectedCommodity} Price Trend` : 'Market Overview'}
                  </h2>
                </div>
                <button
                  onClick={() => setShowCharts(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <MandiPriceCharts commodity={selectedCommodity} state={selectedState} />
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
              <IndianRupee className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-green-600 animate-pulse" />
            </div>
            <p className="mt-6 text-gray-600 font-medium animate-pulse">{t('loadingPrices') || 'Loading prices...'}</p>
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-12 text-center">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{t('noPricesFound') || 'No prices found'}</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search term</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all active:scale-95 shadow-lg"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((price, index) => {
              const trend = getPriceTrend(price.modal_price);
              const TrendIcon = trend.icon;
              const transportCost = calculateTransportCost(price.distance);
              const priceId = `${price.market}_${price.commodity}_${price.variety}`;
              const isFavorite = favorites.has(priceId);
              
              return (
                <div 
                  key={index} 
                  className="mandi-card animate-slide-in-up group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Header - Simplified */}
                  <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 p-4 relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        {price.cropImage && (
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                            <img 
                              src={price.cropImage} 
                              alt={price.commodity}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-0.5 truncate">{price.commodity}</h3>
                          <p className="text-sm text-white/90 truncate">{price.variety}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(priceId)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all active:scale-95"
                      >
                        <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-300 text-yellow-300' : 'text-white'}`} />
                      </button>
                    </div>

                    {/* Prominent Price Display */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-center mb-3">
                        <p className="text-white/80 text-xs font-medium mb-1">Market Price</p>
                        <p className="text-4xl font-bold text-white mb-1">₹{price.modal_price}</p>
                        <p className="text-white/90 text-sm">per {price.unit}</p>
                      </div>
                      {/* Per KG Price if unit is quintal */}
                      {price.unit.toLowerCase().includes('quintal') && (
                        <div className="pt-3 border-t border-white/20 text-center">
                          <p className="text-white/70 text-xs mb-0.5">Per Kg</p>
                          <p className="text-xl font-bold text-white">₹{Math.round(price.modal_price / 100)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {/* Location & Distance */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="font-medium truncate">{price.market}, {price.district}</span>
                      </div>
                      {price.distance !== undefined && price.distance < 9999 && transportCost && (
                        <>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Navigation className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{Math.round(price.distance)} km away</span>
                            <span className="ml-auto text-orange-600 font-medium">₹{transportCost} transport</span>
                          </div>
                          {(() => {
                            const netProfit = calculateNetProfit(price.modal_price, transportCost, price.unit);
                            if (netProfit) {
                              const indicator = getProfitIndicator(netProfit.profitPercentage);
                              const perKgProfit = price.unit.toLowerCase().includes('quintal') 
                                ? Math.round(netProfit.netProfit / 100) 
                                : netProfit.netProfit;
                              
                              return (
                                <div className={`p-3 rounded-lg ${indicator.bg} border-2 ${indicator.color.replace('text-', 'border-')}`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <IndianRupee className={`w-4 h-4 ${indicator.color}`} />
                                      <span className={`text-xs font-medium ${indicator.color}`}>Net Profit</span>
                                    </div>
                                    <span className={`text-xs font-bold ${indicator.color} px-2 py-0.5 rounded-full bg-white/50`}>
                                      {indicator.text}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="text-center p-2 bg-white/50 rounded">
                                      <p className={`text-xs ${indicator.color} mb-0.5`}>Per {price.unit}</p>
                                      <p className={`text-lg font-bold ${indicator.color}`}>₹{netProfit.netProfit}</p>
                                    </div>
                                    {price.unit.toLowerCase().includes('quintal') && (
                                      <div className="text-center p-2 bg-white/50 rounded">
                                        <p className={`text-xs ${indicator.color} mb-0.5`}>Per Kg</p>
                                        <p className={`text-lg font-bold ${indicator.color}`}>₹{perKgProfit}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </>
                      )}
                    </div>

                    {/* Price Range (Compact) */}
                    <div className="flex items-center justify-between mb-3 p-2 bg-gray-50 rounded-lg text-xs">
                      <div className="text-center">
                        <p className="text-gray-500 mb-0.5">Min</p>
                        <p className="font-bold text-red-600">₹{price.min_price}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 mb-0.5">Max</p>
                        <p className="font-bold text-green-600">₹{price.max_price}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 mb-0.5">Date</p>
                        <p className="font-bold text-gray-700">{new Date(price.arrival_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>

                    {/* Price Indicator */}
                    {price.modal_price >= priceStats.highest * 0.9 && (
                      <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-bold text-green-700">🎯 Best Price in Market!</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => callMandi(price.market)}
                        className="flex flex-col items-center gap-1 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all active:scale-95"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Call</span>
                      </button>
                      <button
                        onClick={() => getDirections(price.market, price.district, price.state)}
                        className="flex flex-col items-center gap-1 p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-all active:scale-95"
                      >
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Directions</span>
                      </button>
                      <button
                        onClick={() => sharePrice(price)}
                        className="flex flex-col items-center gap-1 p-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all active:scale-95"
                      >
                        <Share2 className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
