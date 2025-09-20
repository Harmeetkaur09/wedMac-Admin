"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; // adjust path if needed
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, Check, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // success/info messages
  const [resendCooldown, setResendCooldown] = useState(0);

const { login, loginWithToken } = useAuth();  const router = useRouter();

  useEffect(() => {
    // redirect if user is already logged in — if your useAuth provides user, prefer that
    // (If useAuth exposes `user`, you can check and push; left out to keep generic)
  }, [router]);

  useEffect(() => {
    let t: number | undefined;
    if (resendCooldown > 0) {
      t = window.setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [resendCooldown]);

  const validatePhone = (p: string) => {
    // basic validation -- adjust to your format
    return /^\d{10}$/.test(p);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setInfo("");
    if (!validatePhone(phone)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("https://api.wedmacindia.com/api/superadmin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (data && (data.message || data.error)) || "Failed to send OTP";
        throw new Error(msg);
      }

      setStep("otp");
      setInfo("OTP sent to " + phone);
      setResendCooldown(30); // 30s cooldown for resend (adjust as needed)
    } catch (err: any) {
      console.error("sendOtp error:", err);
      setError(err?.message || "Unable to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

const handleVerifyOtp = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();
  setError("");
  setInfo("");

  if (!validatePhone(phone)) {
    setError("Please enter a valid phone number");
    return;
  }
  if (!otp || otp.trim().length < 3) {
    setError("Please enter the OTP");
    return;
  }

  try {
    setIsLoading(true);

    const payload = { phone, otp };
    const res = await fetch("https://api.wedmacindia.com/api/superadmin/verify-otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

    console.log("[verify-otp] status:", res.status, "body:", data);

    if (!res.ok) {
      const serverMsg = (data && (data.message || data.error)) || data.raw || `OTP verification failed (status ${res.status})`;
      throw new Error(serverMsg);
    }

    const access =
      data?.access ||
      data?.token ||
      data?.accessToken ||
      data?.access_token ||
      data?.authToken ||
      data?.data?.access ||
      data?.data?.token;

    const refresh = data?.refresh || data?.refreshToken || data?.refresh_token;

    // IMPORTANT: build a fallback user object using username/is_superuser when server hasn't returned `user`
    const userObj =
      data?.user ||
      data?.admin ||
      (data?.data && typeof data.data === "object" && data.data.user) ||
      {
        username: data?.username || data?.user_name || "",
        is_superuser: data?.is_superuser ?? false,
      };

    if (!access) {
      console.warn("[verify-otp] no access token in response keys:", Object.keys(data || {}));
      setError("OTP verified but no access token received from server.");
      return;
    }

    // Prefer calling loginWithToken so AuthProvider updates React state immediately
    if (typeof loginWithToken === "function") {
      try {
        await loginWithToken(access, userObj);
      } catch (err) {
        console.warn("loginWithToken failed, falling back to direct storage:", err);
        sessionStorage.setItem("accessToken", access);
        try { localStorage.setItem("atlas_admin_user", JSON.stringify(userObj)); } catch {}
      }
    } else {
      // fallback directly store the keys AuthProvider expects
      sessionStorage.setItem("accessToken", access);
      try { localStorage.setItem("atlas_admin_user", JSON.stringify(userObj)); } catch (err) { console.warn(err); }
    }

    // keep authData for compatibility with any other code
    try {
      const authObj = { token: access, access, refresh, user: userObj };
      sessionStorage.setItem("authData", JSON.stringify(authObj));
      console.log("[verify-otp] stored authData/session keys:", authObj);
    } catch (e) { console.warn(e); }

    // optional dev cookie (not secure) - remove in production if backend sets httpOnly cookie
    try { document.cookie = `access=${encodeURIComponent(access)}; path=/; max-age=${60 * 60 * 24}`; } catch (e) {}

    setInfo("Login successful — redirecting to dashboard...");
    router.push("/dashboard");
  } catch (err: any) {
    console.error("[verify-otp] error:", err);
    setError(err?.message || "OTP verification failed");
  } finally {
    setIsLoading(false);
  }
};



  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await handleSendOtp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-white/90 shadow-2xl border-0 animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-50 h-50 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <img src="/images/website_logo.png" alt="Website Logo" width={140} height={50} className="object-contain" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] bg-clip-text text-transparent">
              Wedmac India Admin
            </CardTitle>
            <CardDescription className="text-gray-600">Sign in to access the admin dashboard</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone
                </Label>
                <div className="relative group">
                  <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-[#FF6B9D] transition-colors" />
                  <Input
                    id="phone"
                    type="text"
                    placeholder="1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                    className="pl-10 border-gray-200 focus:border-[#FF6B9D] focus:ring-[#FF6B9D] transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {info && (
                <Alert variant="default">
                  <AlertDescription>{info}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] text-white font-medium py-3 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Enter OTP sent to {phone}
                </Label>
                <div className="relative group">
                  <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-[#FF6B9D] transition-colors" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
                    className="pl-10 border-gray-200 focus:border-[#FF6B9D] focus:ring-[#FF6B9D] transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="md:flex block items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                    setError("");
                    setInfo("");
                  }}
                  className="py-2"
                  disabled={isLoading}
                >
                  Change Phone
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading || resendCooldown > 0}
                    className="py-2"
                  >
                    {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend OTP"}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#FF6B9D] to-[#FF5A8C] text-white font-medium py-2 px-4 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2"><Check /> Verify</span>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {info && (
                <Alert variant="default">
                  <AlertDescription>{info}</AlertDescription>
                </Alert>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
