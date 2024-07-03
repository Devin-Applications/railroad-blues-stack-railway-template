import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { createVendor } from "~/models/vendor.server";
import { requireUserId } from "~/session.server";

interface ActionData {
  errors?: {
    name?: string;
    isActive?: string;
  };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get("name");
  const isActive = formData.get("isActive") === "true";

  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  await createVendor({ name, isActive });

  return redirect("/vendors");
};

export default function NewVendorPage() {
  const actionData = useActionData() as ActionData;

  return (
    <Form method="post">
      <div>
        <label>
          Vendor Name:{" "}
          <input
            type="text"
            name="name"
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-describedby="name-error"
          />
        </label>
        {actionData?.errors?.name && (
          <p className="form-validation-error" role="alert" id="name-error">
            {actionData.errors.name}
          </p>
        )}
      </div>

      <div>
        <label>
          Active:{" "}
          <input type="checkbox" name="isActive" defaultChecked />
        </label>
      </div>

      <div>
        <button type="submit">
          Add Vendor
        </button>
      </div>
    </Form>
  );
}
