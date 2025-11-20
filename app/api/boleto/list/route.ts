import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const boletos = await prisma.boleto.findMany({ orderBy: { createdAt: 'desc' } });

    const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

    const results = await Promise.all(
      boletos.map(async (b) => {
        let mpData: any = null;
        let status: string | null = null;
        try {
          if (ACCESS_TOKEN) {
            const res = await fetch(`https://api.mercadopago.com/v1/payments/${b.mpPaymentId}`, {
              headers: { Authorization: `Bearer ${ACCESS_TOKEN}`, accept: 'application/json' },
            });
            if (res.ok) {
              mpData = await res.json();
              status = mpData?.status ?? null;
            } else {
              mpData = { error: `MP returned ${res.status}` };
            }
          } else {
            mpData = { error: 'Missing MP_ACCESS_TOKEN' };
          }
        } catch (err: any) {
          mpData = { error: String(err) };
        }

        return {
          id: b.id,
          mpPaymentId: b.mpPaymentId,
          vencimento: b.vencimento,
          url: b.url,
          valor: b.valor,
          payerFirstName: b.payerFirstName,
          payerLastName: b.payerLastName,
          barcode: b.barcode,
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
          mpStatus: status,
          mpData,
        };
      })
    );

    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error('Erro ao listar boletos:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
