// src/components/ArcaTester.tsx
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Action =
  | "estado"
  | "ultimo-comprobante"
  | "tipos-comprobante"
  | "facturar"
  | "consultar-padron";

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
      // Si la function devuelve 500, Supabase mete el cuerpo en error.context
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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">ARCA · Tester</h1>
      <p className="text-sm text-gray-500">
        Banco de pruebas para web services de ARCA (ex AFIP) vía AFIP SDK. Empezá por
        <strong> estado</strong>.
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
        {loading ? "Enviando a ARCA..." : "Ejecutar"}
      </button>

      {response && (
        <pre className="bg-gray-900 text-green-300 p-4 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

const presets: Record<Action, string> = {
  estado: "{}",
  "ultimo-comprobante": JSON.stringify({ puntoVenta: 1, tipoCbte: 11 }, null, 2),
  "tipos-comprobante": "{}",
  facturar: JSON.stringify(
    { puntoVenta: 1, tipoCbte: 11, importe: 100, docTipo: 99, docNro: 0 },
    null,
    2
  ),
  "consultar-padron": JSON.stringify({ cuitConsultado: "20111111112" }, null, 2),
};
