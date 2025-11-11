import React from 'react'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation';

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const data = await prisma.paymentModel.findUnique({
        where: { id: slug }
    });
    return {
        title: data ? `Payment for ${data.customerName}` : 'Payment Not Found',
        description: data ? `Pay ₹${data.amount} for ${data.customerName}` : 'No payment data available',
    };
}
const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    if (!slug) {
        return (
            <div>
                <h1>Payment Not Found</h1>
            </div>
        )
    }

    redirect('https://yellowribbontravels.com/' + slug);
    return (
        <div>
            <h1>Payment Page for ID: {slug}</h1>
        </div>
    )
}

export default page
