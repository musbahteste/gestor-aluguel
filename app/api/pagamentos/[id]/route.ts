// 1. Importado "NextRequest" além do "NextResponse"
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PUT(
  // 2. "request" agora é do tipo "NextRequest"
  request: NextRequest,
  // 3. O segundo argumento é "context", que contém os "params"
  context: { params: { id: string } }
) {
  try {
    const data = await request.json();
    // 4. "id" é acessado via "context.params.id"
    const id = parseInt(context.params.id);

    const pagamento = await prisma.pagamento.update({
      where: { id },
      data: {
        valor: data.valor ? parseFloat(data.valor) : undefined,
        dataPagamento: data.dataPagamento
          ? new Date(data.dataPagamento)
          : undefined,
        dataVencimento: data.dataVencimento
          ? new Date(data.dataVencimento)
          : null,
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
  // 2. "request" agora é do tipo "NextRequest"
  request: NextRequest,
  // 3. O segundo argumento é "context", que contém os "params"
  context: { params: { id: string } }
) {
  try {
    // 4. "id" é acessado via "context.params.id"
    const id = parseInt(context.params.id);

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
  // 2. "request" agora é do tipo "NextRequest"
  request: NextRequest,
  // 3. O segundo argumento é "context", que contém os "params"
  context: { params: { id: string } }
) {
  try {
    // 4. "id" é acessado via "context.params.id"
    const id = parseInt(context.params.id);

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