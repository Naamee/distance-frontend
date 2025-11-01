import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/alerts')({
  component: Alerts,
});

function Alerts() {
  return <div className="p-2">Hello from Alerts!</div>;
}
