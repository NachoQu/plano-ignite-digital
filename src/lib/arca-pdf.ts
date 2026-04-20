// src/lib/arca-pdf.ts
// Generación de PDF de factura ARCA (Monotributo - Factura C)
import jsPDF from "jspdf";
import QRCode from "qrcode";

// Datos del emisor (QUANTIN IGNACIO - Monotributo)
export const EMISOR = {
  razonSocial: "QUANTIN, IGNACIO",
  cuit: "20357947783",
  domicilio: "J. de la Cruz Casas 772",
  localidad: "Luján, Buenos Aires",
  condicionIVA: "Responsable Monotributo",
  inicioActividades: "01/01/2020",
  ingresosBrutos: "Convenio Multilateral",
};

const TIPO_CBTE_LABEL: Record<number, { letra: string; nombre: string; codigo: string }> = {
  1: { letra: "A", nombre: "FACTURA", codigo: "01" },
  6: { letra: "B", nombre: "FACTURA", codigo: "06" },
  11: { letra: "C", nombre: "FACTURA", codigo: "11" },
  51: { letra: "M", nombre: "FACTURA", codigo: "51" },
};

const DOC_TIPO_LABEL: Record<number, string> = {
  80: "CUIT",
  86: "CUIL",
  96: "DNI",
  99: "Consumidor Final",
};

export interface FacturaPdfData {
  ptoVta: number;
  cbteTipo: number;
  cbteNro: number;
  cbteFch: string; // YYYYMMDD
  cae: string;
  caeFchVto: string; // YYYYMMDD
  importe: number;
  docTipo: number;
  docNro: number | string;
  concepto?: string;
  clienteNombre?: string;
  clienteDomicilio?: string;
}

function formatFecha(yyyymmdd: string): string {
  if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd || "";
  return `${yyyymmdd.slice(6, 8)}/${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(0, 4)}`;
}

