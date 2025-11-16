export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(d);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'recebido':
      return 'bg-green-100 text-green-800';
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'atrasado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'recebido':
      return 'Recebido';
    case 'pendente':
      return 'Pendente';
    case 'atrasado':
      return 'Atrasado';
    default:
      return status;
  }
}
