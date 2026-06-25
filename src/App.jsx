import { useState, useEffect, useCallback } from "react";

const WHATSAPP_NUMBER = "2348142124134";

// Credentials are stored in this browser's localStorage only - never sent
// anywhere except directly to Airtable's API from this device.
const STORAGE_KEYS = {
  token: "storefront_pat",
  baseId: "storefront_base_id",
  tableId: "storefront_table_id",
};

const DEFAULT_BASE_ID = "app3l8V0WcJvHgtBg";
const DEFAULT_TABLE_ID = "tblySJiI95t8oDzBd";

function loadCreds() {
  try {
    return {
      token: window.localStorage.getItem(STORAGE_KEYS.token) || "",
      baseId: window.localStorage.getItem(STORAGE_KEYS.baseId) || DEFAULT_BASE_ID,
      tableId: window.localStorage.getItem(STORAGE_KEYS.tableId) || DEFAULT_TABLE_ID,
    };
  } catch {
    return { token: "", baseId: DEFAULT_BASE_ID, tableId: DEFAULT_TABLE_ID };
  }
}

function saveCreds(creds) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.token, creds.token);
    window.localStorage.setItem(STORAGE_KEYS.baseId, creds.baseId);
    window.localStorage.setItem(STORAGE_KEYS.tableId, creds.tableId);
  } catch {
    // storage unavailable (e.g. private browsing) - app still works for this session
  }
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
 return new Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
       maximumFractionDigits: 2,
     }).format(num);
}

function isVideoAttachment(att) {
  const type = att?.type || "";
  const name = att?.filename || "";
  return type.startsWith("video/") || /\.(mp4|mov|webm|m4v)$/i.test(name);
}

