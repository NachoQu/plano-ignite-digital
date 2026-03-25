import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PlanoLogo from "@/components/PlanoLogo";
import { FileText, Search, Hash, LogOut, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface InvoiceData {
  puntoVenta: string;
  tipoComprobante: string;
  concepto: string;
  docTipo: string;
  docNro: string;
  importeTotal: string;
  importeNeto: string;
  importeIva: string;
}

interface Comprobante {
  tipo: number;
  puntoVenta: number;
  numero: number;
  fecha: string;
  importeTotal: number;
  cae: string;
  caeFchVto: string;
}

interface UltimoItem {
  tipoKey: string;
  tipoNombre: string;
  numero: number;
}

const TIPOS_COMPROBANTE: Record<string, string> = {
  "1": "Factura A",
  "6": "Factura B",
  "11": "Factura C",
  "2": "Nota de Débito A",
  "3": "Nota de Crédito A",
  "7": "Nota de Débito B",
  "8": "Nota de Crédito B",
  "12": "Nota de Débito C",
  "13": "Nota de Crédito C",
};

// Factura C (monotributo) no lleva IVA
const TIPOS_SIN_IVA = new Set(["11", "12", "13"]);

const Facturacion = () => {
  const { user, loading: authLoading, signOut } = useAuth("/login");
  const [activeTab, setActiveTab] = useState("emitir");
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    puntoVenta: "1",
    tipoComprobante: "11",
    concepto: "2",
    docTipo: "80",
    docNro: "",
    importeTotal: "",
    importeNeto: "",
    importeIva: "0",
  });
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
  const [comprobantesSearched, setComprobantesSearched] = useState(false);
  const [ultimosTodos, setUltimosTodos] = useState<UltimoItem[]>([]);
  const [ultimoSingle, setUltimoSingle] = useState<{ numero: number; tipo: string; puntoVenta: number } | null>(null);
  const [ultimoSearched, setUltimoSearched] = useState(false);
  const [consultaPV, setConsultaPV] = useState("1");
  const [consultaTipo, setConsultaTipo] = useState("0");
  const [error, setError] = useState("");

  const callArcaFunction = async (action: string, body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("arca-facturacion", {
      body: { action, ...body },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  };

  // Recalcula IVA y total cuando cambia el neto o el tipo de comprobante
  const handleNetoChange = (neto: string, tipoComprobante: string) => {
    const netoNum = parseFloat(neto) || 0;
    const sinIva = TIPOS_SIN_IVA.has(tipoComprobante);
    const iva = sinIva ? 0 : Math.round(netoNum * 21) / 100;
    const total = netoNum + iva;
    setInvoiceData((prev) => ({
      ...prev,
      importeNeto: neto,
      importeIva: sinIva ? "0" : iva > 0 ? iva.toFixed(2) : prev.importeIva,
      importeTotal: total > 0 ? total.toFixed(2) : prev.importeTotal,
    }));
  };

  // Cuando cambia el tipo, recalcula IVA con el neto actual
  const handleTipoChange = (tipo: string) => {
    const netoNum = parseFloat(invoiceData.importeNeto) || 0;
    const sinIva = TIPOS_SIN_IVA.has(tipo);
    const iva = sinIva ? 0 : Math.round(netoNum * 21) / 100;
    const total = netoNum + iva;
    setInvoiceData((prev) => ({
      ...prev,
      tipoComprobante: tipo,
      importeIva: sinIva ? "0" : netoNum > 0 ? iva.toFixed(2) : prev.importeIva,
      importeTotal: netoNum > 0 ? total.toFixed(2) : prev.importeTotal,
    }));
  };

  const handleEmitir = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await callArcaFunction("emitir", {
        puntoVenta: parseInt(invoiceData.puntoVenta),
        tipoComprobante: parseInt(invoiceData.tipoComprobante),
        concepto: parseInt(invoiceData.concepto),
        docTipo: parseInt(invoiceData.docTipo),
        docNro: invoiceData.docNro,
        importeTotal: parseFloat(invoiceData.importeTotal),
        importeNeto: parseFloat(invoiceData.importeNeto),
        importeIva: parseFloat(invoiceData.importeIva),
      });

      toast.success(`Comprobante emitido — CAE: ${result.cae}`);
      setInvoiceData((prev) => ({
        ...prev,
        docNro: "",
        importeTotal: "",
        importeNeto: "",
        importeIva: TIPOS_SIN_IVA.has(prev.tipoComprobante) ? "0" : "",
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      toast.error("Error al emitir comprobante");
    } finally {
      setLoading(false);
    }
  };

  const handleConsultarComprobantes = async () => {
    setLoading(true);
    setError("");
    setComprobantes([]);
    setComprobantesSearched(false);

    try {
      const pv = parseInt(consultaPV);

      if (consultaTipo === "0") {
        // Consultar todos los tipos en paralelo
        const resultados = await Promise.allSettled(
          Object.keys(TIPOS_COMPROBANTE).map((tipo) =>
            callArcaFunction("consultar", { puntoVenta: pv, tipoComprobante: parseInt(tipo) })
          )
        );
        const todos: Comprobante[] = resultados.flatMap((r) =>
          r.status === "fulfilled" ? (r.value.comprobantes || []) : []
        );
        // Ordenar por número descendente
        todos.sort((a, b) => b.numero - a.numero);
        setComprobantes(todos);
      } else {
        const result = await callArcaFunction("consultar", {
          puntoVenta: pv,
          tipoComprobante: parseInt(consultaTipo),
        });
        setComprobantes(result.comprobantes || []);
      }

      setComprobantesSearched(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      setComprobantesSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUltimoComprobante = async () => {
    setLoading(true);
    setError("");
    setUltimoSingle(null);
    setUltimosTodos([]);
    setUltimoSearched(false);

    try {
      const pv = parseInt(consultaPV);

      if (consultaTipo === "0") {
        // Consultar todos los tipos en paralelo
        const entries = Object.entries(TIPOS_COMPROBANTE);
        const resultados = await Promise.allSettled(
          entries.map(([tipo]) =>
            callArcaFunction("ultimo", { puntoVenta: pv, tipoComprobante: parseInt(tipo) })
          )
        );
        const items: UltimoItem[] = resultados.map((r, i) => ({
          tipoKey: entries[i][0],
          tipoNombre: entries[i][1],
          numero: r.status === "fulfilled" ? (r.value.numero ?? 0) : 0,
        }));
        setUltimosTodos(items);
      } else {
        const result = await callArcaFunction("ultimo", {
          puntoVenta: pv,
          tipoComprobante: parseInt(consultaTipo),
        });
        setUltimoSingle({
          numero: result.numero ?? 0,
          tipo: TIPOS_COMPROBANTE[consultaTipo] || consultaTipo,
          puntoVenta: pv,
        });
      }

      setUltimoSearched(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
      setUltimoSearched(true);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const sinIvaActual = TIPOS_SIN_IVA.has(invoiceData.tipoComprobante);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlanoLogo size={40} />
            <span className="text-foreground font-medium">Facturación</span>
            <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded">Testing</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {error && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/50 bg-destructive/10 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="emitir" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Emitir</span>
            </TabsTrigger>
            <TabsTrigger value="consultar" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Comprobantes</span>
            </TabsTrigger>
            <TabsTrigger value="ultimo" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <span className="hidden sm:inline">Último Nro</span>
            </TabsTrigger>
          </TabsList>

          {/* EMITIR FACTURA */}
          <TabsContent value="emitir">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Emitir comprobante</CardTitle>
                <CardDescription>Completá los datos para generar un comprobante electrónico via ARCA.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmitir} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Punto de venta</Label>
                      <Input
                        type="number"
                        value={invoiceData.puntoVenta}
                        onChange={(e) => setInvoiceData({ ...invoiceData, puntoVenta: e.target.value })}
                        min="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Tipo de comprobante</Label>
                      <Select
                        value={invoiceData.tipoComprobante}
                        onValueChange={handleTipoChange}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(TIPOS_COMPROBANTE).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Tipo documento</Label>
                      <Select
                        value={invoiceData.docTipo}
                        onValueChange={(v) => setInvoiceData({ ...invoiceData, docTipo: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="80">CUIT</SelectItem>
                          <SelectItem value="86">CUIL</SelectItem>
                          <SelectItem value="96">DNI</SelectItem>
                          <SelectItem value="99">Consumidor Final</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Nro documento</Label>
                      <Input
                        value={invoiceData.docNro}
                        onChange={(e) => setInvoiceData({ ...invoiceData, docNro: e.target.value })}
                        placeholder="20-12345678-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground">Concepto</Label>
                    <Select
                      value={invoiceData.concepto}
                      onValueChange={(v) => setInvoiceData({ ...invoiceData, concepto: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Productos</SelectItem>
                        <SelectItem value="2">Servicios</SelectItem>
                        <SelectItem value="3">Productos y Servicios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Importe neto</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={invoiceData.importeNeto}
                        onChange={(e) => handleNetoChange(e.target.value, invoiceData.tipoComprobante)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">
                        IVA {sinIvaActual && <span className="text-xs text-muted-foreground">(monotributo)</span>}
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={invoiceData.importeIva}
                        onChange={(e) => {
                          const iva = parseFloat(e.target.value) || 0;
                          const neto = parseFloat(invoiceData.importeNeto) || 0;
                          setInvoiceData({
                            ...invoiceData,
                            importeIva: e.target.value,
                            importeTotal: (neto + iva).toFixed(2),
                          });
                        }}
                        placeholder="0.00"
                        disabled={sinIvaActual}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Total</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={invoiceData.importeTotal}
                        onChange={(e) => setInvoiceData({ ...invoiceData, importeTotal: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                    Emitir comprobante
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONSULTAR COMPROBANTES */}
          <TabsContent value="consultar">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Consultar comprobantes</CardTitle>
                <CardDescription>Buscá los últimos 10 comprobantes emitidos por punto de venta y tipo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Punto de venta</Label>
                    <Input
                      type="number"
                      value={consultaPV}
                      onChange={(e) => setConsultaPV(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Tipo de comprobante</Label>
                    <Select value={consultaTipo} onValueChange={setConsultaTipo}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Todos</SelectItem>
                        {Object.entries(TIPOS_COMPROBANTE).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleConsultarComprobantes} disabled={loading} className="w-full sm:w-auto">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  Buscar
                </Button>

                {comprobantesSearched && comprobantes.length === 0 && (
                  <div className="py-10 text-center text-muted-foreground text-sm">
                    Sin comprobantes emitidos para los filtros seleccionados.
                  </div>
                )}

                {comprobantes.length > 0 && (
                  <div className="rounded-lg border border-border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>PV</TableHead>
                          <TableHead>Nro</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead>CAE</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comprobantes.map((c, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-foreground">{TIPOS_COMPROBANTE[String(c.tipo)] || c.tipo}</TableCell>
                            <TableCell className="text-foreground">{c.puntoVenta}</TableCell>
                            <TableCell className="text-foreground">{c.numero}</TableCell>
                            <TableCell className="text-muted-foreground">{c.fecha}</TableCell>
                            <TableCell className="text-right text-foreground">${c.importeTotal?.toFixed(2)}</TableCell>
                            <TableCell className="text-muted-foreground font-mono text-xs">{c.cae}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ÚLTIMO COMPROBANTE */}
          <TabsContent value="ultimo">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Último comprobante autorizado</CardTitle>
                <CardDescription>Consultá el último número autorizado en ARCA por tipo de comprobante.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Punto de venta</Label>
                    <Input
                      type="number"
                      value={consultaPV}
                      onChange={(e) => setConsultaPV(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Tipo de comprobante</Label>
                    <Select value={consultaTipo} onValueChange={setConsultaTipo}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Todos</SelectItem>
                        {Object.entries(TIPOS_COMPROBANTE).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleUltimoComprobante} disabled={loading} className="w-full sm:w-auto">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Hash className="h-4 w-4 mr-2" />}
                  Consultar
                </Button>

                {ultimoSearched && !ultimoSingle && ultimosTodos.length === 0 && (
                  <div className="py-10 text-center text-muted-foreground text-sm">
                    No se pudo obtener información de comprobantes.
                  </div>
                )}

                {/* Vista "Todos" — tabla */}
                {ultimosTodos.length > 0 && (
                  <div className="rounded-lg border border-border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Último número</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ultimosTodos.map((item) => (
                          <TableRow key={item.tipoKey}>
                            <TableCell className="text-foreground">{item.tipoNombre}</TableCell>
                            <TableCell className="text-right">
                              {item.numero === 0 ? (
                                <span className="text-muted-foreground text-sm">Sin emitidos</span>
                              ) : (
                                <span className="font-semibold text-primary font-mono">
                                  {String(item.numero).padStart(8, "0")}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Vista tipo único — card */}
                {ultimoSingle && (
                  <div className="p-6 rounded-lg border border-border bg-card">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Tipo</p>
                        <p className="text-lg font-semibold text-foreground">{ultimoSingle.tipo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Punto de venta</p>
                        <p className="text-lg font-semibold text-foreground">{String(ultimoSingle.puntoVenta).padStart(4, "0")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Último número</p>
                        {ultimoSingle.numero === 0 ? (
                          <p className="text-lg font-semibold text-muted-foreground">Sin emitidos</p>
                        ) : (
                          <p className="text-lg font-semibold text-primary font-mono">
                            {String(ultimoSingle.numero).padStart(8, "0")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Facturacion;
