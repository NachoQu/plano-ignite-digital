import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload, MessageCircle, Mail, Trash2, Loader2, LogOut,
  ExternalLink, CheckCircle, XCircle, Plus, X, FileSpreadsheet,
  UserPlus, ChevronDown, ChevronUp
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

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

const LeadCard = ({
  lead,
  onToggleContacted,
  onAddTag,
  onRemoveTag,
  onDelete,
}: {
  lead: SavedLead;
  onToggleContacted: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onDelete: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tagInput, setTagInput] = useState("");

  return (
    <div className="border border-border rounded-lg p-4 space-y-3 bg-card">
      {/* Row 1: Main info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onToggleContacted}
            className={`shrink-0 ${lead.contacted ? "text-green-500" : "text-muted-foreground"}`}
            title={lead.contacted ? "Contactado" : "No contactado"}
          >
            {lead.contacted ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground truncate">{lead.name || "Sin nombre"}</p>
            <p className="text-xs text-muted-foreground">
              {[lead.city, lead.province].filter(Boolean).join(", ") || "Sin ubicación"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Badge variant="secondary" className="text-xs whitespace-nowrap">{lead.niche || "otro"}</Badge>
          <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground p-1">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Row 2: Contact links */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {lead.whatsapp_link ? (
          <a href={lead.whatsapp_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-green-500 hover:underline">
            <MessageCircle className="h-3.5 w-3.5" /> {lead.phone || "WhatsApp"}
          </a>
        ) : lead.phone ? (
          <span className="text-muted-foreground">{lead.phone}</span>
        ) : null}

        {lead.email && (
          <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 text-primary hover:underline">
            <Mail className="h-3.5 w-3.5" /> {lead.email}
          </a>
        )}

        {lead.website ? (
          <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
            <ExternalLink className="h-3.5 w-3.5" /> Web
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">Sin web</span>
        )}
      </div>

      {/* Row 3: Tags */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {(lead.tags || []).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs gap-1 pr-1">
            {tag}
            <button onClick={() => onRemoveTag(tag)} className="hover:text-destructive">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <div className="flex items-center gap-1">
          <Input
            placeholder="+ tag"
            className="h-6 w-20 text-xs"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagInput.trim()) {
                onAddTag(tagInput.trim());
                setTagInput("");
              }
            }}
          />
          <button
            onClick={() => {
              if (tagInput.trim()) {
                onAddTag(tagInput.trim());
                setTagInput("");
              }
            }}
            className="text-primary hover:text-primary/80"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded: delete */}
      {expanded && (
        <div className="flex justify-end pt-2 border-t border-border">
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> Eliminar
          </Button>
        </div>
      )}
    </div>
  );
};

