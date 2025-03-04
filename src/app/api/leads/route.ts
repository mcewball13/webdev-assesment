import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { z } from 'zod';
import { LeadStatus } from '../../../types/enums';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  linkedinProfile: z
    .string()
    .url('Invalid URL')
    .regex(/linkedin\.com/, { message: 'Must be a LinkedIn URL' }),
  visasOfInterest: z.array(z.string()).min(1, 'Please select at least one visa type'),
  resume: z.any(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof schema> & { status: string };

export async function POST(request: Request) {
  try {
    const body: FormData = await request.json();

    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.issues },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'fake-db.json');
    const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const uniqueId = crypto.randomUUID();
    const fullEntry = {
      id: uniqueId,
      ...body,
      status: LeadStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.push(fullEntry);
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
    return NextResponse.json({ message: 'Lead submitted successfully' });
  } catch (error: unknown) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'fake-db.json');
  const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return NextResponse.json(db);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const filePath = path.join(process.cwd(), 'data', 'fake-db.json');
  const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const filteredDb = db.filter((lead: any) => lead.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(filteredDb, null, 2));
  return NextResponse.json({ message: 'Lead deleted successfully' });
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json();
  const filePath = path.join(process.cwd(), 'data', 'fake-db.json');
  const db = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const lead = db.find((lead: any) => lead.id === id);
  lead.status = status;
  fs.writeFileSync(filePath, JSON.stringify(db, null, 2));
  return NextResponse.json({ message: 'Lead updated successfully' });
}
