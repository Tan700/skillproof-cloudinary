import { supabase } from '@/lib/supabase/client';
import { Project, ProjectAsset } from '@/lib/types';

type DbProject = {
  id: string;
  profile_id: string;
  title: string;
  slug: string;
  description: string | null;
  skills: string[] | null;
  github_url: string | null;
  live_url: string | null;
  is_public: boolean;
  created_at: string;
  profiles:
    | {
        display_name: string;
        role: string | null;
      }
    | null;
    project_assets:
    | Array<{
        id: string;
        project_id: string;
        cloudinary_public_id: string;
        secure_url: string;
        resource_type: 'image' | 'video' | 'raw';
        format: string | null;
        width: number | null;
        height: number | null;
        duration: number | null;
        label: string | null;
        metadata: Record<string, unknown> | null;
        created_at: string;
      }>
    | null;
};

export async function ensureAnonymousProfile() {
  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      throw new Error(`Anonymous sign-in failed: ${error.message}`);
    }

    session = data.session;

    if (!session?.user) {
      throw new Error('Supabase did not return an anonymous user.');
    }
  }

  const user = session.user;

  const { data: existingProfile, error: profileLookupError } =
    await supabase
      .from('profiles')
      .select('id, user_id, display_name, role, username')
      .eq('user_id', user.id)
      .maybeSingle();

  if (profileLookupError) {
    throw new Error(
      `Profile lookup failed: ${profileLookupError.message}`
    );
  }

  if (existingProfile) {
    return {
      userId: user.id,
      profileId: existingProfile.id,
      displayName: existingProfile.display_name,
      role: existingProfile.role ?? 'Student Builder',
    };
  }

  const username = `builder-${user.id.slice(0, 8)}`;

  const { data: newProfile, error: profileInsertError } =
    await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        username,
        display_name: 'Demo Student',
        role: 'Student Builder',
        bio: 'Building projects and sharing visual proof of work.',
      })
      .select()
      .single();

  if (profileInsertError || !newProfile) {
    throw new Error(
      `Profile creation failed: ${
        profileInsertError?.message ?? 'Unknown error'
      }`
    );
  }

  return {
    userId: user.id,
    profileId: newProfile.id,
    displayName: newProfile.display_name,
    role: newProfile.role ?? 'Student Builder',
  };
}

function mapDbProject(row: DbProject): Project {
  const profile = row.profiles;

  const assets: ProjectAsset[] = (row.project_assets ?? []).map(
    (asset) => ({
      publicId: asset.cloudinary_public_id,
      secureUrl: asset.secure_url,
      resourceType: asset.resource_type,
      format: asset.format ?? undefined,
      width: asset.width ?? undefined,
      height: asset.height ?? undefined,
      duration: asset.duration ?? undefined,
      createdAt: asset.created_at,
      label: asset.label ?? undefined,
    })
  );

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description:
      row.description ?? 'A proof-of-work project.',
    skills: row.skills ?? [],
    creator:
      profile?.display_name ?? 'Demo Student',
    creatorRole:
      profile?.role ?? 'Student Builder',
    createdAt: row.created_at.slice(0, 10),
    assets,
    links: {
      github: row.github_url ?? undefined,
      demo: row.live_url ?? undefined,
    },
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      profile_id,
      title,
      slug,
      description,
      skills,
      github_url,
      live_url,
      is_public,
      created_at,
      profiles (
        display_name,
        role
      ),
      project_assets (
        id,
        project_id,
        cloudinary_public_id,
        secure_url,
        resource_type,
        format,
        width,
        height,
        duration,
        label,
        metadata,
        created_at
      )
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Project fetch failed: ${error.message}`);
  }

  return (data as unknown as DbProject[]).map(mapDbProject);
}

export async function createSupabaseProject(input: {
  title: string;
  description: string;
  skills: string[];
}) {
  const profile = await ensureAnonymousProfile();

  const baseSlug =
    input.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'untitled-project';

  const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

  const { data, error } = await supabase
    .from('projects')
    .insert({
      profile_id: profile.profileId,
      title: input.title.trim() || 'Untitled Project',
      slug,
      description:
        input.description.trim() || 'A new proof-of-work project.',
      skills: input.skills,
      is_public: true,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(
      `Project creation failed: ${error?.message ?? 'Unknown error'}`
    );
  }

  return {
    ...data,
    profileId: profile.profileId,
  };
}

export async function addSupabaseProjectAsset(
  projectId: string,
  asset: ProjectAsset
) {
  const { data, error } = await supabase
    .from('project_assets')
    .insert({
      project_id: projectId,
      cloudinary_public_id: asset.publicId,
      secure_url: asset.secureUrl,
      resource_type: asset.resourceType,
      format: asset.format ?? null,
      width: asset.width ?? null,
      height: asset.height ?? null,
      duration: asset.duration ?? null,
      label: asset.label ?? null,
      metadata: {
        product: 'skillproof',
        source: 'cloudinary-upload-widget',
        cloudinary_public_id: asset.publicId,
      },
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(
      `Asset record creation failed: ${
        error?.message ?? 'Unknown error'
      }`
    );
  }

  return data;
}

export async function fetchProjectBySlug(
  slug: string
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      profile_id,
      title,
      slug,
      description,
      skills,
      github_url,
      live_url,
      is_public,
      created_at,
      profiles (
        display_name,
        role
      ),
      project_assets (
        id,
        project_id,
        cloudinary_public_id,
        secure_url,
        resource_type,
        format,
        width,
        height,
        duration,
        label,
        metadata,
        created_at
      )
    `)
    .eq('slug', slug)
    .eq('is_public', true)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Project lookup failed: ${error.message}`
    );
  }

  if (!data) {
    return null;
  }

  return mapDbProject(data as unknown as DbProject);
}