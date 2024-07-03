import type { Vendor } from "@prisma/client";
import { prisma } from "~/db.server";

export function getVendor({ id }: Pick<Vendor, "id">) {
  return prisma.vendor.findUnique({
    where: { id },
  });
}

export function getVendorListItems() {
  return prisma.vendor.findMany({
    select: { id: true, name: true, isActive: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createVendor({
  name,
  isActive,
}: Pick<Vendor, "name" | "isActive">) {
  return prisma.vendor.create({
    data: {
      name,
      isActive,
    },
  });
}

export function updateVendor({
  id,
  name,
  isActive,
}: Pick<Vendor, "id" | "name" | "isActive">) {
  return prisma.vendor.update({
    where: { id },
    data: {
      name,
      isActive,
    },
  });
}

export function deleteVendor({ id }: Pick<Vendor, "id">) {
  return prisma.vendor.delete({
    where: { id },
  });
}
