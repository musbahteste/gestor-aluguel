import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const imoveis = await prisma.imovel.findMany({ include: { locador: true } });
  return NextResponse.json(imoveis);
}

export async function POST(request: Request) {
  const data = await request.json();
  const imovel = await prisma.imovel.create({ data });
  return NextResponse.json(imovel);
}
