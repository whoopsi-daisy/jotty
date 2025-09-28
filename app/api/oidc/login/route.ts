import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

export async function GET(request: NextRequest) {
    const ssoMode = process.env.SSO_MODE;
    const appUrl = process.env.APP_URL || request.nextUrl.origin;

    if (ssoMode !== "oidc") {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }

    const issuer = process.env.OIDC_ISSUER || "";
    const clientId = process.env.OIDC_CLIENT_ID || "";
    if (!issuer || !clientId) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }

    const discoveryUrl = issuer.endsWith("/") ? `${issuer}.well-known/openid-configuration` : `${issuer}/.well-known/openid-configuration`;
    const discoveryRes = await fetch(discoveryUrl, { cache: "no-store" });
    if (!discoveryRes.ok) {
        return NextResponse.redirect(`${appUrl}/auth/login`);
    }
    const discovery = await discoveryRes.json() as { authorization_endpoint: string };
    const authorizationEndpoint = discovery.authorization_endpoint;

    const verifier = base64UrlEncode(crypto.randomBytes(32));
    const challenge = base64UrlEncode(sha256(verifier));
    const state = base64UrlEncode(crypto.randomBytes(16));
    const nonce = base64UrlEncode(crypto.randomBytes(16));

    const redirectUri = `${appUrl}/api/oidc/callback`;

    const url = new URL(authorizationEndpoint);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", "openid profile email");
    url.searchParams.set("code_challenge", challenge);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("state", state);
    url.searchParams.set("nonce", nonce);

    const response = NextResponse.redirect(url);
    response.cookies.set("oidc_verifier", verifier, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });
    response.cookies.set("oidc_state", state, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });
    response.cookies.set("oidc_nonce", nonce, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 600 });
    return response;
}