const AddLeadDialog = ({ user, onSaved }: { user: { id: string }; onSaved: () => void }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", city: "", province: "", phone: "", email: "", website: "", niche: "otro",
  });

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Error", description: "El nombre es obligatorio", variant: "destructive" });
      return;
    }
    setSaving(true);
    const cleanPhone = form.phone.replace(/[^0-9+]/g, "");
    const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone.replace("+", "")}` : "";

    const { error } = await supabase.from("leads").insert({
      user_id: user.id,
      name: form.name.trim(),
      city: form.city.trim(),
      province: form.province.trim(),
      phone: form.phone.trim(),
      whatsapp_link: whatsappLink,
      email: form.email.trim(),
      website: form.website.trim(),
      niche: form.niche,
      notes: "",
      source_url: "",
      tags: [],
      contacted: false,
    });

    if (error) {
      toast({ title: "Error", description: "No se pudo guardar", variant: "destructive" });
    } else {
      toast({ title: "Guardado" });
      setForm({ name: "", city: "", province: "", phone: "", email: "", website: "", niche: "otro" });
      setOpen(false);
      onSaved();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" /> Agregar lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nuevo Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Nombre *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Provincia" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
            <Input placeholder="Ciudad" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <Input placeholder="Teléfono (con código de país)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Sitio web" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <Select value={form.niche} onValueChange={(v) => setForm({ ...form, niche: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Nicho" />
            </SelectTrigger>
            <SelectContent>
              {NICHES.map((n) => (
                <SelectItem key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
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
        toast({ title: "Error", description: "El CSV está vacío", variant: "destructive" });
        setImporting(false);
        return;
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
      const findCol = (names: string[]) =>
        headers.findIndex((h) => names.some((n) => h.includes(n)));

      const iName = findCol(["nombre", "name", "razón social", "razon social", "negocio", "empresa", "title", "titulo", "título", "comercio", "local"]);
      const iCity = findCol(["ciudad", "city", "localidad", "ubicación", "ubicacion", "location", "dirección", "direccion", "address"]);
      const iProvince = findCol(["provincia", "province", "estado", "state", "departamento", "región", "region"]);
      const iPhone = findCol(["teléfono", "telefono", "phone", "tel", "celular", "móvil", "movil", "whatsapp", "contacto"]);
      const iEmail = findCol(["email", "correo", "mail", "e-mail"]);
      const iWebsite = findCol(["web", "website", "sitio", "página", "pagina", "url", "link", "enlace", "google maps"]);
      const iNiche = findCol(["nicho", "niche", "rubro", "categoría", "categoria", "sector", "tipo", "industria"]);
      const iTags = findCol(["tags", "etiquetas", "notas", "observaciones"]);

      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') { inQuotes = !inQuotes; }
          else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
          else { current += char; }
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
        toast({ title: "Error", description: "No se encontraron datos válidos", variant: "destructive" });
        setImporting(false);
        return;
      }

      for (let i = 0; i < leads.length; i += 50) {
        const batch = leads.slice(i, i + 50);
        const { error } = await supabase.from("leads").insert(batch);
        if (error) {
          toast({ title: "Error", description: `Error lote ${Math.floor(i / 50) + 1}: ${error.message}`, variant: "destructive" });
        }
      }

      toast({ title: "Importación exitosa", description: `${leads.length} leads importados` });
      fetchLeads();
    } catch {
      toast({ title: "Error", description: "Error al procesar el CSV", variant: "destructive" });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleContacted = async (lead: SavedLead) => {
    const { error } = await supabase.from("leads").update({ contacted: !lead.contacted }).eq("id", lead.id);
    if (!error) {
      setSavedLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, contacted: !l.contacted } : l)));
    }
  };

  const addTag = async (leadId: string, tag: string) => {
    const lead = savedLeads.find((l) => l.id === leadId);
    if (!lead) return;
    const updatedTags = [...(lead.tags || []), tag];
    const { error } = await supabase.from("leads").update({ tags: updatedTags }).eq("id", leadId);
    if (!error) {
      setSavedLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, tags: updatedTags } : l)));
    }
  };

  const removeTag = async (leadId: string, tagToRemove: string) => {
    const lead = savedLeads.find((l) => l.id === leadId);
    if (!lead) return;
    const updatedTags = (lead.tags || []).filter((t) => t !== tagToRemove);
    const { error } = await supabase.from("leads").update({ tags: updatedTags }).eq("id", leadId);
    if (!error) {
      setSavedLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, tags: updatedTags } : l)));
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
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Prospección</h1>
          <div className="flex items-center gap-2">
            {user && <AddLeadDialog user={user} onSaved={fetchLeads} />}
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleCSVImport} />
            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={importing}>
              {importing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <FileSpreadsheet className="h-4 w-4 mr-1" />}
              CSV
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={filterProvince} onValueChange={setFilterProvince}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Provincia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {uniqueProvinces.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterNiche} onValueChange={setFilterNiche}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Nicho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueNiches.map((n) => (
                <SelectItem key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterContacted} onValueChange={setFilterContacted}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="yes">Contactados</SelectItem>
              <SelectItem value="no">No contactados</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground ml-auto">
            {filteredLeads.length}/{savedLeads.length}
          </span>
        </div>

        {/* Leads */}
        {loadingLeads ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No hay leads. Importá un CSV o agregá uno manualmente.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onToggleContacted={() => toggleContacted(lead)}
                onAddTag={(tag) => addTag(lead.id, tag)}
                onRemoveTag={(tag) => removeTag(lead.id, tag)}
                onDelete={() => handleDeleteLead(lead.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prospeccion;
