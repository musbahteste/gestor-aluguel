import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const locadores = await prisma.locador.findMany();
  return NextResponse.json(locadores);
}

export async function POST(request: Request) {
  const data = await request.json();
  const locador = await prisma.locador.create({ data });
  return NextResponse.json(locador);
}
