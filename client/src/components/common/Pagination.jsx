import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination Navigation">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} /> {t('common.previous')}
      </button>

      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', padding: '0 0.5rem' }}>
        {t('common.page')} <strong>{currentPage}</strong> {t('common.of')} <strong>{totalPages}</strong>
      </span>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        {t('common.next')} <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
