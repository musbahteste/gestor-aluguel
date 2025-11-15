import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

function preencherTemplate(template: string, imovel: any, locador: any, locatario: any) {
  return template
    .replace(/{{imovel.titulo}}/g, imovel.titulo)
    .replace(/{{imovel.descricao}}/g, imovel.descricao || '')
    .replace(/{{imovel.endereco}}/g, imovel.endereco)
    .replace(/{{imovel.cidade}}/g, imovel.cidade || '')
    .replace(/{{imovel.bairro}}/g, imovel.bairro || '')
    .replace(/{{imovel.cep}}/g, imovel.cep || '')
    .replace(/{{imovel.valorAluguel}}/g, imovel.valorAluguel)
    .replace(/{{imovel.area}}/g, imovel.area || '')
    .replace(/{{imovel.quartos}}/g, imovel.quartos || '')
    .replace(/{{imovel.banheiros}}/g, imovel.banheiros || '')
    .replace(/{{imovel.garagem}}/g, imovel.garagem ? 'Sim' : 'Não')
    .replace(/{{locador.nome}}/g, locador.nome)
    .replace(/{{locador.cpf}}/g, locador.cpf || '')
    .replace(/{{locador.email}}/g, locador.email || '')
    .replace(/{{locador.telefone}}/g, locador.telefone || '')
    .replace(/{{locatario.nome}}/g, locatario.nome)
    .replace(/{{locatario.cpf}}/g, locatario.cpf || '')
    .replace(/{{locatario.email}}/g, locatario.email || '')
    .replace(/{{locatario.telefone}}/g, locatario.telefone || '');
}

export async function GET() {
  const contratos = await prisma.contrato.findMany({ include: { imovel: true, locador: true, locatario: true, template: true } });
  return NextResponse.json(contratos);
}

export async function POST(request: Request) {
  const data = await request.json();
  const template = await prisma.contratoTemplate.findUnique({ where: { id: data.templateId } });
  const imovel = await prisma.imovel.findUnique({ where: { id: data.imovelId } });
  const locador = await prisma.locador.findUnique({ where: { id: data.locadorId } });
  const locatario = await prisma.locatario.findUnique({ where: { id: data.locatarioId } });

  if (!template || !imovel || !locador || !locatario) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  const conteudoGerado = preencherTemplate(template.conteudo, imovel, locador, locatario);

  const contrato = await prisma.contrato.create({
    data: {
      templateId: data.templateId,
      imovelId: data.imovelId,
      locadorId: data.locadorId,
      locatarioId: data.locatarioId,
      conteudoGerado,
    },
  });
  return NextResponse.json(contrato);
}
