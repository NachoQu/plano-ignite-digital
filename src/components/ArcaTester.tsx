// src/components/ArcaTester.tsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  ShieldCheck,
  Wrench,
  Rocket,
  AlertTriangle,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Action =
  | "estado"
  | "info-ambiente"
  | "verificar-cert"
  | "crear-certificado"
  | "autorizar-wsfe"
  | "habilitar-admin-certs"
  | "crear-certificado-prod"
  | "autorizar-wsfe-prod"
  | "ultimo-comprobante"
  | "facturar";

const labels: Record<Action, string> = {
  estado: "Estado del servicio",
  "info-ambiente": "Info del ambiente",
  "verificar-cert": "Verificar certificado",
  "crear-certificado": "Crear certificado (homo)",
  "autorizar-wsfe": "Autorizar WSFE (homo)",
  "habilitar-admin-certs": "Habilitar admin certs",
  "crear-certificado-prod": "Crear certificado (prod)",
  "autorizar-wsfe-prod": "Autorizar WSFE (prod)",
  "ultimo-comprobante": "Último comprobante",
  facturar: "Emitir factura",
};

const descriptions: Record<Action, string> = {
  estado: "Ping al WSFE para validar conectividad.",
  "info-ambiente": "Muestra ambiente activo y certs cargados.",
  "verificar-cert": "Inspecciona el certificado en uso.",
  "crear-certificado": "Genera cert/key para homologación.",
  "autorizar-wsfe": "Vincula el alias al servicio WSFE en homo.",
  "habilitar-admin-certs": "Habilita el servicio admin de certs en prod.",
  "crear-certificado-prod": "Genera cert/key reales de producción.",
  "autorizar-wsfe-prod": "Vincula el alias al WSFE en producción.",
  "ultimo-comprobante": "Consulta el último N° autorizado.",
  facturar: "Emite un comprobante de prueba.",
};

const presets: Record<Action, string> = {
  estado: "{}",
  "info-ambiente": "{}",
  "verificar-cert": "{}",
  "crear-certificado": JSON.stringify(
    { password: "TU_CLAVE_FISCAL", alias: "plano" },
    null,
    2
  ),
  "autorizar-wsfe": JSON.stringify(
    { password: "TU_CLAVE_FISCAL", alias: "plano" },
    null,
    2
  ),
  "habilitar-admin-certs": JSON.stringify({ password: "TU_CLAVE_FISCAL" }, null, 2),
  "crear-certificado-prod": JSON.stringify(
    { password: "TU_CLAVE_FISCAL", alias: "planoprod" },
    null,
    2
  ),
  "autorizar-wsfe-prod": JSON.stringify(
    { password: "TU_CLAVE_FISCAL", alias: "planoprod" },
    null,
    2
  ),
  "ultimo-comprobante": JSON.stringify({ puntoVenta: 1, tipoCbte: 11 }, null, 2),
  facturar: JSON.stringify(
    { puntoVenta: 1, tipoCbte: 11, importe: 1, docTipo: 99, docNro: 0 },
    null,
    2
  ),
};

