import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { firecrawlApi, type Lead } from "@/lib/api/firecrawl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Search, Globe, Save, MessageCircle, Mail, Trash2, Loader2, LogOut } from "lucide-react";

const NICHES = [
  "restaurantes",
  "inmobiliarias",
  "talleres mecánicos",
  "consultorios médicos",
  "estudios contables",
  "peluquerías",
  "gimnasios",
  "veterinarias",
  "ferreterías",
  "hoteles",
  "otro",
];

type SavedLead = Lead & { id: string; niche: string; notes: string; created_at: string };

const Prospeccion = () => {
  const { user, loading: authLoading, signOut } = useAuth("/login");
  const { toast } = useToast();

  const [searchType, setSearchType] = useState<"url" | "query">("query");
  const [searchInput, setSearchInput] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);

  const [savedLeads, setSavedLeads] = useState<SavedLead[]>([]);
  const [filterNiche, setFilterNiche] = useState("all");
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

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

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setIsSearching(true);
    setResults([]);

    try {
      const response =
        searchType === "url"
          ? await firecrawlApi.scrapeUrl(searchInput)
          : await firecrawlApi.searchLeads(searchInput, selectedNiche);

      if (response.success && response.leads) {
        setResults(response.leads);
        if (response.leads.length === 0) {
          toast({ title: "Sin resultados", description: response.message || "No se encontraron datos de contacto" });
        } else {
          toast({ title: "Listo", description: `Se encontraron ${response.leads.length} contactos` });
        }
      } else {
        toast({ title: "Error", description: response.error || "Error en la búsqueda", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveLead = async (lead: Lead, index: number) => {
    if (!user) return;
    setSavingIndex(index);

    const { error } = await supabase.from("leads").insert({
      user_id: user.id,
      name: lead.name,
      city: lead.city,
      phone: lead.phone,
      whatsapp_link: lead.whatsapp_link,
      email: lead.email,
      niche: selectedNiche || "otro",
      source_url: lead.source_url,
      notes: "",
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo guardar el lead", variant: "destructive" });
    } else {
      toast({ title: "Guardado", description: `${lead.name || "Lead"} guardado exitosamente` });
      fetchLeads();
    }
    setSavingIndex(null);
  };

  const handleDeleteLead = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
    } else {
      setSavedLeads((prev) => prev.filter((l) => l.id !== id));
      toast({ title: "Eliminado" });
    }
  };

  const filteredLeads = filterNiche === "all" ? savedLeads : savedLeads.filter((l) => l.niche === filterNiche);
  const uniqueNiches = [...new Set(savedLeads.map((l) => l.niche).filter(Boolean))];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Prospección de Clientes</h1>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Salir
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" /> Buscar Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={searchType === "query" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("query")}
              >
                <Search className="h-4 w-4 mr-1" /> Búsqueda
              </Button>
              <Button
                variant={searchType === "url" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("url")}
              >
                <Globe className="h-4 w-4 mr-1" /> URL directa
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder={searchType === "url" ? "https://ejemplo.com" : "ej: talleres mecánicos Luján Buenos Aires"}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Nicho" />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n.charAt(0).toUpperCase() + n.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} disabled={isSearching || !searchInput.trim()}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                {isSearching ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="results">
          <TabsList>
            <TabsTrigger value="results">Resultados ({results.length})</TabsTrigger>
            <TabsTrigger value="saved">Guardados ({savedLeads.length})</TabsTrigger>
          </TabsList>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card>
              <CardContent className="pt-6">
                {results.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {isSearching ? "Buscando contactos..." : "Realizá una búsqueda para ver resultados"}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Ciudad</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((lead, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{lead.name || "-"}</TableCell>
                            <TableCell>{lead.city || "-"}</TableCell>
                            <TableCell>
                              {lead.phone ? (
                                <a href={lead.whatsapp_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" /> {lead.phone}
                                </a>
                              ) : "-"}
                            </TableCell>
                            <TableCell>
                              {lead.email ? (
                                <a href={`mailto:${lead.email}`} className="text-primary hover:underline flex items-center gap-1">
                                  <Mail className="h-3 w-3" /> {lead.email}
                                </a>
                              ) : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline" onClick={() => handleSaveLead(lead, i)} disabled={savingIndex === i}>
                                {savingIndex === i ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
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
          </TabsContent>

          {/* Saved Leads Tab */}
          <TabsContent value="saved">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Select value={filterNiche} onValueChange={setFilterNiche}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por nicho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {uniqueNiches.map((n) => (
                        <SelectItem key={n} value={n}>
                          {n.charAt(0).toUpperCase() + n.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {loadingLeads ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No hay leads guardados</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Ciudad</TableHead>
                          <TableHead>Nicho</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.name || "-"}</TableCell>
                            <TableCell>{lead.city || "-"}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {lead.niche}
                              </span>
                            </TableCell>
                            <TableCell>
                              {lead.whatsapp_link ? (
                                <a href={lead.whatsapp_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                                  <MessageCircle className="h-3 w-3" /> WhatsApp
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Prospeccion;
