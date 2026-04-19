// src/components/ArcaTester.tsx
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Action =
  | "estado"
  | "crear-certificado"
  | "autorizar-wsfe"
  | "verificar-cert"
  | "ultimo-comprobante"
  | "facturar";

export default function ArcaTester() {
  const [action, setAction] = useState<Action>("estado");
  const [payload, setPayload] = useState<string>(presets.estado);
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

  const isSetupAction = action === "crear-certificado" || action === "autorizar-wsfe";

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">ARCA · Tester</h1>
      <p className="text-sm text-gray-500">
        Setup: estado → crear-certificado → (guardar secrets) → autorizar-wsfe → verificar-cert →
        ultimo-comprobante → facturar
      </p>

      <div className="flex gap-2 flex-wrap">
        {(Object.keys(presets) as Action[]).map((a) => (
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

      {isSetupAction && (
        <div className="bg-yellow-50 border border-yellow-300 rounded p-3 text-sm text-yellow-900">
          ⚠️ Requiere tu clave fiscal de ARCA. Después considerá rotarla en arca.gob.ar.
        </div>
      )}

      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        className="w-full h-40 font-mono text-sm p-3 border rounded"
      />

      <button
        onClick={run}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading
          ? isSetupAction
            ? "Ejecutando automatización (hasta 2 min)..."
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
  "crear-certificado": JSON.stringify(
    { password: "TU_CLAVE_FISCAL_ARCA", alias: "plano" },
    null,
    2
  ),
  "autorizar-wsfe": JSON.stringify(
    { password: "TU_CLAVE_FISCAL_ARCA", alias: "plano" },
    null,
    2
  ),
  "verificar-cert": "{}",
  "ultimo-comprobante": JSON.stringify({ puntoVenta: 1, tipoCbte: 11 }, null, 2),
  facturar: JSON.stringify(
    { puntoVenta: 1, tipoCbte: 11, importe: 100, docTipo: 99, docNro: 0 },
    null,
    2
  ),
};
