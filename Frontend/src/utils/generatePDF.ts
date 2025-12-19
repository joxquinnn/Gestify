import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export const generarPDFOrden = (orden: any, config: any) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // --- ENCABEZADO ---
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text(config.nombreNegocio, 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`RUT: ${config.rut}`, 14, 28);
  doc.text(`Dirección: ${config.direccion}`, 14, 33);
  doc.text(`Contacto: ${config.telefono} | ${config.email}`, 14, 38);

  // --- TÍTULO Y FOLIO ---
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(1);
  doc.line(14, 45, 196, 45);

  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('ORDEN DE SERVICIO TÉCNICO', 14, 55);
  doc.text(`FOLIO: ${orden.id}`, 150, 55);

  // --- TABLA 1: DATOS ---
  autoTable(doc, {
    startY: 65,
    head: [['Información del Cliente', 'Detalles del Dispositivo']],
    body: [
      [
        `Nombre: ${orden.cliente}\nTeléfono: ${orden.telefono}`,
        `Equipo: ${orden.dispositivo}\nModelo: ${orden.marcaModelo}\nAccesorios: ${orden.accesorios || 'Ninguno'}`
      ]
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] }
  });

  // --- TABLA 2: FALLA ---
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 10,
    head: [['Descripción del Problema / Falla Reportada']],
    body: [[orden.fallaReportada || 'No especificada']],
    theme: 'plain',
    headStyles: { fillColor: [241, 245, 249], textColor: [0, 0, 0] }
  });

  // --- TOTAL ---
  const currentY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(`TOTAL A PAGAR: $${orden.total.toLocaleString()}`, 140, currentY);

  // --- SECCIÓN: OBSERVACIONES Y CONDICIONES ---
  const obsY = currentY + 15;
  doc.setFontSize(10);
  doc.setTextColor(40);
  doc.setFont("helvetica", "bold");
  doc.text("OBSERVACIONES Y CONDICIONES:", 14, obsY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60);
  
  doc.text("1. El costo de revisión para teléfonos es de $3.000 y para computadores es de $5.000.", 14, obsY + 6);
  
  const textoRetiro = "2. Una vez notificado que el equipo está listo para retiro, el cliente tiene un plazo de 60 días para retirarlo. Cumplido el plazo, el taller no se hace responsable por el equipo.";
  const lineasRetiro = doc.splitTextToSize(textoRetiro, 180);
  doc.text(lineasRetiro, 14, obsY + 12);

  // --- SECCIÓN: FIRMAS ---
  const firmaY = obsY + 40;
  doc.setDrawColor(150);
  doc.setLineWidth(0.5);
  
  // Línea Cliente
  doc.line(30, firmaY, 80, firmaY);
  doc.setFontSize(10);
  doc.text('Firma Cliente', 43, firmaY + 5);

  // Línea Técnico
  doc.line(130, firmaY, 180, firmaY);
  doc.text('Firma Técnico', 143, firmaY + 5);

  // --- DESCARGAR ---
  doc.save(`Orden_${orden.id}_${orden.cliente}.pdf`);
};