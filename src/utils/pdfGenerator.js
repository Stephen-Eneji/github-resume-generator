import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async () => {
  const element = document.getElementById('resume');
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    format: 'a4',
    unit: 'mm',
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

  // Add a second page if content exceeds one page
  if (pdfHeight > pdf.internal.pageSize.getHeight()) {
    pdf.addPage();
    pdf.addImage(
      imgData,
      'PNG',
      0,
      -pdf.internal.pageSize.getHeight(),
      pdfWidth,
      pdfHeight
    );
  }

  pdf.save('github-resume.pdf');
}; 