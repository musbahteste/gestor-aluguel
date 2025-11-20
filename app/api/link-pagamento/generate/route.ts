import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, quantity = 1, unit_price, payer } = body;

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'MP_ACCESS_TOKEN not configured' }, { status: 500 });
    }

    const payload = {
      items: [
        {
          title: title || 'Pagamento',
          description: description || '',
          quantity: quantity,
          currency_id: 'BRL',
          unit_price: unit_price || 0,
        },
      ],
      payer: payer || undefined,
      back_urls: body.back_urls || undefined,
      auto_return: body.auto_return || undefined,
      notification_url: body.notification_url || undefined,
    };

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: 'MercadoPago error', details: data }, { status: res.status });
    }

    const preferenceId = data.id;
    const initPoint = data.init_point;

    // Save to DB
    try {
      await prisma.linkPagamento.create({
        data: {
          preferenceId: String(preferenceId),
          firstName: payer?.name || (payer?.first_name ?? 'Unknown'),
          lastName: payer?.surname || (payer?.last_name ?? ''),
          valor: Number(unit_price) || 0,
          link: initPoint || '',
          raw: data,
        },
      });
    } catch (dbErr) {
      console.error('DB save error for LinkPagamento:', dbErr);
    }

    return NextResponse.json({ preferenceId, initPoint, raw: data });
  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
