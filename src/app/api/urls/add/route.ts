import { NextResponse } from 'next/server';
import { UrlEntry } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { urlEntries } from '@/lib/data/inMemoryStore';

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const newEntry: UrlEntry = {
    id: uuidv4(),
    url,
    status: 'Queued',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  urlEntries.push(newEntry);

  return NextResponse.json(newEntry, { status: 201 });
}
