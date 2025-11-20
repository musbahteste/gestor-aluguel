import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
      return NextResponse.json({ error: 'Missing MP_ACCESS_TOKEN environment variable' }, { status: 500 });
    }

    const idempotencyKey = (globalThis.crypto && typeof (globalThis.crypto as any).randomUUID === 'function')
      ? (globalThis.crypto as any).randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(body),
    });

    const data = await mpRes.json();

    if (!mpRes.ok) {
      return NextResponse.json({ error: 'MercadoPago error', details: data }, { status: mpRes.status });
    }

    // try to extract ticket url
    let ticket_url = data?.point_of_interaction?.transaction_data?.ticket_url;
    if (!ticket_url) ticket_url = data?.transaction_details?.external_resource_url;
    if (!ticket_url) ticket_url = `https://www.mercadopago.com.br/payments/${data.id}/ticket`;

    const barcode = data?.barcode?.content;

    // persist boleto info to DB (use any to avoid type error until prisma client is generated)
    try {
      await (prisma as any).boleto.create({
        data: {
          mpPaymentId: String(data.id),
          vencimento: data?.date_of_expiration ? new Date(data.date_of_expiration) : null,
          url: ticket_url,
          valor: Number(data.transaction_amount ?? body.transaction_amount ?? 0) || 0,
          payerFirstName: data?.payer?.first_name ?? data?.payer?.name ?? (body.payer?.first_name ?? ''),
          payerLastName: data?.payer?.last_name ?? data?.payer?.surname ?? (body.payer?.last_name ?? ''),
          barcode: barcode ?? null,
          raw: data,
        },
      });
    } catch (dbErr) {
      console.error('Erro ao salvar boleto no DB:', dbErr);
    }

    return NextResponse.json({
      success: true,
      payment_id: data.id,
      status: data.status,
      ticket_url,
      barcode,
      raw: data,
    });
  } catch (err) {
    console.error('Error creating boleto:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
