import { NextResponse } from 'next/server';
// --- ESTA É A LINHA QUE PROVAVELMENTE ESTÁ FALTANDO ---
import { prisma } from '../../../../lib/prisma';
// Ajuste o caminho '../..' se necessário

// FUNÇÃO GET (Para listar todos os gastos em GastoList.tsx)
export async function GET(request: Request) {
  try {
    const gastos = await prisma.gasto.findMany({
      include: {
        imovel: {
          include: {
            locador: true,
          },
        },
      },
      orderBy: {
        dataGasto: 'desc', // Exemplo de ordenação
      },
    });
    return NextResponse.json(gastos);
  } catch (error) {
    console.error('Erro ao buscar gastos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar gastos' },
      { status: 500 }
    );
  }
}

// FUNÇÃO POST (Onde o seu erro está acontecendo)
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Verifique se o prisma foi importado. Se sim, isso agora deve funcionar.
    const gasto = await prisma.gasto.create({
      data: {
        imovelId: parseInt(data.imovelId),
        tipo: data.tipo,
        descricao: data.descricao || null,
        valor: parseFloat(data.valor), // Certifique-se de converter o valor
        dataGasto: new Date(data.dataGasto), // E a data
        arquivo: data.arquivo || null,
        // Adicione outros campos necessários
      },
    });

    return NextResponse.json(gasto, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Erro ao criar gasto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar gasto' },
      { status: 500 }
    );
  }
}