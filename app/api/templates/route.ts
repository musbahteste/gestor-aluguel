import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  const templates = await prisma.contratoTemplate.findMany();
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const data = await request.json();
  const template = await prisma.contratoTemplate.create({ data });
  return NextResponse.json(template);
}
