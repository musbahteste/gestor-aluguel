import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) return NextResponse.json({ error: 'Missing MP_ACCESS_TOKEN' }, { status: 500 });

    const idempotencyKey = (globalThis.crypto && typeof (globalThis.crypto as any).randomUUID === 'function')
      ? (globalThis.crypto as any).randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const payload = {
      transaction_amount: body.transaction_amount,
      description: body.description ?? 'Cobrança PIX',
      payment_method_id: 'pix',
      installments: 1,
      payer: {
        email: body.payer?.email,
        first_name: body.payer?.first_name,
        last_name: body.payer?.last_name,
        identification: body.payer?.identification,
      },
      notification_url: body.notification_url ?? undefined,
    };

    const res = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: 'MP error', details: data }, { status: res.status });
    }

    const tx = data?.point_of_interaction?.transaction_data ?? {};
    const qrBase64 = tx.qr_code_base64 ?? null;
    const qrText = tx.qr_code ?? null;

    try {
      await prisma.pix.create({
        data: {
          mpPaymentId: String(data.id),
          qrCodeBase64: qrBase64,
          qrCodeText: qrText,
          valor: Number(data.transaction_amount ?? body.transaction_amount ?? 0) || 0,
          payerFirstName: data?.payer?.first_name ?? body.payer?.first_name ?? '',
          payerLastName: data?.payer?.last_name ?? body.payer?.last_name ?? '',
          raw: data,
        },
      });
    } catch (dbErr) {
      console.error('Erro ao salvar Pix no DB:', dbErr);
    }

    return NextResponse.json({ success: true, data: { payment: data, qrBase64, qrText } });
  } catch (err) {
    console.error('Erro gerar pix:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
