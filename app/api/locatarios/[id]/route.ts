import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locatarioId = parseInt(id, 10);
    const locatario = await prisma.locatario.findUnique({
      where: { id: locatarioId },
    });

    if (!locatario) {
      return NextResponse.json({ error: 'Locatário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(locatario);
  } catch (error) {
    console.error('Erro ao buscar locatário:', error);
    return NextResponse.json({ error: 'Erro ao buscar locatário' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locatarioId = parseInt(id, 10);
    const data = await request.json();

    const locatario = await prisma.locatario.update({
      where: { id: locatarioId },
      data: {
        nome: data.nome,
        cpf: data.cpf || null,
        email: data.email || null,
        telefone: data.telefone || null,
      },
    });

    return NextResponse.json(locatario);
  } catch (error) {
    console.error('Erro ao atualizar locatário:', error);
    return NextResponse.json({ error: 'Erro ao atualizar locatário' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locatarioId = parseInt(id, 10);

    await prisma.locatario.delete({
      where: { id: locatarioId },
    });

    return NextResponse.json({ message: 'Locatário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar locatário:', error);
    return NextResponse.json({ error: 'Erro ao deletar locatário' }, { status: 500 });
  }
}
