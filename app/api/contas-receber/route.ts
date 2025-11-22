import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const contas = await prisma.contaReceber.findMany({
    include: { contrato: true },
  });
  return NextResponse.json(contas);
}

export async function PATCH(request: Request) {
  const data = await request.json();

  const conta = await prisma.contaReceber.update({
    where: { id: data.id },
    data: {
      status: 'recebido',
      dataRecebimento: new Date(),
    },
    include: {
      contrato: true, // Inclui o relacionamento com o contrato
    },
  });

  // Criar entrada no modelo Pagamento
  await prisma.pagamento.create({
    data: {
      imovelId: conta.contrato.imovelId,
      valor: conta.valor,
      dataPagamento: new Date(),
      descricao: `Pagamento referente à conta #${conta.id}`,
      metodo: data.metodo,
      status: 'recebido',
    },
  });

  return NextResponse.json(conta);
}