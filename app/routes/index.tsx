import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getVendorListItems } from "~/models/vendor.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const vendorListItems = await getVendorListItems();
  const totalVendors = vendorListItems.length;
  const activeVendors = vendorListItems.filter(vendor => vendor.isActive).length;
  const inactiveVendors = totalVendors - activeVendors;
  return json({ totalVendors, activeVendors, inactiveVendors });
};

export default function IndexPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Vendor Management System</h1>
      <div>
        <h2>Stats</h2>
        <p>Total Vendors: {data.totalVendors}</p>
        <p>Active Vendors: {data.activeVendors}</p>
        <p>Inactive Vendors: {data.inactiveVendors}</p>
      </div>
    </div>
  );
}