function formatMoney(n: number): string {
  return n.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function pad(num: number, width: number): string {
  return String(num).padStart(width, "0");
}

// Genera la URL del QR oficial de ARCA
async function generarQrArca(data: FacturaPdfData): Promise<string> {
  const fechaIso = `${data.cbteFch.slice(0, 4)}-${data.cbteFch.slice(4, 6)}-${data.cbteFch.slice(6, 8)}`;
  const payload = {
    ver: 1,
    fecha: fechaIso,
    cuit: Number(EMISOR.cuit),
    ptoVta: data.ptoVta,
    tipoCmp: data.cbteTipo,
    nroCmp: data.cbteNro,
    importe: data.importe,
    moneda: "PES",
    ctz: 1,
    tipoDocRec: data.docTipo,
    nroDocRec: Number(data.docNro) || 0,
    tipoCodAut: "E",
    codAut: Number(data.cae),
  };
  const b64 = btoa(JSON.stringify(payload));
  const url = `https://www.afip.gob.ar/fe/qr/?p=${b64}`;
  return await QRCode.toDataURL(url, { margin: 0, width: 180 });
}

export async function generarFacturaPdf(data: FacturaPdfData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 10;
  const tipo = TIPO_CBTE_LABEL[data.cbteTipo] ?? {
    letra: "?",
    nombre: "COMPROBANTE",
    codigo: String(data.cbteTipo),
  };

  // ───── Encabezado: caja con letra ─────
  // Caja izquierda (emisor)
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.rect(margin, margin, 95, 45);

  // Caja letra (centro)
  doc.rect(margin + 95, margin, 20, 25);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(tipo.letra, margin + 95 + 10, margin + 17, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`COD. ${tipo.codigo}`, margin + 95 + 10, margin + 22, { align: "center" });

  // Caja derecha (datos comprobante)
  doc.rect(margin + 115, margin, 85, 45);

  // Datos emisor (izquierda)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(EMISOR.razonSocial, margin + 3, margin + 8);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(`Razón Social: ${EMISOR.razonSocial}`, margin + 3, margin + 16);
  doc.text(`Domicilio Comercial: ${EMISOR.domicilio}`, margin + 3, margin + 21);
  doc.text(EMISOR.localidad, margin + 3, margin + 26);
  doc.text(`Condición frente al IVA: ${EMISOR.condicionIVA}`, margin + 3, margin + 31);

  // Datos comprobante (derecha)
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`${tipo.nombre} ${tipo.letra}`, margin + 117, margin + 7);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `N°: ${pad(data.ptoVta, 4)}-${pad(data.cbteNro, 8)}`,
    margin + 117,
    margin + 14
  );
  doc.setFontSize(8);
  doc.text(`Fecha de Emisión: ${formatFecha(data.cbteFch)}`, margin + 117, margin + 20);
  doc.text(`CUIT: ${EMISOR.cuit}`, margin + 117, margin + 25);
  doc.text(`Ingresos Brutos: ${EMISOR.ingresosBrutos}`, margin + 117, margin + 30);
  doc.text(`Inicio de Actividades: ${EMISOR.inicioActividades}`, margin + 117, margin + 35);

  // ───── Datos receptor ─────
  let y = margin + 50;
  doc.rect(margin, y, pageW - margin * 2, 18);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const docTipoLabel = DOC_TIPO_LABEL[data.docTipo] ?? `Doc tipo ${data.docTipo}`;
  doc.text(`${docTipoLabel}:`, margin + 3, y + 5);
  doc.setFont("helvetica", "normal");
  doc.text(
    data.docTipo === 99 ? "Consumidor Final" : String(data.docNro),
    margin + 30,
    y + 5
  );
  doc.setFont("helvetica", "bold");
  doc.text("Apellido y Nombre / Razón Social:", margin + 3, y + 10);
  doc.setFont("helvetica", "normal");
  doc.text(data.clienteNombre || "Consumidor Final", margin + 60, y + 10);
  doc.setFont("helvetica", "bold");
  doc.text("Condición frente al IVA:", margin + 3, y + 15);
  doc.setFont("helvetica", "normal");
  doc.text("Consumidor Final", margin + 38, y + 15);
  doc.setFont("helvetica", "bold");
  doc.text("Domicilio:", margin + 110, y + 15);
  doc.setFont("helvetica", "normal");
  doc.text(data.clienteDomicilio || "-", margin + 128, y + 15);

  // ───── Detalle ─────
  y += 22;
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, pageW - margin * 2, 7, "F");
  doc.rect(margin, y, pageW - margin * 2, 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Cantidad", margin + 3, y + 5);
  doc.text("Descripción", margin + 25, y + 5);
  doc.text("Precio Unit.", margin + 130, y + 5, { align: "right" });
  doc.text("Subtotal", margin + 190, y + 5, { align: "right" });

  // Fila item
  y += 7;
  doc.rect(margin, y, pageW - margin * 2, 60);
  doc.setFont("helvetica", "normal");
  doc.text("1", margin + 3, y + 6);
  doc.text(data.concepto || "Servicios profesionales", margin + 25, y + 6);
  doc.text(`$ ${formatMoney(data.importe)}`, margin + 130, y + 6, { align: "right" });
  doc.text(`$ ${formatMoney(data.importe)}`, margin + 190, y + 6, { align: "right" });

  // ───── Totales ─────
  y += 65;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Importe Total:", margin + 130, y, { align: "right" });
  doc.text(`$ ${formatMoney(data.importe)}`, margin + 190, y, { align: "right" });

  // ───── QR + CAE ─────
  y += 10;
  const qrDataUrl = await generarQrArca(data);
  doc.addImage(qrDataUrl, "PNG", margin, y, 35, 35);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("CAE N°:", margin + 40, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text(data.cae, margin + 60, y + 8);
  doc.setFont("helvetica", "bold");
  doc.text("Fecha de Vto. de CAE:", margin + 40, y + 14);
  doc.setFont("helvetica", "normal");
  doc.text(formatFecha(data.caeFchVto), margin + 80, y + 14);

  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Comprobante autorizado electrónicamente por ARCA (AFIP).",
    margin + 40,
    y + 25
  );
  doc.text(
    "Verificable en: https://www.afip.gob.ar/fe/qr/",
    margin + 40,
    y + 29
  );

  return doc;
}

// Extrae los datos del response de "facturar" para armar el PDF
export function extraerDatosFacturar(
  response: any,
  payload: { puntoVenta: number; tipoCbte: number; importe: number; docTipo: number; docNro: number | string }
): FacturaPdfData | null {
  const cab = response?.result?.FECAESolicitarResult?.FeCabResp;
  const det = response?.result?.FECAESolicitarResult?.FeDetResp?.FECAEDetResponse?.[0];
  if (!cab || !det) return null;
  return {
    ptoVta: cab.PtoVta,
    cbteTipo: cab.CbteTipo,
    cbteNro: det.CbteDesde,
    cbteFch: String(det.CbteFch),
    cae: String(det.CAE),
    caeFchVto: String(det.CAEFchVto),
    importe: Number(payload.importe),
    docTipo: Number(payload.docTipo),
    docNro: payload.docNro,
  };
}
