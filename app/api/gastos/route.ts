import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imovelId = searchParams.get('imovelId');

    let query: any = {
      include: { imovel: { include: { locador: true } } },
      orderBy: { dataGasto: 'desc' },
    };

    if (imovelId) {
      query.where = { imovelId: parseInt(imovelId) };
    }

    const gastos = await prisma.gasto.findMany(query);
    return NextResponse.json(gastos);
  } catch (error) {
    console.error('Erro ao buscar gastos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar gastos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const gasto = await prisma.gasto.create({
      data: {
        imovelId: parseInt(data.imovelId),
        tipo: data.tipo,
        descricao: data.descricao || null,
        valor: parseFloat(data.valor),
        dataGasto: new Date(data.dataGasto),
        arquivo: data.arquivo || null,
      },
      include: { imovel: { include: { locador: true } } },
    });

    return NextResponse.json(gasto, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar gasto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar gasto' },
      { status: 500 }
    );
  }
}
