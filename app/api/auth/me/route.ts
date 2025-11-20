import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    // Read cookie from request headers
    // In Next.js App Router, request.cookies is not available here, so parse from headers
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('auth_token='));
    const token = match ? match.split('=')[1] : null;

    if (!token) {
      console.log('[auth/me] no token');
      return NextResponse.json({ ok: false, error: 'No token' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || 'please-set-a-secret';
    let payload: any;
    try {
      payload = jwt.verify(token, secret) as any;
    } catch (err) {
      console.log('[auth/me] token verify failed', err);
      return NextResponse.json({ ok: false, error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });

    // return basic user info
    return NextResponse.json({ ok: true, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('[auth/me] error', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
