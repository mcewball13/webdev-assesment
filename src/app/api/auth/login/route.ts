import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { ILoginRequest, IUser } from '../../../../types/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-shhhhh';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

const generateToken = (user: Omit<IUser, 'password'>): string => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
};


export async function POST(request: Request) {
  try {
    const body: ILoginRequest = await request.json();

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid login data', details: result.error.issues },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'users-db.json');
    const users: IUser[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const user = users.find((u) => u.email === body.email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await comparePassword(body.password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error processing login request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
