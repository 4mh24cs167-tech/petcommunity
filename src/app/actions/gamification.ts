'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export const BADGES = {
  PROFILE_COMPLETE: 'Profile Completed',
  FIRST_PET: 'First Pet',
  VET_VERIFIED: 'Vet Verified',
};

export async function checkGamification(userId: string) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch profile
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) return { success: false, newPoints: 0, newBadges: [] };

  // Fetch pets
  const { data: petRows } = await supabaseAdmin
    .from('pets')
    .select('id')
    .eq('owner_id', userId);

  let pointsEarned = 0;
  const newBadges: string[] = [];
  const currentBadges: string[] = profile.badges || [];

  // Check Profile Completion
  const isProfileComplete = profile.full_name && profile.avatar_url && profile.location;
  if (isProfileComplete && !currentBadges.includes(BADGES.PROFILE_COMPLETE)) {
    newBadges.push(BADGES.PROFILE_COMPLETE);
    pointsEarned += 100;
  }

  // Check First Pet
  if (petRows && petRows.length > 0 && !currentBadges.includes(BADGES.FIRST_PET)) {
    newBadges.push(BADGES.FIRST_PET);
    pointsEarned += 50;
  }

  // Update profile if new rewards
  if (pointsEarned > 0 || newBadges.length > 0) {
    const updatedBadges = [...currentBadges, ...newBadges];
    const newPoints = (profile.pet_points || 0) + pointsEarned;
    
    await supabaseAdmin
      .from('profiles')
      .update({
        pet_points: newPoints,
        badges: updatedBadges
      })
      .eq('id', userId);

    revalidatePath('/profile');
    return { success: true, newPoints: pointsEarned, newBadges };
  }

  return { success: true, newPoints: 0, newBadges: [] };
}
