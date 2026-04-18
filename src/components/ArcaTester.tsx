// src/components/ArcaTester.tsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Action = "facturar" | "consultar-padron" | "constatar" | "ultimo-comprobante";

export default function ArcaTester() {
  const [action, setAction] = useState<Action>("facturar");
  const [payload, setPayload] = useState<string>(presets.facturar);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const { data, error } = await supabase.functions.invoke("arca-handler", {
        body: { action, payload: JSON.parse(payload) },
      });
      setResponse(error ? { error: error.message } : data);
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
        Banco de pruebas para web services de ARCA (ex AFIP) vía AFIP SDK.
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
        className="w-full h-48 font-mono text-sm p-3 border rounded"
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
  facturar: JSON.stringify(
    { puntoVenta: 1, tipoCbte: 11, importe: 1000, docTipo: 99, docNro: 0 },
    null,
    2
  ),
  "consultar-padron": JSON.stringify({ cuitConsultado: "20111111112" }, null, 2),
  constatar: JSON.stringify(
    {
      cuitEmisor: 20111111112,
      puntoVenta: 1,
      tipoCbte: 11,
      cbteNro: 1,
      fecha: "20260418",
      importe: 1000,
      cae: "70000000000000",
    },
    null,
    2
  ),
  "ultimo-comprobante": JSON.stringify({ puntoVenta: 1, tipoCbte: 11 }, null, 2),
};
