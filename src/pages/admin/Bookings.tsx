import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { Booking } from '@/types';

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Placeholder for future implementation
    setBookings([]);
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  const handleStatusChange = async (bookingId: string, status: Booking['status']) => {
    // Placeholder for future implementation
    console.log('Status change:', bookingId, status);
  };

  const handleDelete = async (bookingId: string) => {
    // Placeholder for future implementation
    console.log('Delete booking:', bookingId);
  };

  return (
    <div className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Terminanfragen</h1>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="all">Alle</option>
              <option value="pending">Ausstehend</option>
              <option value="confirmed">Bestätigt</option>
              <option value="cancelled">Storniert</option>
            </select>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {filteredBookings.length === 0 && (
            <div className="text-center">
              <p className="text-gray-500">Keine Buchungen gefunden</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}