import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

function base64UrlEncode(buffer: Buffer) {
    return buffer
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

function sha256(input: string) {
    return crypto.createHash("sha256").update(input).digest();
}

async function ensureUser(username: string, isAdmin: boolean) {
    const usersFile = path.join(process.cwd(), "data", "users", "users.json");
    await fs.mkdir(path.dirname(usersFile), { recursive: true });
    let users: any[] = [];
    try {
        const content = await fs.readFile(usersFile, "utf-8");
        users = JSON.parse(content);
    } catch { }

    if (users.length === 0) {
        users.push({ username, passwordHash: "", isAdmin: true, isSuperAdmin: true, createdAt: new Date().toISOString() });
    } else {
        const existing = users.find((u) => u.username === username);
        if (!existing) {
            users.push({ username, passwordHash: "", isAdmin, createdAt: new Date().toISOString() });
        } else if (isAdmin && !existing.isAdmin) {
            existing.isAdmin = true;
        }
    }
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));

    const checklistDir = path.join(process.cwd(), "data", "checklists", username);
    const notesDir = path.join(process.cwd(), "data", "notes", username);
    await fs.mkdir(checklistDir, { recursive: true });
    await fs.mkdir(notesDir, { recursive: true });
}

export async function GET(request: NextRequest) {
    const appUrl = process.env.APP_URL || request.nextUrl.origin;

    if (process.env.SSO_MODE !== "oidc") {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }

    const issuer = process.env.OIDC_ISSUER || "";
    const clientId = process.env.OIDC_CLIENT_ID || "";
    if (!issuer || !clientId) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }

    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const savedState = request.cookies.get("oidc_state")?.value;
    const verifier = request.cookies.get("oidc_verifier")?.value;
    const nonce = request.cookies.get("oidc_nonce")?.value;
    if (!code || !state || !savedState || state !== savedState || !verifier) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }

    const discoveryUrl = issuer.endsWith("/") ? `${issuer}.well-known/openid-configuration` : `${issuer}/.well-known/openid-configuration`;
    const discoveryRes = await fetch(discoveryUrl, { cache: "no-store" });
    if (!discoveryRes.ok) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }
    const discovery = await discoveryRes.json() as { token_endpoint: string; userinfo_endpoint?: string; jwks_uri: string };
    const tokenEndpoint = discovery.token_endpoint;

    const redirectUri = `${appUrl}/api/oidc/callback`;

    const body = new URLSearchParams();
    body.set("grant_type", "authorization_code");
    body.set("code", code);
    body.set("redirect_uri", redirectUri);
    body.set("client_id", clientId);
    body.set("code_verifier", verifier);

    const tokenRes = await fetch(tokenEndpoint, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
    });
    if (!tokenRes.ok) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }
    const token = await tokenRes.json() as { id_token?: string; access_token?: string };
    const idToken = token.id_token;
    if (!idToken) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }

    const [headerB64, payloadB64] = idToken.split(".");
    const payloadJson = Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
    const claims = JSON.parse(payloadJson) as any;

    if (nonce && claims.nonce && claims.nonce !== nonce) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }

    const preferred = claims.preferred_username as string | undefined;
    const email = claims.email as string | undefined;
    const sub = claims.sub as string | undefined;
    let username = preferred || (email ? email.split("@")[0] : undefined) || sub || "";
    if (!username) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }

    const groups = (claims.groups || []) as string[];
    const adminGroups = (process.env.OIDC_ADMIN_GROUPS || "").split(",").map((g) => g.trim()).filter(Boolean);
    const isAdmin = adminGroups.length > 0 && groups.some((g) => adminGroups.includes(g));

    await ensureUser(username, isAdmin);

    const sessionId = base64UrlEncode(crypto.randomBytes(32));
    const response = NextResponse.redirect(`${appUrl}/`);
    response.cookies.set("session", sessionId, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });

    const sessionsFile = path.join(process.cwd(), "data", "users", "sessions.json");
    await fs.mkdir(path.dirname(sessionsFile), { recursive: true });
    let sessions: Record<string, string> = {};
    try {
        const content = await fs.readFile(sessionsFile, "utf-8");
        sessions = JSON.parse(content);
    } catch { }
    sessions[sessionId] = username;
    await fs.writeFile(sessionsFile, JSON.stringify(sessions, null, 2));

    response.cookies.delete("oidc_verifier");
    response.cookies.delete("oidc_state");
    response.cookies.delete("oidc_nonce");
    return response;
}


