import React from "react";
import { json, useLoaderData } from "@remix-run/react";
import { getUserData } from "~/services/user";

interface DataType {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface DataProps {
  data: DataType;
}

//inbuilt loader function to fetch data in the server (SSR)
export const loader = async () => {
  const userData = await getUserData();
  return json(userData);
};

//if no data need to be loaded in the server, fetch data using useEffect and pass to the component (CSR)

const UsersRoute = () => {
  //consuming server fetched data on the component and painting on browser
  const users: DataProps = useLoaderData();
  console.log("users", users);
  return <div className="">Users</div>;
};

export default UsersRoute;
