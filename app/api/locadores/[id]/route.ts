import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locadorId = parseInt(id, 10);
    const locador = await prisma.locador.findUnique({
      where: { id: locadorId },
    });

    if (!locador) {
      return NextResponse.json({ error: 'Locador não encontrado' }, { status: 404 });
    }

    return NextResponse.json(locador);
  } catch (error) {
    console.error('Erro ao buscar locador:', error);
    return NextResponse.json({ error: 'Erro ao buscar locador' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locadorId = parseInt(id, 10);
    const data = await request.json();

    const locador = await prisma.locador.update({
      where: { id: locadorId },
      data: {
        nome: data.nome,
        cpf: data.cpf || null,
        email: data.email || null,
        telefone: data.telefone || null,
      },
    });

    return NextResponse.json(locador);
  } catch (error) {
    console.error('Erro ao atualizar locador:', error);
    return NextResponse.json({ error: 'Erro ao atualizar locador' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locadorId = parseInt(id, 10);

    await prisma.locador.delete({
      where: { id: locadorId },
    });

    return NextResponse.json({ message: 'Locador deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar locador:', error);
    return NextResponse.json({ error: 'Erro ao deletar locador' }, { status: 500 });
  }
}
