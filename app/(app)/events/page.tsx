import { EventsScreen } from '@/components/events-screen'
import { mockEvents } from '@/lib/mock-data'

export default function EventsPage() {
  return <EventsScreen events={mockEvents} />
}
