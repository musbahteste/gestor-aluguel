import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const locatarios = await prisma.locatario.findMany({
      orderBy: {
        nome: 'asc',
      },
    });
    return NextResponse.json(locatarios);
  } catch (error) {
    console.error('Erro ao buscar locatários:', error);
    return NextResponse.json({ error: 'Erro ao buscar locatários' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const locatario = await prisma.locatario.create({ data });
    return NextResponse.json(locatario, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar locatário:', error);
    return NextResponse.json({ error: 'Erro ao criar locatário' }, { status: 500 });
  }
}
