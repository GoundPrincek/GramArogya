import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, XCircle, AlertTriangle, Send, RefreshCw } from 'lucide-react';

export const StatusBadge = ({ status, urgency }) => {
  const { t } = useTranslation();

  const getStatusConfig = (s) => {
    switch (s) {
      case 'Accepted':
        return { className: 'badge-accepted', icon: CheckCircle2, label: t('status.accepted') };
      case 'Completed':
        return { className: 'badge-completed', icon: CheckCircle2, label: t('status.completed') };
      case 'Pending':
        return { className: 'badge-pending', icon: Clock, label: t('status.pending') };
      case 'Rejected':
        return { className: 'badge-rejected', icon: XCircle, label: t('status.rejected') };
      case 'Cancelled':
        return { className: 'badge-cancelled', icon: XCircle, label: t('status.cancelled') };
      case 'In Progress':
        return { className: 'badge-in-progress', icon: RefreshCw, label: t('status.inProgress') };
      case 'Sent':
        return { className: 'badge-sent', icon: Send, label: t('status.sent') };
      case 'Created':
        return { className: 'badge-created', icon: Clock, label: t('status.created') };
      default:
        return { className: 'badge-info', icon: Clock, label: s };
    }
  };

  const getUrgencyConfig = (u) => {
    switch (u) {
      case 'Emergency':
        return { className: 'badge-emergency', icon: AlertTriangle, label: 'EMERGENCY' };
      case 'Urgent':
        return { className: 'badge-urgent', icon: AlertTriangle, label: 'URGENT' };
      default:
        return { className: 'badge-routine', icon: null, label: 'ROUTINE' };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      {urgency && (
        <span className={`badge ${getUrgencyConfig(urgency).className}`}>
          {getUrgencyConfig(urgency).label}
        </span>
      )}
      <span className={`badge ${statusConfig.className}`}>
        {statusConfig.icon && <statusConfig.icon size={13} />}
        {statusConfig.label}
      </span>
    </div>
  );
};

export default StatusBadge;
