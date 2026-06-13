import { useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup 
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const msg = err.message.replace("Firebase: ", "").replace("auth/", "").replace(/-/g, " ");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err.message.replace("Firebase: ", "").replace("auth/", "").replace(/-/g, " ");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root" style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#07070a",
      padding: "20px",
      fontFamily: "'Figtree', -apple-system, sans-serif",
      zIndex: 1000
    }}>
      <div className="login-card" style={{
        width: "100%",
        maxWidth: 400,
        background: "#0e0e14",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 20,
        padding: "40px 32px",
        flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "linear-gradient(135deg, #7c5cfc, #a48bff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px",
            boxShadow: "0 4px 20px rgba(124,92,252,.3)"
          }}>◈</div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700,
            color: "#ededf2", letterSpacing: "-.03em", margin: 0
          }}>Echo AI</h1>
          <p style={{ fontSize: 13, color: "#8b8b9e", marginTop: 6 }}>
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(248,113,113,.09)", border: "1px solid rgba(248,113,113,.2)",
            borderRadius: 11, padding: "10px 14px", fontSize: 12, color: "#f87171", marginBottom: 16
          }}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 11.5, color: "#8b8b9e", marginBottom: 6, display: "block", fontWeight: 500 }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              style={{
                background: "#1a1a24", border: "1px solid rgba(255,255,255,.08)", borderRadius: 11,
                padding: "11px 14px", color: "#e2e2e8", fontSize: 14, width: "100%", outline: "none",
                transition: "all .18s", fontFamily: "inherit", boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(124,92,252,.4)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,.08)"}
            />
          </div>
          <div>
            <label style={{ fontSize: 11.5, color: "#8b8b9e", marginBottom: 6, display: "block", fontWeight: 500 }}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              style={{
                background: "#1a1a24", border: "1px solid rgba(255,255,255,.08)", borderRadius: 11,
                padding: "11px 14px", color: "#e2e2e8", fontSize: 14, width: "100%", outline: "none",
                transition: "all .18s", fontFamily: "inherit", boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(124,92,252,.4)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,.08)"}
            />
          </div>
          <button type="submit" disabled={loading}
            style={{
              background: "#7c5cfc", color: "#fff", border: "none", borderRadius: 11,
              padding: "12px 20px", fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
              marginTop: 4, boxShadow: "0 4px 16px rgba(124,92,252,.3)",
              fontFamily: "inherit", transition: "all .18s", width: "100%"
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = "#6d4ee8")}
            onMouseLeave={(e) => e.target.style.background = "#7c5cfc"}
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,.08)" }} />
          <span style={{ fontSize: 11, color: "#8b8b9e" }}>or</span>
          <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,.08)" }} />
        </div>

        <button onClick={handleGoogle} disabled={loading}
          style={{
            width: "100%", background: "#13131a", border: "1px solid rgba(255,255,255,.1)",
            borderRadius: 11, padding: "11px 20px", color: "#e2e2e8", fontSize: 14, fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 10, fontFamily: "inherit", transition: "all .18s"
          }}
          onMouseEnter={(e) => !loading && (e.target.style.background = "#1a1a24")}
          onMouseLeave={(e) => e.target.style.background = "#13131a"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#8b8b9e" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{ background: "none", border: "none", color: "#7c5cfc", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}