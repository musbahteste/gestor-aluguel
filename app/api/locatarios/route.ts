import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  const locatarios = await prisma.locatario.findMany();
  return NextResponse.json(locatarios);
}

export async function POST(request: Request) {
  const data = await request.json();
  const locatario = await prisma.locatario.create({ data });
  return NextResponse.json(locatario);
}
