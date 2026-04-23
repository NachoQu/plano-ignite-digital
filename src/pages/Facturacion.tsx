import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { backendConfigError, backendPublishableKey, backendUrl, supabase } from "@/lib/backend";
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

const Facturacion = () => {
  const { user, loading: authLoading, signOut } = useAuth("/login");
  const [activeTab, setActiveTab] = useState("emitir");
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    puntoVenta: "1",
    tipoComprobante: "1",
    concepto: "2",
    docTipo: "80",
    docNro: "",
    importeTotal: "",
    importeNeto: "",
    importeIva: "",
  });
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
  const [comprobantesSearched, setComprobantesSearched] = useState(false);
  const [ultimoComprobante, setUltimoComprobante] = useState<{ numero: number; tipo: string; puntoVenta: number } | null>(null);
  const [ultimoSearched, setUltimoSearched] = useState(false);
  const [consultaPV, setConsultaPV] = useState("1");
  const [consultaTipo, setConsultaTipo] = useState("1");
  const [error, setError] = useState("");

  const tiposComprobante: Record<string, string> = {
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

  const tiposDocumento: Record<string, string> = {
    "80": "CUIT",
    "86": "CUIL",
    "96": "DNI",
    "99": "Consumidor Final",
  };

  const callArcaFunction = async (action: string, body: Record<string, unknown>) => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.access_token) {
      await signOut();
      throw new Error("Sesión expirada. Por favor, ingresá de nuevo.");
    }

    const response = await fetch(
      `${backendUrl}/functions/v1/arca-facturacion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session.access_token}`,
          apikey: backendPublishableKey,
        },
        body: JSON.stringify({ action, ...body }),
      }
    );

    const data = await response.json();
    if (!response.ok || data?.error) {
      throw new Error(data?.error || `Error ${response.status}`);
    }
    return data;
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
      setInvoiceData({
        ...invoiceData,
        docNro: "",
        importeTotal: "",
        importeNeto: "",
        importeIva: "",
      });
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
    try {
      const result = await callArcaFunction("consultar", {
        puntoVenta: parseInt(consultaPV),
        tipoComprobante: parseInt(consultaTipo),
      });
      setComprobantes(result.comprobantes || []);
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
    try {
      const result = await callArcaFunction("ultimo", {
        puntoVenta: parseInt(consultaPV),
        tipoComprobante: parseInt(consultaTipo),
      });
      setUltimoComprobante({
        numero: result.numero ?? 0,
        tipo: tiposComprobante[consultaTipo] || consultaTipo,
        puntoVenta: parseInt(consultaPV),
      });
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
        {backendConfigError && !error && (
          <div className="mb-6 p-4 rounded-lg border border-border bg-card flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{backendConfigError}</p>
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
                        onValueChange={(v) => setInvoiceData({ ...invoiceData, tipoComprobante: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(tiposComprobante).map(([k, v]) => (
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
                          {Object.entries(tiposDocumento).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                          ))}
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
                        onChange={(e) => setInvoiceData({ ...invoiceData, importeNeto: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">IVA</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={invoiceData.importeIva}
                        onChange={(e) => setInvoiceData({ ...invoiceData, importeIva: e.target.value })}
                        placeholder="0.00"
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
                <CardDescription>Buscá comprobantes emitidos por punto de venta y tipo.</CardDescription>
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
                        {Object.entries(tiposComprobante).map(([k, v]) => (
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
                    Sin comprobantes emitidos para este punto de venta y tipo.
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
                            <TableCell className="text-foreground">{tiposComprobante[String(c.tipo)] || c.tipo}</TableCell>
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
                <CardDescription>Consultá el último número de comprobante autorizado en ARCA.</CardDescription>
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
                        {Object.entries(tiposComprobante).map(([k, v]) => (
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

                {ultimoSearched && !ultimoComprobante && (
                  <div className="py-10 text-center text-muted-foreground text-sm">
                    No se pudo obtener el último comprobante.
                  </div>
                )}

                {ultimoComprobante && (
                  <div className="p-6 rounded-lg border border-border bg-card">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Tipo</p>
                        <p className="text-lg font-semibold text-foreground">{ultimoComprobante.tipo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Punto de venta</p>
                        <p className="text-lg font-semibold text-foreground">{String(ultimoComprobante.puntoVenta).padStart(4, "0")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Último número</p>
                        {ultimoComprobante.numero === 0 ? (
                          <p className="text-lg font-semibold text-muted-foreground">Sin emitidos</p>
                        ) : (
                          <p className="text-lg font-semibold text-primary">{String(ultimoComprobante.numero).padStart(8, "0")}</p>
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
