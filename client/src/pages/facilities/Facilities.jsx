import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import facilityService from '../../services/facilityService';
import FacilityCard from '../../components/facilities/FacilityCard';
import FacilitySearch from '../../components/facilities/FacilitySearch';
import FacilityFilters from '../../components/facilities/FacilityFilters';
import FacilityMap from '../../components/facilities/FacilityMap';
import Loader from '../../components/common/Loader';
import { Building, Map } from 'lucide-react';

export const Facilities = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const res = await facilityService.getFacilities({
          search,
          district: selectedDistrict,
          tier: selectedTier
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

    fetchFacilities();
  }, [search, selectedDistrict, selectedTier]);

  const handleReset = () => {
    setSelectedDistrict('');
    setSelectedTier('');
    setSearch('');
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 4rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary)' }}>
            Healthcare Facilities Directory
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Explore Maharashtra Sub-Centres, PHCs, CHCs, and District Hospitals
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('list')}
            className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <Building size={16} /> List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.85rem' }}
          >
            <Map size={16} /> Map View
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <FacilitySearch value={search} onChange={setSearch} />
        <FacilityFilters
          selectedDistrict={selectedDistrict}
          onDistrictChange={setSelectedDistrict}
          selectedTier={selectedTier}
          onTierChange={setSelectedTier}
          onReset={handleReset}
        />
      </div>

      {loading ? (
        <Loader message="Loading public healthcare facilities..." />
      ) : facilities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
            No healthcare facilities found matching your criteria.
          </p>
        </div>
      ) : viewMode === 'map' ? (
        <FacilityMap facilities={facilities} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {facilities.map((facility) => (
            <FacilityCard key={facility._id} facility={facility} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Facilities;
