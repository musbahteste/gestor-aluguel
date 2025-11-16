import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mesParam = searchParams.get('mes');
    const anoParam = searchParams.get('ano');
    const imovelIdParam = searchParams.get('imovelId');

    const hoje = new Date();
    const mesAtual = mesParam ? parseInt(mesParam) : hoje.getMonth() + 1;
    const anoAtual = anoParam ? parseInt(anoParam) : hoje.getFullYear();

    // --- Busca a lista de imóveis (para o filtro) ---
    const imoveis = await prisma.imovel.findMany({
      select: { id: true, titulo: true },
      orderBy: { titulo: 'asc' },
    });

    // --- Base para filtros ---
    const whereClause: { [key: string]: any } = {};
    if (imovelIdParam) {
      whereClause.imovelId = parseInt(imovelIdParam);
    }

    // --- Resumo do Mês Selecionado ---
    const dataInicioMes = new Date(anoAtual, mesAtual - 1, 1);
    const dataFimMes = new Date(anoAtual, mesAtual, 0, 23, 59, 59);

    const totalRecebidoMes = await prisma.pagamento.aggregate({
      _sum: { valor: true },
      where: {
        ...whereClause,
        status: 'recebido',
        dataPagamento: {
          gte: dataInicioMes,
          lte: dataFimMes,
        },
      },
    });

    const totalGastoMes = await prisma.gasto.aggregate({
      _sum: { valor: true },
      where: {
        ...whereClause,
        dataGasto: {
          gte: dataInicioMes,
          lte: dataFimMes,
        },
      },
    });

    const resumoAtual = {
      totalRecebido: totalRecebidoMes._sum.valor || 0,
      totalGasto: totalGastoMes._sum.valor || 0,
      saldo: (totalRecebidoMes._sum.valor || 0) - (totalGastoMes._sum.valor || 0),
    };

    // --- Histórico para o Gráfico (Últimos 12 meses) ---
    const historicoAnual = [];
    for (let i = 11; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const ano = data.getFullYear();
      const mes = data.getMonth() + 1;

      const dataInicio = new Date(ano, mes - 1, 1);
      const dataFim = new Date(ano, mes, 0, 23, 59, 59);

      const [recebimentos, gastos] = await Promise.all([
        prisma.pagamento.aggregate({
          _sum: { valor: true },
          where: {
            ...whereClause,
            status: 'recebido',
            dataPagamento: { gte: dataInicio, lte: dataFim },
          },
        }),
        prisma.gasto.aggregate({
          _sum: { valor: true },
          where: { ...whereClause, dataGasto: { gte: dataInicio, lte: dataFim } },
        }),
      ]);

      historicoAnual.push({
        name: `${String(mes).padStart(2, '0')}/${ano}`,
        recebimentos: recebimentos._sum.valor || 0,
        gastos: gastos._sum.valor || 0,
      });
    }

    return NextResponse.json({
      resumoAtual,
      historicoAnual,
      imoveis, // Adiciona a lista de imóveis na resposta
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard geral:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do dashboard' },
      { status: 500 }
    );
  }
}
