import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, amount, name, phone } = await req.json();

    if (!email || !amount || !name || !phone)
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );

    const paymentLink = await prisma.paymentModel.create({
      data: {
        customerEmail: email,
        amount: Number(amount),
        customerName: name,
        customerPhone: phone,
        customerId: phone,
      },
    });

    const paymentUrl = `https://pay.yellowribbontravels.com/${paymentLink.id}`;
    return NextResponse.json({ status: "success", paymentUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ status: "error", message }, { status: 500 });
  }
}
