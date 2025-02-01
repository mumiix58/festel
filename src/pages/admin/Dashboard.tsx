import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { BarChart, Mail, Eye, Calendar } from 'lucide-react';
import { getContactMessages, getPageViews, getLatestActivities } from '@/lib/analytics';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface ContactMessage {
  id: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export function Dashboard() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
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

      // Load contact messages
      const messagesData = await getContactMessages();
      setMessages(messagesData || []);
      setStats(prev => ({ ...prev, totalMessages: messagesData?.length || 0 }));

      // Load page views
      const viewsData = await getPageViews();
      if (viewsData) {
        setStats(prev => ({
          ...prev,
          pageViews: viewsData.pageViews || 0,
          uniqueVisitors: viewsData.uniqueVisitors || 0
        }));
      }

      // Load activities
      const activitiesData = await getLatestActivities();
      setActivities(activitiesData || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Latest Activities */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
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
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                          locale: de
                        })}
                      </p>
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

          {/* Recent Messages */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="font-display text-xl font-semibold">
              Letzte Nachrichten
            </h2>
            <div className="mt-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-accent">
                        {message.email}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(message.date), {
                          addSuffix: true,
                          locale: de
                        })}
                      </span>
                    </div>
                    <p className="mt-2 font-medium">{message.subject}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {message.message.length > 100
                        ? `${message.message.slice(0, 100)}...`
                        : message.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  Keine Nachrichten vorhanden
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}