// app/routes/_index.tsx
import { json, type MetaFunction } from "@remix-run/node";
import { Await, defer, useLoaderData } from "@remix-run/react";
import React, { Suspense, useEffect } from "react";
import { useMemo, useState } from "react";
import Toolbar from "~/components/Common/Toolbar";
import AlertsList from "~/components/Common/Toolbar/AlertsList";
import DashboardTab from "~/components/Dashboard/DashboardTab";
import Events from "~/components/Dashboard/Events";
import Visualization from "~/components/Dashboard/Visualization";
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
  const alertsData = await getAlertData(); // Don't await this
  return json(alertsData);
};

// Page component
export default function Index() {
  const alerts = useLoaderData<typeof loader>(); // consume SSR data
  const dashboardTabItems = [
    {
      id: 1,
      count: alerts?.results?.length ?? 0,
      title: "Alerts",
    },
    {
      id: 2,
      count: 0,
      title: "Events",
    },
    {
      id: 3,
      title: "Visualization",
    },
  ];

  const [selectedItem, setSelectedItem] = useState<any>(dashboardTabItems[0]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showToolbar, setShowToolbar] = useState(false);

  const TabMap: any = {
    1: (
      <AlertsList
        alertList={alerts}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />
    ),
    2: <Events />,
    3: <Visualization data={alerts} />,
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <section
        className={`transition-all duration-300 ${
          showToolbar ? "w-[30%] min-w-[380px]" : "w-0"
        }`}
      >
        <Toolbar showToolbar={showToolbar} setShowToolbar={setShowToolbar}>
          <DashboardTab
            tabItems={dashboardTabItems}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          {selectedItem && TabMap[selectedItem?.id]}
        </Toolbar>
      </section>
      <section
        className={`transition-all duration-300 ${
          showToolbar ? "w-[70%]" : "w-[100%]"
        }`}
      >
        <Map
          alerts={alerts}
          hoveredItem={hoveredItem}
          setHoveredItem={setHoveredItem}
          showToolbar={showToolbar}
          setShowToolbar={setShowToolbar}
        />
      </section>
    </div>
  );
}
