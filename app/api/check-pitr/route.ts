import { NextResponse } from 'next/server';

export async function GET() {
  const managementApiToken = process.env.NEXT_PUBLIC_SUPABASE_MANAGEMENT_TOKEN;


  if (!managementApiToken) {
    return NextResponse.json({ success: false, message: 'Missing management token.' }, { status: 500 });
  }

  const projects = await fetchProjects(managementApiToken);

  const activeProjects = projects.filter((project: any) => project.status !== 'INACTIVE');


  // console.log("projects", projects)

  const results = await Promise.all(
    activeProjects.map(async (project: any) => {
      // console.log("project id is", project.id)
      const response = await fetch(`https://api.supabase.io/v1/projects/${project.id}/database/backups`, {
        headers: {
          'Authorization': `Bearer ${managementApiToken}`,
          'Content-Type': 'application/json',
        },
      });


      if (!response.ok) {
        throw new Error(`Failed to fetch backups: ${response.statusText}`);
      }

      const backups = await response.json();
      const pitrEnabled = backups.pitr_enabled;

      return {
        id: project.id,
        name: project.name,
        pitrEnabled,
      };
    })
  );

  return NextResponse.json({ success: true, results }, { status: 200 });
}

async function fetchProjects(managementApiToken: string) {
  const response = await fetch('https://api.supabase.io/v1/projects', {
    headers: {
      'Authorization': `Bearer ${managementApiToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
  }

  return response.json();
}
