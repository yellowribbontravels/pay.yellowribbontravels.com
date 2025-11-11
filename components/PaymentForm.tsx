'use client';
import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Tooltip } from '@heroui/tooltip';
import { Code } from '@heroui/code';
import { addToast } from '@heroui/toast';
import { ClipboardCopyIcon, CheckIcon } from 'lucide-react';

const PaymentForm = () => {
  const [linkCreated, setLinkCreated] = React.useState(false);
  const [paymentUrl, setPaymentUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
  });

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // <--- crucial fix (prevents full-page reload)
    const { name, email, phone, amount } = formData;

    if (!email || !name || !phone || !amount || Number(amount) <= 0) {
      addToast({
        title: 'Invalid Input',
        description: 'All fields are required and must be valid.',
        color: 'danger',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          amount: Number(amount),
        }),
      });

      const payment = await res.json();
      if (payment.status === 'success') {
        setLinkCreated(true);
        setPaymentUrl(payment.paymentUrl);
        addToast({
          title: 'Success',
          description: 'Payment link created successfully!',
          color: 'success',
        });
      } else {
        addToast({
          title: 'Error',
          description: payment.message || 'Failed to create payment link',
          color: 'danger',
        });
      }
    } catch {
      addToast({
        title: 'Error',
        description: 'Network or server error',
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!paymentUrl) return;
    try {
      await navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      addToast({
        title: 'Copied!',
        description: 'Payment link copied to clipboard.',
        color: 'success',
      });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to copy link.',
        color: 'danger',
      });
    }
  };

  return (
    <div className="flex justify-center w-full p-4">
      <Card className="w-full max-w-md shadow-lg border border-default-200">
        <CardHeader className="flex flex-col items-center space-y-1 pb-0">
          <h2 className="text-xl font-semibold text-default-900">
            Create Payment Link
          </h2>
          <p className="text-sm text-default-500">
            Fill in details to generate and share payment link
          </p>
        </CardHeader>

        <CardBody className="pt-4">
          <Form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              isRequired
              label="Name"
              labelPlacement="outside"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            <Input
              isRequired
              label="Email"
              labelPlacement="outside"
              placeholder="Enter customer email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <Input
              isRequired
              label="Phone"
              labelPlacement="outside"
              placeholder="Enter customer phone number"
              type="tel"
              pattern="[0-9]{10}"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            <Input
              isRequired
              label="Amount"
              labelPlacement="outside"
              placeholder="Enter payment amount"
              type="number"
              min={1}
              value={formData.amount}
              onChange={(e) => updateField('amount', e.target.value)}
            />

            {loading ? (
              <Button disabled isLoading fullWidth>
                Submitting...
              </Button>
            ) : linkCreated ? (
              <div className="flex flex-col items-start gap-3">
                <Button
                  fullWidth
                  type="button"
                  variant="solid"
                  color="primary"
                  onClick={() => window.open(paymentUrl, '_blank')}
                >
                  Open Payment Link
                </Button>

                <div className="text-xs text-default-500">
                  Copy and share this link for payment:
                </div>

                <div className="flex items-center gap-2 bg-default-50 rounded-md px-2 py-1 w-full">
                  <Code color="success" className="truncate flex-1">
                    {paymentUrl}
                  </Code>
                  <Tooltip content={copied ? 'Copied!' : 'Copy'}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <ClipboardCopyIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </Tooltip>
                </div>
              </div>
            ) : (
              <Button fullWidth type="submit" variant="bordered">
                Generate Link
              </Button>
            )}
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default PaymentForm;
