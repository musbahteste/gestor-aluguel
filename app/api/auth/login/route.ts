import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log('[auth/login] body:', { username: !!username, password: !!password });

    if (!username || !password) {
      console.log('[auth/login] missing credentials');
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      console.log('[auth/login] user not found', username);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('[auth/login] invalid password for', username);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create token and set cookie
    const secret = process.env.JWT_SECRET || 'please-set-a-secret';
    const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '7d' });

    const res = NextResponse.json({ ok: true, user: { id: user.id, username: user.username, role: user.role } });
    const secure = process.env.NODE_ENV === 'production';
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure,
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log('[auth/login] success, setting cookie');
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
