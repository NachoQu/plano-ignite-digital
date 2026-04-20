// src/components/ArcaTester.tsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

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

  const sections = [
    { title: "Diagnóstico", actions: ["info-ambiente", "verificar-cert", "estado"] as Action[] },
    { title: "Setup Homo", actions: ["crear-certificado", "autorizar-wsfe"] as Action[] },
    {
      title: "Setup Prod",
      actions: [
        "habilitar-admin-certs",
        "crear-certificado-prod",
        "autorizar-wsfe-prod",
      ] as Action[],
    },
    { title: "Uso", actions: ["ultimo-comprobante", "facturar"] as Action[] },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">ARCA · Tester</h1>

      {sections.map((s) => (
        <div key={s.title}>
          <div className="text-xs text-gray-500 mb-1 uppercase">{s.title}</div>
          <div className="flex gap-2 flex-wrap">
            {s.actions.map((a) => (
              <button
                key={a}
                onClick={() => changeAction(a)}
                className={`px-3 py-1.5 rounded text-sm ${
                  action === a ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      ))}

      {isSetupAction && (
        <div className="bg-yellow-50 border border-yellow-300 rounded p-3 text-sm text-yellow-900">
          ⚠️ Requiere tu clave fiscal de ARCA.
        </div>
      )}
      {isProdAction && (
        <div className="bg-red-50 border border-red-300 rounded p-3 text-sm text-red-900">
          🔴 Acción de PRODUCCIÓN. Genera datos reales con validez fiscal en ARCA.
        </div>
      )}

      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        className="w-full h-36 font-mono text-sm p-3 border rounded"
      />

      <button
        onClick={run}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading
          ? isSetupAction
            ? "Ejecutando automatización (hasta 5 min)..."
            : "Enviando a ARCA..."
          : "Ejecutar"}
      </button>

      {response && (
        <pre className="bg-gray-900 text-green-300 p-4 rounded text-xs overflow-auto max-h-[500px]">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
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
    { password: "TU_CLAVE_FISCAL", alias: "plano-prod" },
    null,
    2
  ),
  "autorizar-wsfe-prod": JSON.stringify(
    { password: "TU_CLAVE_FISCAL", alias: "plano-prod" },
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
