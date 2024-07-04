import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { createVendor } from "~/models/vendor.server";
// import { requireUserId } from "~/session.server";

interface ActionData {
  errors?: {
    name?: string;
    isActive?: string;
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("Action function for /vendors/new route called");
  // await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("name");
  const isActive = formData.get("isActive") === "true";

  console.log("Form data received:", { name, isActive });

  if (typeof name !== "string" || name.length === 0) {
    console.log("Validation error: Name is required");
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  await createVendor({ name, isActive });

  console.log("Vendor created successfully");

  return redirect("/vendors");
};

export default function NewVendorPage() {
  console.log("NewVendorPage component rendered");

  return (
    <div>
      <h1>Hello, Vendor!</h1>
    </div>
  );
}
