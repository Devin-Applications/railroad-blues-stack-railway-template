import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

import { getVendor, updateVendor } from "~/models/vendor.server";
import { requireUserId } from "~/session.server";

interface ActionData {
  errors?: {
    name?: string;
    isActive?: string;
  };
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const vendorId = params.vendorId;
  if (typeof vendorId !== "string") {
    throw new Response("Vendor not found", { status: 404 });
  }
  const vendor = await getVendor({ id: vendorId });
  if (!vendor) {
    throw new Response("Vendor not found", { status: 404 });
  }
  return json({ vendor });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireUserId(request);
  const vendorId = params.vendorId;
  if (typeof vendorId !== "string") {
    throw new Response("Vendor not found", { status: 404 });
  }
  const formData = await request.formData();
  const name = formData.get("name");
  const isActive = formData.get("isActive") === "true";

  if (typeof name !== "string" || name.length === 0) {
    return json<ActionData>(
      { errors: { name: "Name is required" } },
      { status: 400 }
    );
  }

  await updateVendor({ id: vendorId, name, isActive });

  return redirect("/vendors");
};

export default function EditVendorPage() {
  const { vendor } = useLoaderData<typeof loader>();
  const actionData = useActionData() as ActionData;

  if (!vendor) {
    return <p>Vendor not found</p>;
  }

  return (
    <Form method="post">
      <div>
        <label>
          Vendor Name:{" "}
          <input
            type="text"
            name="name"
            defaultValue={vendor.name}
            aria-invalid={actionData?.errors?.name ? true : undefined}
            aria-describedby="name-error"
          />
        </label>
        {actionData?.errors && actionData.errors.name && (
          <p className="form-validation-error" role="alert" id="name-error">
            {actionData.errors.name}
          </p>
        )}
      </div>

      <div>
        <label>
          Active:{" "}
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={typeof vendor.isActive === "boolean" ? vendor.isActive : false}
          />
        </label>
      </div>

      <div>
        <button type="submit">Update Vendor</button>
      </div>
    </Form>
  );
}
