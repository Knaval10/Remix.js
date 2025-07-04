import React from "react";
import { json, useLoaderData } from "@remix-run/react";
import { getUserData } from "~/services/user";
import UserTable from "~/components/Table/UserTable";

export interface DataType {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface DataProps {
  data: DataType[];
}
//inbuilt loader function to fetch data in the server (SSR)
export const loader = async () => {
  const userData = await getUserData();
  return json(userData);
};

const UsersRoute = () => {
  //consuming server fetched data on the component and painting on browser

  const users = useLoaderData<DataType[]>();
  return (
    <div className="p-10 ">
      <h1>Users</h1>
      <UserTable data={users} />
    </div>
  );
};

export default UsersRoute;
