import { NextResponse } from 'next/server';
import { UrlEntry, UrlStatus } from '@/types';
import { urlEntries } from '@/lib/data/inMemoryStore';

export async function POST(request: Request) {
  const { id, newStatus } = await request.json();

  if (!id || !newStatus) {
    return NextResponse.json({ error: 'ID and newStatus are required' }, { status: 400 });
  }

  const entryIndex = urlEntries.findIndex((entry) => entry.id === id);

  if (entryIndex === -1) {
    return NextResponse.json({ error: 'URL entry not found' }, { status: 404 });
  }

  urlEntries[entryIndex] = {
    ...urlEntries[entryIndex],
    status: newStatus as UrlStatus,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(urlEntries[entryIndex], { status: 200 });
}
