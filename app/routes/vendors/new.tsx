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
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h1>Add a New Vendor</h1>
      <Form method="post">
        <div>
          <label>
            Vendor Name:{" "}
            <input type="text" name="name" />
          </label>
          {actionData?.errors?.name && (
            <p style={{ color: "red" }}>{actionData.errors.name}</p>
          )}
        </div>
        <div>
          <label>
            Active:{" "}
            <input type="checkbox" name="isActive" value="true" />
          </label>
        </div>
        <div>
          <button type="submit">Save</button>
        </div>
      </Form>
    </div>
  );
}
