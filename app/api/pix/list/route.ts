import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const pixs = await prisma.pix.findMany({ orderBy: { createdAt: 'desc' } });

    const accessToken = process.env.MP_ACCESS_TOKEN;

    const results = await Promise.all(
      pixs.map(async (p) => {
        let mpStatus: string | null = null;
        let mpData: any = null;

        try {
          if (p.mpPaymentId && accessToken) {
            const res = await fetch(`https://api.mercadopago.com/v1/payments/${p.mpPaymentId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                accept: 'application/json',
              },
            });

            if (res.ok) {
              mpData = await res.json();
              mpStatus = mpData?.status ?? null;
            } else {
              mpStatus = `error:${res.status}`;
            }
          }
        } catch (err) {
          console.error('Erro consultando MercadoPago para Pix:', err);
        }

        return {
          ...p,
          mpStatus,
          mpData,
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao buscar Pix:', error);
    return NextResponse.json({ error: 'Erro ao buscar Pix' }, { status: 500 });
  }
}
