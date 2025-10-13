import React, { useEffect, useState, useRef } from "react";
import { useRoute } from "wouter";
import ThreeFallback from "@/components/three-fallback";

/* Allow TSX to accept <model-viewer> without type errors */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

type Dish = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  glb?: string;
  usdz?: string;
};

type MenuFile = {
  restaurant: string;
  items: Dish[];
};

export default function CustomerMenu(): JSX.Element {
  const [match, params] = useRoute("/menu/:restaurantId");
  const restaurantId = params?.restaurantId ?? "demo";

  const [menu, setMenu] = useState<MenuFile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<Dish | null>(null);
  const [mvLoaded, setMvLoaded] = useState<boolean>(false);
  const [forceFallback, setForceFallback] = useState<boolean>(false);
  const mvRef = useRef<any>(null);

  // Load model-viewer script (module + legacy)
  useEffect(() => {
    if ((window as any).customElements && (window as any).customElements.get("model-viewer")) {
      setMvLoaded(true);
      return;
    }
    const id = "model-viewer-script";
    if (document.getElementById(id)) return;

    const s = document.createElement("script");
    s.id = id;
    s.type = "module";
    s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    s.onload = () => setMvLoaded(true);
    document.head.appendChild(s);

    const s2 = document.createElement("script");
    s2.noModule = true;
    s2.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js";
    document.head.appendChild(s2);
  }, []);

  // Load menu JSON
  useEffect(() => {
    let canceled = false;
    async function loadMenu() {
      setLoading(true);
      const url = `/menus/${encodeURIComponent(restaurantId)}.json`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Menu not found");
        const data: MenuFile = await res.json();
        if (canceled) return;
        setMenu(data);
        setSelected(data.items?.[0] ?? null);
      } catch (e) {
        // fallback to demo.json bundled in public/
        try {
          const demoRes = await fetch("/menus/demo.json");
          const demoJSON: MenuFile = await demoRes.json();
          if (canceled) return;
          setMenu(demoJSON);
          setSelected(demoJSON.items?.[0] ?? null);
        } catch {
          if (canceled) return;
          setMenu(null);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }
    loadMenu();
    return () => {
      canceled = true;
    };
  }, [restaurantId]);

  // When selected changes, update model-viewer src if present
  useEffect(() => {
    if (!mvLoaded) return;
    try {
      const mvEl = document.getElementById("mv") as any;
      if (mvEl && selected) {
        if (selected.glb) mvEl.setAttribute("src", selected.glb);
        if (selected.usdz) mvEl.setAttribute("ios-src", selected.usdz);
      }
    } catch {
      // ignore
    }
  }, [selected, mvLoaded]);

  const openQR = () => {
    const url = `${location.origin}/menu/${restaurantId}`;
    window.open(
      `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{menu?.restaurant ?? "Restaurant"}</h1>
            <p className="text-sm text-gray-600">
              Scan QR or browse below. Tap a dish to view in AR (supported phones).
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={openQR} className="px-3 py-2 rounded bg-purple-600 text-white">
              Get QR
            </button>
            <button
              onClick={() => setForceFallback((s) => !s)}
              className="px-3 py-2 rounded border"
              title="Force use of Three.js fallback (useful for testing)"
            >
              {forceFallback ? "Use model-viewer" : "Force 3D fallback"}
            </button>
            <a href="#3d" className="px-3 py-2 rounded border">
              Jump to 3D
            </a>
          </div>
        </header>

        {loading && <div>Loading menu…</div>}
        {!loading && !menu && (
          <div className="p-6 bg-red-50 border border-red-100 rounded">Menu not found.</div>
        )}

        {menu && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Dish list */}
            <div className="md:col-span-1 space-y-4">
              {menu.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded shadow-sm hover:shadow-md cursor-pointer"
                  onClick={() => setSelected(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setSelected(item);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{item.price}</div>
                      <div className="text-xs text-gray-400">{item.id}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3D / AR viewer */}
            <div id="3d" className="md:col-span-2 bg-white rounded p-4 shadow">
              <h2 className="text-lg font-bold mb-3">3D / AR Viewer</h2>

              {/* If user forced fallback, use ThreeFallback even if model-viewer loaded */}
              {!mvLoaded || forceFallback ? (
                <>
                  <div className="w-full h-[60vh] border rounded overflow-hidden mb-3" style={{ position: "relative" }}>
                    {/* Use existing ThreeFallback component from your repo */}
                    <ThreeFallback modelUrl={selected?.glb ?? menu.items[0]?.glb ?? ""} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        Selected: <span className="font-medium">{selected?.name ?? menu.items[0]?.name}</span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          const url = selected?.glb || menu.items[0]?.glb;
                          if (url) window.open(url, "_blank");
                        }}
                        className="px-3 py-2 border rounded"
                      >
                        Open GLB
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // model-viewer path (AR + 3D)
                <>
                  <div className="w-full h-[60vh] border rounded overflow-hidden mb-3" style={{ position: "relative" }}>
                    <model-viewer
                      id="mv"
                      ref={mvRef as any}
                      alt={selected?.name ?? "Dish 3D"}
                      src={selected?.glb ?? (menu.items[0] && menu.items[0].glb) ?? ""}
                      ios-src={selected?.usdz ?? ""}
                      ar
                      ar-modes="webxr scene-viewer quick-look"
                      camera-controls
                      auto-rotate
                      style={{ width: "100%", height: "100%", background: "#f7f7f7" }}
                    />
                    {/* Optional simple overlay hint */}
                    <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(255,255,255,0.85)", padding: "6px 10px", borderRadius: 8 }}>
                      <small className="text-xs text-gray-700">Tap the AR icon to place in your space</small>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        Selected: <span className="font-medium">{selected?.name ?? menu.items[0]?.name}</span>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          const url = selected?.glb || menu.items[0]?.glb;
                          if (url) window.open(url, "_blank");
                        }}
                        className="px-3 py-2 border rounded"
                      >
                        Open GLB
                      </button>

                      <button
                        onClick={() => {
                          alert(
                            "Tip: On a supported phone, tap the AR icon in the viewer to place the dish in your space. Allow camera access if prompted."
                          );
                        }}
                        className="px-3 py-2 bg-green-600 text-white rounded"
                      >
                        How to use AR
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4 text-sm text-gray-500">
                <strong>Fallback:</strong> if AR isn't supported, the 3D canvas (ThreeFallback) will render a simple preview.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
