import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import facilityService from '../../services/facilityService';
import FacilityCard from '../../components/facilities/FacilityCard';
import FacilitySearch from '../../components/facilities/FacilitySearch';
import FacilityFilters from '../../components/facilities/FacilityFilters';
import FacilityMap from '../../components/facilities/FacilityMap';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import DemoBanner from '../../components/common/DemoBanner';
import { Building, Map, List, RefreshCw, AlertCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const Facilities = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('search') || '';
  const urlDistrict = searchParams.get('district') || '';
  const urlTier = searchParams.get('tier') || '';
  const urlService = searchParams.get('service') || '';

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedDistrict, setSelectedDistrict] = useState(urlDistrict);
  const [selectedTier, setSelectedTier] = useState(urlTier);
  const [selectedService, setSelectedService] = useState(urlService);
  const [sortBy, setSortBy] = useState('name_asc');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [currentPage, setCurrentPage] = useState(1);
  const [mapCenter, setMapCenter] = useState([18.7, 74.2]);
  const [mapZoom, setMapZoom] = useState(8);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await facilityService.getFacilities({
        search: searchTerm,
        district: selectedDistrict,
        tier: selectedTier,
        service: selectedService,
        sortBy
      });
      if (res?.data) {
        setFacilities(res.data);
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
    setCurrentPage(1);
  }, [searchTerm, selectedDistrict, selectedTier, selectedService, sortBy]);

  // Listen to storage events (e.g. if an admin added a facility)
  useEffect(() => {
    const handleStorageChange = () => fetchFacilities();
    window.addEventListener('gram_arogya_storage_changed', handleStorageChange);
    return () => window.removeEventListener('gram_arogya_storage_changed', handleStorageChange);
  }, []);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedTier('');
    setSelectedService('');
    setSortBy('name_asc');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    searchTerm || selectedDistrict || selectedTier || selectedService || sortBy !== 'name_asc'
  );

  // Pagination calculation
  const totalPages = Math.ceil(facilities.length / ITEMS_PER_PAGE);
  const displayedFacilities = facilities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectOnMap = (facility) => {
    if (facility.location?.coordinates) {
      const [lng, lat] = facility.location.coordinates;
      setMapCenter([lat, lng]);
      setMapZoom(12);
      setViewMode('map');
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <DemoBanner />

      <div className="container" style={{ padding: '2rem 1rem 4rem' }}>
        <Breadcrumbs items={[{ label: t('nav.facilities') }]} />

        {/* Page Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--color-primary)', margin: 0 }}>
              {t('facilities.title')}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
              {t('facilities.subtitle')}
            </p>
          </div>

          {/* View Toggle */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.2rem'
          }}>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : ''}`}
              style={{
                border: 'none',
                backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <List size={15} /> Card List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : ''}`}
              style={{
                border: 'none',
                backgroundColor: viewMode === 'map' ? 'var(--color-primary)' : 'transparent',
                color: viewMode === 'map' ? '#ffffff' : 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <Map size={15} /> Map View
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <FacilitySearch
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={t('home.searchPlaceholder')}
          />
        </div>

        {/* Filters Panel */}
        <div style={{ marginBottom: '1.5rem' }}>
          <FacilityFilters
            selectedDistrict={selectedDistrict}
            onDistrictChange={setSelectedDistrict}
            selectedTier={selectedTier}
            onTierChange={setSelectedTier}
            selectedService={selectedService}
            onServiceChange={setSelectedService}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Result Header Count */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          fontSize: '0.875rem',
          color: 'var(--color-text-secondary)'
        }}>
          <span>
            {t('facilities.showingResults', { count: facilities.length })}
          </span>
          {hasActiveFilters && (
            <span style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>
              Active Filters Applied
            </span>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <Loader message="Loading public health facilities directory..." />
        ) : facilities.length === 0 ? (
          <EmptyState
            title={t('common.noResults')}
            description={t('common.tryAdjusting')}
            actionText={t('common.reset')}
            onAction={handleResetFilters}
          />
        ) : viewMode === 'map' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FacilityMap
              facilities={facilities}
              center={mapCenter}
              zoom={mapZoom}
              height="550px"
            />
            <div className="notice-box-warning" style={{ fontSize: '0.825rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>
                {t('facilities.disclaimer')} Click any marker on the map to view center details or book an appointment.
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem'
            }}>
              {displayedFacilities.map((fac) => (
                <FacilityCard
                  key={fac._id}
                  facility={fac}
                  onSelectMap={handleSelectOnMap}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Facilities;
