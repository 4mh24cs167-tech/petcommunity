import { db } from '@/prisma/db';
import { createClient } from '@/lib/supabase-server'; // Assuming this exists or we can use standard supabase

// Define badge criteria
export const BADGES = {
  PROFILE_COMPLETE: 'Profile Completed',
  FIRST_PET: 'First Pet Added',
  VET_VERIFIED: 'Verified Vet Visit',
  TOP_CONTRIBUTOR: 'Top Contributor',
};

// Award points to a user
export async function awardPoints(userId: string, points: number) {
  try {
    const profile = await db.profile.update({
      where: { id: userId },
      data: {
        petPoints: { increment: points }
      }
    });
    return { success: true, points: profile.petPoints };
  } catch (error) {
    console.error('Error awarding points:', error);
    return { success: false, error };
  }
}

// Award a badge to a user if they don't already have it
export async function awardBadge(userId: string, badgeName: string) {
  try {
    const profile = await db.profile.findUnique({
      where: { id: userId },
      select: { badges: true }
    });

    if (!profile) return { success: false, error: 'Profile not found' };

    const currentBadges = profile.badges || [];
    if (currentBadges.includes(badgeName)) {
      return { success: true, message: 'Badge already awarded', badges: currentBadges };
    }

    const updatedProfile = await db.profile.update({
      where: { id: userId },
      data: {
        badges: { push: badgeName }
      }
    });

    return { success: true, badges: updatedProfile.badges, newBadge: badgeName };
  } catch (error) {
    console.error('Error awarding badge:', error);
    return { success: false, error };
  }
}

// Check profile completion and award points/badges
export async function checkProfileCompletion(userId: string) {
  const profile = await db.profile.findUnique({
    where: { id: userId },
    include: { pets: true }
  });

  if (!profile) return;

  // Award First Pet badge
  if (profile.pets.length > 0 && !profile.badges?.includes(BADGES.FIRST_PET)) {
    await awardBadge(userId, BADGES.FIRST_PET);
    await awardPoints(userId, 50); // 50 points for first pet
  }

  // Award Profile Completed badge (if they have avatar, name, and location)
  const isProfileComplete = profile.fullName && profile.avatarUrl && profile.location;
  if (isProfileComplete && !profile.badges?.includes(BADGES.PROFILE_COMPLETE)) {
    await awardBadge(userId, BADGES.PROFILE_COMPLETE);
    await awardPoints(userId, 100); // 100 points for completing profile
  }
}
