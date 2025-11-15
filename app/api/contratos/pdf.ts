import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function POST(request: Request) {
  const { contratoId } = await request.json();
  const contrato = await prisma.contrato.findUnique({
    where: { id: contratoId },
    include: { imovel: true, locador: true, locatario: true, template: true },
  });

  if (!contrato) {
    return NextResponse.json({ error: 'Contrato não encontrado' }, { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  page.drawText('Contrato de Aluguel', {
    x: 50,
    y: height - 60,
    size: 24,
    font,
    color: rgb(37/255, 99/255, 235/255),
  });

  page.drawText(contrato.conteudoGerado, {
    x: 50,
    y: height - 100,
    size: 12,
    font,
    maxWidth: width - 100,
    lineHeight: 16,
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=contrato-${contrato.id}.pdf`,
    },
  });
}
