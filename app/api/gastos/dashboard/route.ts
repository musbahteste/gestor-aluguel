import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imovelId = searchParams.get('imovelId');
    const mes = searchParams.get('mes') || String(new Date().getMonth() + 1).padStart(2, '0');
    const ano = searchParams.get('ano') || String(new Date().getFullYear());

    // Construir query para gastos do mês/ano
    const dataInicio = new Date(`${ano}-${mes}-01`);
    const dataFim = new Date(parseInt(ano), parseInt(mes), 0);

    let where: any = {
      dataGasto: {
        gte: dataInicio,
        lte: dataFim,
      },
    };

    if (imovelId) {
      where.imovelId = parseInt(imovelId);
    }

    const gastos = await prisma.gasto.findMany({
      where,
      include: { imovel: { include: { locador: true } } },
    });

    // Calcular resumo
    const totalGasto = gastos.reduce((sum, g) => sum + g.valor, 0);
    
    // Gastos por tipo
    const porTipo: Record<string, number> = {};
    gastos.forEach(g => {
      porTipo[g.tipo] = (porTipo[g.tipo] || 0) + g.valor;
    });

    // Gastos por imóvel
    const porImovel: Record<number, { imovel: any; total: number }> = {};
    gastos.forEach(g => {
      if (!porImovel[g.imovelId]) {
        porImovel[g.imovelId] = {
          imovel: g.imovel,
          total: 0,
        };
      }
      porImovel[g.imovelId].total += g.valor;
    });

    const resumo = {
      totalGasto,
      quantidade: gastos.length,
      porTipo,
      porImovel: Object.values(porImovel),
    };

    return NextResponse.json({ resumo, gastos });
  } catch (error) {
    console.error('Erro ao buscar dashboard de gastos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dashboard' },
      { status: 500 }
    );
  }
}
