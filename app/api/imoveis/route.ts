import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const imoveis = await prisma.imovel.findMany({
      orderBy: {
        titulo: 'asc',
      },
    });
    return NextResponse.json(imoveis);
  } catch (error) {
    console.error('Erro ao buscar imóveis:', error);
    return NextResponse.json({ error: 'Erro ao buscar imóveis' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const imovelData: Prisma.ImovelCreateInput = {
      titulo: data.titulo,
      descricao: data.descricao || null,
      endereco: data.endereco,
      cidade: data.cidade || null,
      bairro: data.bairro || null,
      cep: data.cep || null,
      valorAluguel: parseFloat(data.valorAluguel),
      area: data.area ? parseFloat(data.area) : null,
      quartos: data.quartos ? parseInt(data.quartos) : null,
      banheiros: data.banheiros ? parseInt(data.banheiros) : null,
      garagem: data.garagem || false,
    };

    // Conecta ao locador apenas se um ID válido for fornecido
    if (data.locadorId) {
      imovelData.locador = { connect: { id: parseInt(data.locadorId) } };
    }

    const imovel = await prisma.imovel.create({ data: imovelData });
    return NextResponse.json(imovel, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar imóvel:', error);
    return NextResponse.json({ error: 'Erro ao criar imóvel' }, { status: 500 });
  }
}
