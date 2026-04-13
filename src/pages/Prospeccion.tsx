import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload, Save, MessageCircle, Mail, Trash2, Loader2, LogOut,
  ExternalLink, CheckCircle, XCircle, Plus, X, FileSpreadsheet
} from "lucide-react";

const NICHES = [
  "restaurantes", "inmobiliarias", "talleres mecánicos", "consultorios médicos",
  "estudios contables", "peluquerías", "gimnasios", "veterinarias",
  "ferreterías", "hoteles", "otro",
];

type SavedLead = {
  id: string;
  name: string;
  city: string;
  province: string;
  phone: string;
  whatsapp_link: string;
  email: string;
  website: string;
  niche: string;
  notes: string;
  contacted: boolean;
  tags: string[];
  created_at: string;
};

const Prospeccion = () => {
  const { user, loading: authLoading, signOut } = useAuth("/login");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedLeads, setSavedLeads] = useState<SavedLead[]>([]);
  const [filterNiche, setFilterNiche] = useState("all");
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterContacted, setFilterContacted] = useState("all");
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [importing, setImporting] = useState(false);
  const [newTag, setNewTag] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) fetchLeads();
  }, [user]);

  const fetchLeads = async () => {
    setLoadingLeads(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: "No se pudieron cargar los leads", variant: "destructive" });
    } else {
      setSavedLeads((data || []) as unknown as SavedLead[]);
    }
    setLoadingLeads(false);
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setImporting(true);

    try {
      const text = await file.text();
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) {
        toast({ title: "Error", description: "El CSV está vacío o solo tiene encabezado", variant: "destructive" });
        setImporting(false);
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));

      const findCol = (names: string[]) =>
        headers.findIndex((h) => names.some((n) => h.includes(n)));

      const iName = findCol(["nombre", "name", "razón social", "razon social", "negocio", "empresa"]);
      const iCity = findCol(["ciudad", "city", "localidad"]);
      const iProvince = findCol(["provincia", "province", "estado", "state"]);
      const iPhone = findCol(["teléfono", "telefono", "phone", "tel", "celular", "móvil", "movil"]);
      const iEmail = findCol(["email", "correo", "mail", "e-mail"]);
      const iWebsite = findCol(["web", "website", "sitio", "página", "pagina", "url"]);
      const iNiche = findCol(["nicho", "niche", "rubro", "categoría", "categoria", "sector"]);
      const iTags = findCol(["tags", "etiquetas", "notas", "observaciones"]);

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      const leads = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length < 2) continue;

        const phone = iPhone >= 0 ? cols[iPhone]?.replace(/['"]/g, "").trim() : "";
        const cleanPhone = phone.replace(/[^0-9+]/g, "");
        const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone.replace("+", "")}` : "";
        const tagsRaw = iTags >= 0 ? cols[iTags]?.replace(/['"]/g, "").trim() : "";
        const tags = tagsRaw ? tagsRaw.split(";").map((t) => t.trim()).filter(Boolean) : [];

        leads.push({
          user_id: user.id,
          name: iName >= 0 ? cols[iName]?.replace(/['"]/g, "").trim() || "" : "",
          city: iCity >= 0 ? cols[iCity]?.replace(/['"]/g, "").trim() || "" : "",
          province: iProvince >= 0 ? cols[iProvince]?.replace(/['"]/g, "").trim() || "" : "",
          phone,
          whatsapp_link: whatsappLink,
          email: iEmail >= 0 ? cols[iEmail]?.replace(/['"]/g, "").trim() || "" : "",
          website: iWebsite >= 0 ? cols[iWebsite]?.replace(/['"]/g, "").trim() || "" : "",
          niche: iNiche >= 0 ? cols[iNiche]?.replace(/['"]/g, "").trim() || "otro" : "otro",
          notes: "",
          source_url: "",
          tags,
          contacted: false,
        });
      }

      if (leads.length === 0) {
        toast({ title: "Error", description: "No se encontraron datos válidos en el CSV", variant: "destructive" });
        setImporting(false);
        return;
      }

      // Insert in batches of 50
      for (let i = 0; i < leads.length; i += 50) {
        const batch = leads.slice(i, i + 50);
        const { error } = await supabase.from("leads").insert(batch);
        if (error) {
          toast({ title: "Error", description: `Error al importar lote ${Math.floor(i / 50) + 1}: ${error.message}`, variant: "destructive" });
        }
      }

      toast({ title: "Importación exitosa", description: `Se importaron ${leads.length} leads` });
      fetchLeads();
    } catch (err) {
      toast({ title: "Error", description: "Error al procesar el archivo CSV", variant: "destructive" });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleContacted = async (lead: SavedLead) => {
    const { error } = await supabase
      .from("leads")
      .update({ contacted: !lead.contacted })
      .eq("id", lead.id);
    if (!error) {
      setSavedLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, contacted: !l.contacted } : l))
      );
    }
  };

  const addTag = async (leadId: string) => {
    const tag = newTag[leadId]?.trim();
    if (!tag) return;
    const lead = savedLeads.find((l) => l.id === leadId);
    if (!lead) return;
    const updatedTags = [...(lead.tags || []), tag];
    const { error } = await supabase.from("leads").update({ tags: updatedTags }).eq("id", leadId);
    if (!error) {
      setSavedLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, tags: updatedTags } : l))
      );
      setNewTag((prev) => ({ ...prev, [leadId]: "" }));
    }
  };

  const removeTag = async (leadId: string, tagToRemove: string) => {
    const lead = savedLeads.find((l) => l.id === leadId);
    if (!lead) return;
    const updatedTags = (lead.tags || []).filter((t) => t !== tagToRemove);
    const { error } = await supabase.from("leads").update({ tags: updatedTags }).eq("id", leadId);
    if (!error) {
      setSavedLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, tags: updatedTags } : l))
      );
    }
  };

  const handleDeleteLead = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) {
      setSavedLeads((prev) => prev.filter((l) => l.id !== id));
      toast({ title: "Eliminado" });
    }
  };

  let filteredLeads = savedLeads;
  if (filterNiche !== "all") filteredLeads = filteredLeads.filter((l) => l.niche === filterNiche);
  if (filterProvince !== "all") filteredLeads = filteredLeads.filter((l) => l.province === filterProvince);
  if (filterContacted === "yes") filteredLeads = filteredLeads.filter((l) => l.contacted);
  if (filterContacted === "no") filteredLeads = filteredLeads.filter((l) => !l.contacted);

  const uniqueNiches = [...new Set(savedLeads.map((l) => l.niche).filter(Boolean))];
  const uniqueProvinces = [...new Set(savedLeads.map((l) => l.province).filter(Boolean))];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Prospección de Clientes</h1>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Salir
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* CSV Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" /> Importar Leads desde CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              El CSV debe tener columnas como: <strong>nombre, ciudad, provincia, teléfono, email, web, nicho, tags</strong> (separar tags con <code>;</code>).
            </p>
            <div className="flex gap-3 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCSVImport}
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={importing}>
                {importing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                )}
                {importing ? "Importando..." : "Seleccionar CSV"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-foreground">Filtros:</span>
              <Select value={filterProvince} onValueChange={setFilterProvince}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Provincia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las provincias</SelectItem>
                  {uniqueProvinces.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterNiche} onValueChange={setFilterNiche}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Nicho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los nichos</SelectItem>
                  {uniqueNiches.map((n) => (
                    <SelectItem key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterContacted} onValueChange={setFilterContacted}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="yes">Contactados</SelectItem>
                  <SelectItem value="no">No contactados</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-auto">
                {filteredLeads.length} de {savedLeads.length} leads
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardContent className="pt-6">
            {loadingLeads ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay leads. Importá un CSV para comenzar.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estado</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Provincia</TableHead>
                      <TableHead>Ciudad</TableHead>
                      <TableHead>Nicho</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Web</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className={lead.contacted ? "text-green-600 hover:text-green-700" : "text-muted-foreground hover:text-foreground"}
                            onClick={() => toggleContacted(lead)}
                            title={lead.contacted ? "Contactado" : "No contactado"}
                          >
                            {lead.contacted ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{lead.name || "-"}</TableCell>
                        <TableCell>{lead.province || "-"}</TableCell>
                        <TableCell>{lead.city || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {lead.niche}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lead.whatsapp_link ? (
                            <a href={lead.whatsapp_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                              <MessageCircle className="h-3 w-3" /> {lead.phone || "WhatsApp"}
                            </a>
                          ) : lead.phone || "-"}
                        </TableCell>
                        <TableCell>
                          {lead.email ? (
                            <a href={`mailto:${lead.email}`} className="text-primary hover:underline flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {lead.email}
                            </a>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          {lead.website ? (
                            <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                              <ExternalLink className="h-3 w-3" /> Web
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs">Sin web</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 items-center max-w-xs">
                            {(lead.tags || []).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs gap-1 pr-1">
                                {tag}
                                <button onClick={() => removeTag(lead.id, tag)} className="hover:text-destructive">
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                            <div className="flex items-center gap-1">
                              <Input
                                placeholder="Tag..."
                                className="h-6 w-20 text-xs"
                                value={newTag[lead.id] || ""}
                                onChange={(e) => setNewTag((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === "Enter" && addTag(lead.id)}
                              />
                              <button onClick={() => addTag(lead.id)} className="text-primary hover:text-primary/80">
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeleteLead(lead.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Prospeccion;
