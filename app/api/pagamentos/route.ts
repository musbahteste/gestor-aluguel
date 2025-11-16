import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imovelId = searchParams.get('imovelId');

    let query: any = {
      include: { imovel: { include: { locador: true } } },
      orderBy: { dataPagamento: 'desc' },
    };

    if (imovelId) {
      query.where = { imovelId: parseInt(imovelId) };
    }

    const pagamentos = await prisma.pagamento.findMany(query);
    return NextResponse.json(pagamentos);
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pagamentos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const pagamento = await prisma.pagamento.create({
      data: {
        imovelId: parseInt(data.imovelId),
        valor: parseFloat(data.valor),
        dataPagamento: new Date(data.dataPagamento),
        dataVencimento: data.dataVencimento ? new Date(data.dataVencimento) : null,
        descricao: data.descricao || null,
        metodo: data.metodo || 'transferencia',
        status: data.status || 'recebido',
        comprovante: data.comprovante || null,
      },
      include: { imovel: { include: { locador: true } } },
    });

    return NextResponse.json(pagamento, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pagamento' },
      { status: 500 }
    );
  }
}
