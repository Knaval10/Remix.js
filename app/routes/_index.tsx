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
  const alertDataPromise = getAlertData(); // Don't await this
  return defer({
    alerts: alertDataPromise,
  });
};

// Page component
export default function Index() {
  const data = useLoaderData<typeof loader>(); // consume SSR data
  // const dashboardTabItems = [
  //   {
  //     id: 1,
  //     count: data?.results?.length ?? 0,
  //     title: "Alerts",
  //   },
  //   {
  //     id: 2,
  //     count: 0,
  //     title: "Events",
  //   },
  //   {
  //     id: 3,
  //     title: "Visualization",
  //   },
  // ];

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  // const TabMap: any = {
  //   1: (
  //     <AlertsList
  //       alertList={alerts}
  //       hoveredItem={hoveredItem}
  //       setHoveredItem={setHoveredItem}
  //     />
  //   ),
  //   2: <Events />,
  //   3: <Visualization data={alerts} />,
  // };

  return (
    <div className="flex h-screen w-full">
      <section className="w-[30%] !min-w-[380px]">
        <Toolbar>
          <Suspense
            fallback={<p className="p-4 text-black">Loading alerts...</p>}
          >
            <Await resolve={data.alerts}>
              {(alerts) => {
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

                const selected = selectedItem ?? dashboardTabItems[0];

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
                  <>
                    <DashboardTab
                      tabItems={dashboardTabItems}
                      selectedItem={selected}
                      setSelectedItem={setSelectedItem}
                    />
                    {selected && TabMap[selected?.id]}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </Toolbar>
      </section>

      <section className="w-[70%]">
        <Suspense fallback={<p className="p-4">Loading map...</p>}>
          <Await resolve={data.alerts}>
            {(alerts) => (
              <Map
                alerts={alerts}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
              />
            )}
          </Await>
        </Suspense>
      </section>
    </div>
  );
}
