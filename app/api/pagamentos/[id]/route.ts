import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const id = parseInt(params.id);

    const pagamento = await prisma.pagamento.update({
      where: { id },
      data: {
        valor: data.valor ? parseFloat(data.valor) : undefined,
        dataPagamento: data.dataPagamento ? new Date(data.dataPagamento) : undefined,
        dataVencimento: data.dataVencimento ? new Date(data.dataVencimento) : null,
        descricao: data.descricao,
        metodo: data.metodo,
        status: data.status,
        comprovante: data.comprovante,
      },
      include: { imovel: { include: { locador: true } } },
    });

    return NextResponse.json(pagamento);
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pagamento' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.pagamento.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Pagamento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar pagamento' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const pagamento = await prisma.pagamento.findUnique({
      where: { id },
      include: { imovel: { include: { locador: true } } },
    });

    if (!pagamento) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pagamento);
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pagamento' },
      { status: 500 }
    );
  }
}
