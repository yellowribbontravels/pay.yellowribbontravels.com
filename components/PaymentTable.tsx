"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";

export default function PaymentTable() {
  const [payments, setPayments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/payments", { cache: "no-store" });
        const json = await res.json();
        if (json.status === "success") setPayments(json.data);
        else setError(json.message || "Unknown error");
      } catch {
        setError("Network or server error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-6">
        <Spinner label="Loading payments..." />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 py-6 font-medium">
        {error}
      </div>
    );

  if (payments.length === 0)
    return (
      <div className="text-center text-default-500 py-6">
        No payments found
      </div>
    );

  return (
    <div className="overflow-x-auto w-full">
      <Table aria-label="Payments Table" removeWrapper className="min-w-full">
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Customer</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Phone</TableColumn>
          <TableColumn>Amount (₹)</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Method</TableColumn>
          <TableColumn>Created At</TableColumn>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="truncate max-w-[120px]">{p.id}</TableCell>
              <TableCell>{p.customerName}</TableCell>
              <TableCell>{p.customerEmail}</TableCell>
              <TableCell>{p.customerPhone}</TableCell>
              <TableCell>{p.amount}</TableCell>
              <TableCell>
                <span
                  className={`font-semibold ${
                    p.paid === "Paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.paid}
                </span>
              </TableCell>
              <TableCell>{p.paymentMethod}</TableCell>
              <TableCell>{p.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