export default function ArcaTester() {
  const [action, setAction] = useState<Action>("info-ambiente");
  const [payload, setPayload] = useState<string>(presets["info-ambiente"]);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const { data, error } = await supabase.functions.invoke("arca-handler", {
        body: { action, payload: JSON.parse(payload || "{}") },
      });
      if (error) {
        const ctx = (error as any).context;
        const body = ctx ? await ctx.text?.() : null;
        setResponse({ error: error.message, body });
      } else {
        setResponse(data);
      }
    } catch (e: any) {
      setResponse({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  const changeAction = (a: Action) => {
    setAction(a);
    setPayload(presets[a]);
    setResponse(null);
  };

  const isSetupAction = [
    "crear-certificado",
    "autorizar-wsfe",
    "crear-certificado-prod",
    "autorizar-wsfe-prod",
    "habilitar-admin-certs",
  ].includes(action);

  const isProdAction = action.includes("prod");

  const sections: {
    title: string;
    icon: typeof Activity;
    actions: Action[];
    accent: "primary" | "secondary" | "destructive" | "muted";
  }[] = [
    {
      title: "Diagnóstico",
      icon: Activity,
      actions: ["info-ambiente", "verificar-cert", "estado"],
      accent: "primary",
    },
    {
      title: "Setup Homologación",
      icon: Wrench,
      actions: ["crear-certificado", "autorizar-wsfe"],
      accent: "secondary",
    },
    {
      title: "Setup Producción",
      icon: Rocket,
      actions: ["habilitar-admin-certs", "crear-certificado-prod", "autorizar-wsfe-prod"],
      accent: "destructive",
    },
    {
      title: "Uso",
      icon: ShieldCheck,
      actions: ["ultimo-comprobante", "facturar"],
      accent: "muted",
    },
  ];

  const isOk = response?.ok === true;
  const isErr = response && (response.ok === false || response.error);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              ARCA <span className="text-primary">·</span> Tester
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Panel interno para configurar y probar la integración con AFIP / ARCA.
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-primary/40 text-primary bg-primary/5"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            Conectado a AFIPSDK
          </Badge>
        </header>

        {/* Acciones agrupadas */}
        <div className="grid gap-4">
          {sections.map((s) => {
            const Icon = s.icon;
            const accentClasses =
              s.accent === "primary"
                ? "text-primary"
                : s.accent === "secondary"
                ? "text-secondary"
                : s.accent === "destructive"
                ? "text-destructive"
                : "text-muted-foreground";

            return (
              <Card key={s.title} className="p-4 sm:p-5 bg-card/50 border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${accentClasses}`} />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.title}
                  </h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {s.actions.map((a) => {
                    const active = action === a;
                    return (
                      <button
                        key={a}
                        onClick={() => changeAction(a)}
                        className={`group px-3.5 py-2 rounded-lg text-sm font-medium transition-all border ${
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                            : "bg-muted/30 text-foreground/80 border-border/50 hover:bg-muted/60 hover:border-border"
                        }`}
                        title={descriptions[a]}
                      >
                        {labels[a]}
                      </button>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Editor + Acción */}
        <Card className="p-5 sm:p-6 bg-card/50 border-border/50 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Acción seleccionada
              </div>
              <h3 className="text-lg font-semibold">{labels[action]}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {descriptions[action]}
              </p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {action}
            </Badge>
          </div>

          {isSetupAction && (
            <div className="flex gap-2 items-start p-3 rounded-lg border border-secondary/30 bg-secondary/5">
              <AlertTriangle className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground/80">
                Esta acción requiere tu <strong>clave fiscal de ARCA</strong>. Reemplazá el
                placeholder en el JSON antes de ejecutar.
              </p>
            </div>
          )}
          {isProdAction && (
            <div className="flex gap-2 items-start p-3 rounded-lg border border-destructive/40 bg-destructive/5">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
              <p className="text-sm text-foreground/80">
                <strong className="text-destructive">PRODUCCIÓN.</strong> Genera datos
                reales con validez fiscal en ARCA.
              </p>
            </div>
          )}

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
              Payload (JSON)
            </label>
            <Textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="font-mono text-sm min-h-[180px] bg-background/60 border-border/60"
              spellCheck={false}
            />
          </div>

          <div className="flex justify-end">
            <Button
              onClick={run}
              disabled={loading}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isSetupAction ? "Ejecutando (hasta 5 min)..." : "Enviando..."}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Ejecutar
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Respuesta */}
        {response && (
          <Card
            className={`p-5 sm:p-6 border-2 ${
              isOk
                ? "border-primary/30 bg-primary/5"
                : isErr
                ? "border-destructive/40 bg-destructive/5"
                : "border-border/50 bg-card/50"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {isOk ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-primary">Respuesta exitosa</h3>
                </>
              ) : isErr ? (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-semibold text-destructive">Error</h3>
                </>
              ) : (
                <h3 className="font-semibold">Respuesta</h3>
              )}
            </div>
            <pre className="bg-background/80 border border-border/50 rounded-lg p-4 text-xs overflow-auto max-h-[500px] text-foreground/90 font-mono">
              {JSON.stringify(response, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  );
}

const presets: Record<Action, string> = {
  estado: "{}",
  "info-ambiente": "{}",
  "verificar-cert": "{}",
  "crear-certificado": JSON.stringify(
    { password: "TU_CLAVE_FISCAL", alias: "plano" },
    null,
    2
  ),
  "autorizar-wsfe": JSON.stringify(
    { password: "TU_CLAVE_FISCAL", alias: "plano" },
    null,
    2
  ),
  "habilitar-admin-certs": JSON.stringify({ password: "TU_CLAVE_FISCAL" }, null, 2),
  "crear-certificado-prod": JSON.stringify(
    { password: "TU_CLAVE_FISCAL", alias: "planoprod" },
    null,
    2
  ),
  "autorizar-wsfe-prod": JSON.stringify(
    { password: "TU_CLAVE_FISCAL", alias: "planoprod" },
    null,
    2
  ),
  "ultimo-comprobante": JSON.stringify({ puntoVenta: 1, tipoCbte: 11 }, null, 2),
  facturar: JSON.stringify(
    { puntoVenta: 1, tipoCbte: 11, importe: 1, docTipo: 99, docNro: 0 },
    null,
    2
  ),
};
