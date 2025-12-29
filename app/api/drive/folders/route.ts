import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { getDriveForUser } from '@/lib/google/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const drive = await getDriveForUser(session.user.id);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    // First, let's test basic Drive access
    try {
      const aboutResponse = await drive.about.get({ fields: 'user,storageQuota' });
      console.log('Drive access successful for user:', aboutResponse.data.user?.emailAddress);
    } catch (aboutError) {
      console.error('Drive access failed:', aboutError);
      throw new Error('Cannot access Google Drive API');
    }

    // Search for folders - include shared folders and owned folders
    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and trashed=false${query ? ` and name contains '${query}'` : ''}`,
      fields: 'files(id,name,parents,modifiedTime,shared,owners,permissions)',
      orderBy: 'modifiedTime desc',
      pageSize: Math.min(pageSize, 100), // Max 100
      corpora: 'allDrives', // Include all drives (My Drive, Shared Drives)
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    const folders = response.data.files?.map(folder => ({
      id: folder.id,
      name: folder.name,
      modifiedTime: folder.modifiedTime,
      shared: folder.shared,
      parents: folder.parents,
    })) || [];

    console.log(`Found ${folders.length} folders for user ${session.user.id}`);
    if (folders.length > 0) {
      console.log('Sample folders:', folders.slice(0, 3).map(f => ({ id: f.id, name: f.name })));
    } else {
      console.log('No folders found. This could be because:');
      console.log('1. User has no folders in Google Drive');
      console.log('2. Folders are in Shared Drives not accessible');
      console.log('3. Permission scope issues');
      console.log('4. Folders are trashed or hidden');
    }

    return NextResponse.json({
      success: true,
      data: folders,
    });
  } catch (error) {
    console.error('Error fetching Drive folders:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch folders',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}