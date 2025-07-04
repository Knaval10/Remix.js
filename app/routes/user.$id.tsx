import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import UserCard from "~/components/Card/UserCard";
import { getUserDetails } from "~/services/userDetails";
import { DataType } from "./user._index";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id: string | undefined = params.id;

  if (!id) {
    throw new Response("User ID is required", { status: 400 });
  }
  const numericId: number = parseInt(id, 10);

  const userDetails = await getUserDetails(numericId);
  return json(userDetails);
};

const UserDetails = () => {
  const detailData = useLoaderData<DataType>();
  const { userId, id, title, body } = detailData;
  return (
    <div className="p-10 ">
      <UserCard userId={userId} id={id} title={title} body={body} />
    </div>
  );
};

export default UserDetails;
