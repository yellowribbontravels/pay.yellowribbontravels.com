import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { format, toZonedTime } from "date-fns-tz";

export async function GET() {
  try {
    const payments = await prisma.paymentModel.findMany({
      orderBy: { createdAt: "desc" },
    });

    const timeZone = "Asia/Kolkata";

    const serialized = payments.map((p) => {
      const zoned = toZonedTime(p.createdAt, timeZone);
      const formattedDate = format(zoned, "dd MMM yyyy, hh:mm a zzz", {
        timeZone,
      });

      return {
        id: p.id,
        customerName: p.customerName,
        customerEmail: p.customerEmail,
        customerPhone: p.customerPhone,
        amount: p.amount.toFixed(2),
        paid: p.paid ? "Paid" : "Pending",
        paymentMethod: p.paymentMethod ?? "—",
        createdAt: formattedDate,
      };
    });

    return NextResponse.json({ status: "success", data: serialized });
  } catch (error) {
    console.error("Payment fetch error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
