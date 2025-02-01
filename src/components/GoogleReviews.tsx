import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Star } from 'lucide-react';
import { GoogleReview } from '@/types';

interface GoogleReviewsProps {
  placeId: string;
  apiKey: string;
}

export function GoogleReviews({ placeId, apiKey }: GoogleReviewsProps) {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!placeId || placeId === 'YOUR_PLACE_ID_HERE') {
      setError('Place ID not configured');
      setLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then((google) => {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      service.getDetails(
        {
          placeId: placeId,
          fields: ['reviews', 'rating', 'user_ratings_total']
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place?.reviews) {
            setReviews(place.reviews.map(review => ({
              author_name: review.author_name || '',
              rating: review.rating || 0,
              text: review.text || '',
              relative_time_description: review.relative_time_description || '',
              profile_photo_url: review.profile_photo_url || ''
            })));
          } else {
            setError('Failed to load Google Reviews');
          }
          setLoading(false);
        }
      );
    }).catch((err) => {
      setError('Failed to load Google Maps API');
      setLoading(false);
      console.error('Google Maps API loading error:', err);
    });
  }, [placeId, apiKey]);

  if (loading) {
    return (
      <div className="text-center text-gray-600">
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-gray-600">
          {error === 'Place ID not configured' 
            ? 'Google Reviews will be available soon.'
            : 'Unable to load reviews at this time.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review, index) => (
        <div 
          key={index} 
          className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105"
        >
          <div className="flex items-center gap-4">
            <img
              src={review.profile_photo_url}
              alt={review.author_name}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{review.author_name}</h3>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-gray-600">{review.text}</p>
          <p className="mt-2 text-sm text-gray-500">
            {review.relative_time_description}
          </p>
        </div>
      ))}
    </div>
  );
}