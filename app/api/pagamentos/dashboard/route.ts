import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mes = searchParams.get('mes');
    const ano = searchParams.get('ano');
    const imovelId = searchParams.get('imovelId');
    const locatarioId = searchParams.get('locatarioId');

    let whereClause: any = {};

    if (mes && ano) {
      const mesNum = parseInt(mes);
      const anoNum = parseInt(ano);
      
      const dataInicio = new Date(anoNum, mesNum - 1, 1);
      const dataFim = new Date(anoNum, mesNum, 0, 23, 59, 59);

      whereClause = {
        dataPagamento: {
          gte: dataInicio,
          lte: dataFim,
        },
      };
    }

    if (imovelId) {
      whereClause.imovelId = parseInt(imovelId);
    }

    if (locatarioId) {
      whereClause.locatarioId = parseInt(locatarioId);
    }

    // Dados de pagamentos
    const pagamentos = await prisma.pagamento.findMany({
      where: whereClause,
      include: {
        imovel: {
          include: { locador: true },
        },
        locatario: true,
      },
      orderBy: { dataPagamento: 'desc' },
    });

    // Calcular totais
    // Normaliza status para lidar com variações (ex: 'PAGO' do frontend)
    const totalRecebido = pagamentos
      .filter((p: any) => {
        const s = String(p.status || '').toLowerCase();
        return s === 'recebido' || s === 'pago' || s === 'paid' || s === 'confirmado';
      })
      .reduce((sum: number, p: any) => sum + p.valor, 0);

    const totalPendente = pagamentos
      .filter((p: any) => {
        const s = String(p.status || '').toLowerCase();
        return s === 'pendente' || s === 'pending';
      })
      .reduce((sum: number, p: any) => sum + p.valor, 0);

    const totalAtrasado = pagamentos
      .filter((p: any) => {
        const s = String(p.status || '').toLowerCase();
        return s === 'atrasado' || s === 'overdue' || s === 'atrasado';
      })
      .reduce((sum: number, p: any) => sum + p.valor, 0);

    // Garante que totalGeral reflita a soma de todos os pagamentos retornados
    const totalGeral = pagamentos.reduce((sum: number, p: any) => sum + p.valor, 0);

    // Agrupar por método de pagamento
    // Corrigir método de pagamento para refletir o método real
    const porMetodo = pagamentos.reduce((acc: Record<string, number>, p: any) => {
      const metodo = p.metodo === 'conta-receber' ? p.descricao.split(' ')[2] : p.metodo || 'Não especificado';
      if (!acc[metodo]) {
        acc[metodo] = 0;
      }
      acc[metodo] += p.valor;
      return acc;
    }, {} as Record<string, number>);

    // Agrupar por imóvel
    const porImovel = pagamentos.reduce((acc: Record<number, any>, p: any) => {
      if (!acc[p.imovel.id]) {
        acc[p.imovel.id] = {
          imovel: p.imovel,
          total: 0,
        };
      }
      acc[p.imovel.id].total += p.valor;
      return acc;
    }, {} as Record<number, any>);

    return NextResponse.json({
      pagamentos,
      resumo: {
        totalRecebido,
        totalPendente,
        totalAtrasado,
        totalGeral: totalRecebido + totalPendente + totalAtrasado,
        porMetodo,
        porImovel: Object.values(porImovel),
        quantidade: pagamentos.length,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do dashboard' },
      { status: 500 }
    );
  }
}
