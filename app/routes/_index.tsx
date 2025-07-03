// app/routes/_index.tsx
import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Map from "~/components/Map";
import { getAlertData } from "~/services/alert";

// SEO meta tags
export const meta: MetaFunction = () => {
  return [
    { title: "Alert Map | Remix App" },
    { name: "description", content: "Mapbox + Alerts using Remix SSR." },
  ];
};

// SSR data loading with loader
export const loader = async () => {
  const alertData = await getAlertData();
  return json(alertData);
};

// Page component
export default function Index() {
  const alerts = useLoaderData<typeof loader>(); // consume SSR data

  return (
    <div className="h-screen w-full">
      <Map alerts={alerts} />
    </div>
  );
}
