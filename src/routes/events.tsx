import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/events')({
  component: Events,
});

function Events() {
  return <div className="p-2">Hello from events!</div>;
}
