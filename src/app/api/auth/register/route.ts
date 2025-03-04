import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { z } from 'zod';
import { IRegisterRequest, IUser, UserRole } from '../../../../types/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-shhhhh';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

// Helper functions
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const generateToken = (user: Omit<IUser, 'password'>): string => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
};


export async function POST(request: Request) {
  try {
    const body: IRegisterRequest = await request.json();

    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid registration data', details: result.error.issues },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'users-db.json');
    const users: IUser[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (users.some((u) => u.email === body.email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(body.password);

    const newUser: IUser = {
      id: crypto.randomUUID(),
      email: body.email,
      password: hashedPassword,
      firstName: body.firstName,
      lastName: body.lastName,
      role: UserRole.USER,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    const { password, ...userWithoutPassword } = newUser;
    const token = generateToken(userWithoutPassword);

    console.log('Register response:', {
      user: userWithoutPassword,
      token,
    });

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Error processing registration request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
