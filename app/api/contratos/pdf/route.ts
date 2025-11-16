import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
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

  // Função para formatar a data
  const dataGeracao = new Date(contrato.dataGeracao);
  const dataFormatada = dataGeracao.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const dataPorExtenso = dataGeracao.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });


  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pageHeight = 842;
  const pageWidth = 595;
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 60;

  page.drawText('Contrato de Aluguel', {
    x: 50,
    y,
    size: 24,
    font,
    color: rgb(37/255, 99/255, 235/255),
  });

  y -= 40;

  // Substitui as variáveis de data no conteúdo do contrato
  const conteudoFinal = contrato.conteudoGerado
    .replace(/{{contrato.dataGeracao}}/g, dataFormatada)
    .replace(/{{contrato.dataGeracaoExtenso}}/g, dataPorExtenso);
  // Quebra o texto em blocos separados por linhas em branco
  const blocks = conteudoFinal.split(/\n\s*\n/);
  const lineHeight = 16;
  const fontSize = 12;
  const maxWidth = pageWidth - 100;

  for (const block of blocks) {
    // Quebra o bloco em linhas por \n para respeitar quebras de linha do texto
    const rawLines = block.split(/\n/);
    let lines: string[] = [];
    for (const rawLine of rawLines) {
      let words = rawLine.split(/\s+/);
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
    }

    for (const line of lines) {
      if (y < 60) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - 60;
      }
      page.drawText(line, {
        x: 50,
        y,
        size: fontSize,
        font,
        maxWidth,
      });
      y -= lineHeight;
    }
    // Espaço extra entre blocos
    y -= lineHeight;
  }

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=contrato-${contrato.id}.pdf`,
    },
  });
}
