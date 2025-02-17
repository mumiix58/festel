import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { BarChart, Mail, Eye, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

interface Activity {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface Stats {
  totalMessages: number;
  pageViews: number;
  uniqueVisitors: number;
}

export function Dashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    pageViews: 0,
    uniqueVisitors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load activities and stats in parallel
      const [activitiesResponse, statsResponse] = await Promise.all([
        api.get('/analytics/activities'),
        api.get('/analytics/stats')
      ]);

      if (Array.isArray(activitiesResponse)) {
        setActivities(activitiesResponse);
      }

      if (statsResponse) {
        setStats(statsResponse);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showToast.error('Fehler beim Laden der Dashboard-Daten');
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { 
      name: 'Kontaktanfragen', 
      value: stats.totalMessages, 
      icon: Mail,
      description: 'Gesamt Nachrichten'
    },
    { 
      name: 'Seitenaufrufe', 
      value: stats.pageViews, 
      icon: Eye,
      description: 'Gesamt Aufrufe'
    },
    { 
      name: 'Besucher', 
      value: stats.uniqueVisitors, 
      icon: BarChart,
      description: 'Einzigartige Besucher'
    }
  ];

  if (loading) {
    return (
      <div className="py-8">
        <Container>
          <div className="text-center">Laden...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        
        {/* Statistics */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statItems.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="rounded-lg bg-white p-6 shadow-lg"
              >
                <div className="flex items-center">
                  <div className="rounded-full bg-accent/10 p-3">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-600">
                  {stat.name}
                </p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stat.value.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Latest Activities */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="font-display text-xl font-semibold">
            Letzte Aktivitäten
          </h2>
          <div className="mt-4 space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="rounded-full bg-accent/10 p-2">
                    <Calendar className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                          locale: de
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Keine Aktivitäten vorhanden
              </p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}