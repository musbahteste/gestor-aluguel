import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const links = await prisma.linkPagamento.findMany({ orderBy: { createdAt: 'desc' } });

    const accessToken = process.env.MP_ACCESS_TOKEN;

    const results = await Promise.all(
      links.map(async (l) => {
        let mpStatus: string | null = null;
        let mpData: any = null;

        try {
          if (l.preferenceId && accessToken) {
            const url = `https://api.mercadopago.com/v1/payments/search?preference_id=${encodeURIComponent(
              l.preferenceId
            )}`;

            const res = await fetch(url, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                accept: 'application/json',
              },
            });

            if (res.ok) {
              mpData = await res.json();
              const first = Array.isArray(mpData.results) && mpData.results.length > 0 ? mpData.results[0] : null;
              mpStatus = first?.status ?? null;

              // Map status using requested logic
              const payment = first;
              const paymentId = payment?.id ?? null;
              const paymentType = payment?.payment_type_id ?? null;
              const externalRef = payment?.external_reference ?? null;

              let statusLabel = null;
              let statusEmoji = null;
              let statusMessage = null;

              if (mpStatus === 'approved') {
                statusLabel = 'approved';
                statusEmoji = '🟢';
                statusMessage = 'APROVADO - Prossiga com a entrega.';
              } else if (mpStatus === 'pending') {
                statusLabel = 'pending';
                statusEmoji = '🟡';
                statusMessage = 'PENDENTE - Aguardando compensação.';
              } else if (mpStatus === 'in_process') {
                statusLabel = 'in_process';
                statusEmoji = '🟡';
                statusMessage = 'EM PROCESSAMENTO - Aguardando autorização.';
              } else if (mpStatus === 'rejected') {
                statusLabel = 'rejected';
                statusEmoji = '🔴';
                statusMessage = 'REJEITADO - Não foi possível processar o pagamento.';
              } else if (mpStatus) {
                statusLabel = mpStatus;
                statusEmoji = '🔵';
                statusMessage = `STATUS: ${mpStatus.toUpperCase()}`;
              }

              // attach mapped values to mpData for client convenience
              mpData._mapped = {
                paymentId,
                paymentType,
                externalRef,
                statusLabel,
                statusEmoji,
                statusMessage,
              };
            } else {
              mpStatus = `error:${res.status}`;
            }
          }
        } catch (err) {
          console.error('Erro consultando MercadoPago para LinkPagamento:', err);
        }

        return {
          ...l,
          mpStatus,
          mpData,
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao buscar LinkPagamento:', error);
    return NextResponse.json({ error: 'Erro ao buscar LinkPagamento' }, { status: 500 });
  }
}
