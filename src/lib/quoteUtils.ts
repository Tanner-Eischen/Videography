export const getStatusColor = (status: string, variant: 'badge' | 'text' = 'badge') => {
  if (variant === 'badge') {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  } else {
    switch (status) {
      case 'accepted':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'draft':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
};