function whatsappLink(product) {
  const lines = [
    `Hi, I'd like to order:`,
    `${product.name}`,
  ];
  if (product.priceLabel) lines.push(`Price: ${product.priceLabel}`);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function ScaleDivider() {
  return (
    <svg
      width="100%"
      height="10"
      viewBox="0 0 240 10"
      preserveAspectRatio="none"
      style={{ display: "block", opacity: 0.5 }}
      aria-hidden="true"
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <path
          key={i}
          d={`M ${i * 10} 10 Q ${i * 10 + 5} 0 ${i * 10 + 10} 10`}
          fill="none"
          stroke="#D9A441"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

function SettingsPanel({ creds, onSave, onClose, hasToken }) {
  const [token, setToken] = useState(creds.token);
  const [baseId, setBaseId] = useState(creds.baseId);
  const [tableId, setTableId] = useState(creds.tableId);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(13,43,46,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "#F1ECDF",
          borderRadius: 12,
          maxWidth: 440,
          width: "100%",
          padding: 28,
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <h2
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 22,
            color: "#0D2B2E",
            margin: "0 0 6px",
          }}
        >
          Connect your Airtable
        </h2>
        <p style={{ fontSize: 13, color: "#5B6B63", margin: "0 0 20px", lineHeight: 1.5 }}>
          Stored only in this browser. Never shared, never sent anywhere else.
        </p>

        <label style={{ display: "block", fontSize: 12, color: "#0D2B2E", fontWeight: 600, marginBottom: 4 }}>
          Personal access token
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="pat..."
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #CFC8B4",
            marginBottom: 14,
            fontSize: 14,
            boxSizing: "border-box",
            background: "#FFFEFA",
            color: "#0D2B2E",
          }}
        />

        <label style={{ display: "block", fontSize: 12, color: "#0D2B2E", fontWeight: 600, marginBottom: 4 }}>
          Base ID
        </label>
        <input
          type="text"
          value={baseId}
          onChange={(e) => setBaseId(e.target.value)}
          placeholder="app..."
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #CFC8B4",
            marginBottom: 14,
            fontSize: 14,
            boxSizing: "border-box",
            background: "#FFFEFA",
            color: "#0D2B2E",
          }}
        />

        <label style={{ display: "block", fontSize: 12, color: "#0D2B2E", fontWeight: 600, marginBottom: 4 }}>
          Table ID or name
        </label>
        <input
          type="text"
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
          placeholder="tbl... or Products"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #CFC8B4",
            marginBottom: 22,
            fontSize: 14,
            boxSizing: "border-box",
            background: "#FFFEFA",
            color: "#0D2B2E",
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => onSave({ token, baseId, tableId })}
            disabled={!token || !baseId || !tableId}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: 8,
              border: "none",
              background: "#4FA8A0",
              color: "#06201E",
              fontWeight: 600,
              fontSize: 14,
              cursor: token && baseId && tableId ? "pointer" : "not-allowed",
              opacity: token && baseId && tableId ? 1 : 0.5,
            }}
          >
            Save and load
          </button>
          {hasToken && (
            <button
              onClick={onClose}
              style={{
                padding: "11px 16px",
                borderRadius: 8,
                border: "1px solid #CFC8B4",
                background: "transparent",
                color: "#0D2B2E",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Storefront() {
  const [creds, setCreds] = useState(loadCreds);
  const [showSettings, setShowSettings] = useState(!loadCreds().token);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const fetchProducts = useCallback(async (c) => {
    if (!c.token || !c.baseId || !c.tableId) return;
    setLoading(true);
    setError("");
    try {
      let all = [];
      let offset = null;
      do {
        const url = new URL(
          `https://api.airtable.com/v0/${c.baseId}/${encodeURIComponent(c.tableId)}`
        );
        url.searchParams.set("pageSize", "100");
        if (offset) url.searchParams.set("offset", offset);

        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${c.token}` },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            body?.error?.message || `Airtable returned ${res.status}`
          );
        }

        const data = await res.json();
        all = all.concat(data.records || []);
        offset = data.offset || null;
      } while (offset);

      const mapped = all.map((rec) => {
        const f = rec.fields || {};
        const attachments = f.Photos || f.Photo || f.Image || [];
        const priceRaw = f.Price;
        const priceLabel = formatPrice(priceRaw);
        return {
          id: rec.id,
          name: f.Name || f.Product || "Unnamed",
          priceRaw,
          priceLabel,
          availability: f.Availability || "Available",
          attachments: Array.isArray(attachments) ? attachments : [],
        };
      });

      setProducts(mapped);
    } catch (err) {
      setError(err.message || "Couldn't load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (creds.token) fetchProducts(creds);
  }, [creds, fetchProducts]);

  const handleSaveCreds = (newCreds) => {
    saveCreds(newCreds);
    setCreds(newCreds);
    setShowSettings(false);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D2B2E",
        fontFamily: "'Inter', system-ui, sans-serif",
        color: "#F1ECDF",
        paddingBottom: 60,
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Inter:wght@400;500;600;700&display=swap"
      />

      <header
        style={{
          padding: "32px 24px 20px",
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#D9A441",
              margin: "0 0 6px",
              fontWeight: 600,
            }}
          >
            Live stock list
          </p>
          <h1
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "clamp(28px, 5vw, 42px)",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Aquatic Tropicals
          </h1>
          <p style={{ fontSize: 14, color: "#A9BDB6", margin: "8px 0 0", maxWidth: 480 }}>
            Browse what's in the tanks right now. Tap any fish to order on WhatsApp.
          </p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
          style={{
            background: "transparent",
            border: "1px solid #3A5A56",
            color: "#A9BDB6",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Settings
        </button>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <ScaleDivider />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 0" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by species or name..."
          style={{
            width: "100%",
            maxWidth: 360,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #3A5A56",
            background: "#11363A",
            color: "#F1ECDF",
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        {loading && (
          <p style={{ color: "#A9BDB6", fontSize: 14 }}>Loading stock from Airtable...</p>
        )}

        {error && (
          <div
            style={{
              background: "#4A1B0C",
              color: "#F5C4B3",
              padding: "14px 16px",
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 20,
            }}
          >
            <strong>Couldn't load products:</strong> {error}
            <div style={{ marginTop: 8 }}>
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  background: "transparent",
                  border: "1px solid #F0997B",
                  color: "#F5C4B3",
                  borderRadius: 6,
                  padding: "6px 10px",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Check connection settings
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && products.length === 0 && creds.token && (
          <p style={{ color: "#A9BDB6", fontSize: 14 }}>
            No products found yet. Add some records in Airtable and refresh.
          </p>
        )}

        {!loading && !error && filtered.length === 0 && products.length > 0 && (
          <p style={{ color: "#A9BDB6", fontSize: 14 }}>No matches for "{query}".</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((product) => {
            const cover = product.attachments[0];
            const isAvailable = /unavailable|sold/i.test(product.availability) === false;
            return (
              <div
                key={product.id}
                style={{
                  background: "#F1ECDF",
                  borderRadius: 12,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    aspectRatio: "4 / 3",
                    background: "#0A2224",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {cover ? (
                    isVideoAttachment(cover) ? (
                      <video
                        src={cover.url}
                        muted
                        loop
                        playsInline
                        autoPlay
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <img
                        src={cover.url}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#5B6B63",
                        fontSize: 13,
                      }}
                    >
                      No photo yet
                    </div>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "rgba(13,43,46,0.75)",
                      color: "#F1ECDF",
                      fontSize: 11,
                      padding: "4px 9px",
                      borderRadius: 999,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: isAvailable ? "#5DCAA5" : "#E24B4A",
                        display: "inline-block",
                      }}
                    />
                    {product.availability}
                  </span>
                </div>

                <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "'Source Serif 4', Georgia, serif",
                      fontSize: 17,
                      margin: "0 0 6px",
                      color: "#0D2B2E",
                      lineHeight: 1.25,
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: product.priceLabel ? "#854F0B" : "#5B6B63",
                      margin: "0 0 14px",
                      fontStyle: product.priceLabel ? "normal" : "italic",
                    }}
                  >
                    {product.priceLabel || "Ask for price"}
                  </p>

                  <a
                    href={whatsappLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "#E8694A",
                      color: "#FFFBF6",
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: 600,
                      padding: "10px 14px",
                      borderRadius: 8,
                    }}
                  >
                    Order on WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showSettings && (
        <SettingsPanel
          creds={creds}
          hasToken={!!creds.token}
          onSave={handleSaveCreds}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
