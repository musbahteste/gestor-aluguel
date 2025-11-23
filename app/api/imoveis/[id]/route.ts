import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imovelId = parseInt(id, 10);
    const imovel = await prisma.imovel.findUnique({
      where: { id: imovelId },
    });

    if (!imovel) {
      return NextResponse.json({ error: 'Imóvel não encontrado' }, { status: 404 });
    }

    return NextResponse.json(imovel);
  } catch (error) {
    console.error('Erro ao buscar imóvel:', error);
    return NextResponse.json({ error: 'Erro ao buscar imóvel' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imovelId = parseInt(id, 10);
    const data = await request.json();

    const imovelData: Prisma.ImovelUpdateInput = {
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

    // Conecta ou desconecta do locador
    if (data.locadorId) {
      imovelData.locador = { connect: { id: parseInt(data.locadorId) } };
    } else {
      imovelData.locador = { disconnect: true };
    }

    const imovel = await prisma.imovel.update({
      where: { id: imovelId },
      data: imovelData,
    });

    return NextResponse.json(imovel);
  } catch (error) {
    console.error('Erro ao atualizar imóvel:', error);
    return NextResponse.json({ error: 'Erro ao atualizar imóvel' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const imovelId = parseInt(id, 10);

    await prisma.imovel.delete({
      where: { id: imovelId },
    });

    return NextResponse.json({ message: 'Imóvel deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar imóvel:', error);
    return NextResponse.json({ error: 'Erro ao deletar imóvel' }, { status: 500 });
  }
}
