import React from "react";
import { useNavigate } from "@remix-run/react";
import { DataType } from "~/routes/user._index";

interface UserTableProps {
  data: DataType[];
}

const UserTable: React.FC<UserTableProps> = ({ data }) => {
  const navigate = useNavigate();

  if (data.length === 0) return <p>No data available</p>;

  const headers = Object.keys(data[0]) as (keyof DataType)[];

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        cellPadding="10"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            {headers.map((key) => (
              <th key={key}>{key.toUpperCase()}</th>
            ))}
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {headers.map((key) => (
                <td key={key}>{row[key]}</td>
              ))}
              <td>
                <button onClick={() => navigate(`/user/${row.id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
