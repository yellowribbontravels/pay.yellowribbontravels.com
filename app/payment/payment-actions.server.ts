"use server";

import { prisma } from "@/lib/db";

export async function createPaymentLink({
  email,
  amount,
  name,
  phone,
}: {
  email: string;
  amount: number;
  name: string;
  phone: string;
}) {
  try {
    const paymentLink = await prisma.paymentModel.create({
      data: {
        customerEmail: email,
        amount,
        customerName: name,
        customerPhone: phone,
        customerId: phone,
      },
    });

    const paymentUrl = `https://pay.yellowribbontravels.com/${paymentLink.id}`;
    return { status: "success", paymentUrl };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { status: "error", message };
  }
}
