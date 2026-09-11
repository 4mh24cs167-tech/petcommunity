'use server'

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export const BADGES = {
  PROFILE_COMPLETE: 'Profile Completed',
  FIRST_PET: 'First Pet',
  VET_VERIFIED: 'Vet Verified',
};

export async function checkGamification(userId: string) {
  const profile = await db.profile.findUnique({
    where: { id: userId },
    include: { pets: true }
  });

  if (!profile) return { success: false };

  let pointsEarned = 0;
  const newBadges: string[] = [];
  const currentBadges = profile.badges || [];

  // Check Profile Completion
  const isProfileComplete = profile.fullName && profile.avatarUrl && profile.location;
  if (isProfileComplete && !currentBadges.includes(BADGES.PROFILE_COMPLETE)) {
    newBadges.push(BADGES.PROFILE_COMPLETE);
    pointsEarned += 100;
  }

  // Check First Pet
  if (profile.pets.length > 0 && !currentBadges.includes(BADGES.FIRST_PET)) {
    newBadges.push(BADGES.FIRST_PET);
    pointsEarned += 50;
  }

  // Update profile if new rewards
  if (pointsEarned > 0 || newBadges.length > 0) {
    await db.profile.update({
      where: { id: userId },
      data: {
        petPoints: { increment: pointsEarned },
        badges: { push: newBadges }
      }
    });
    revalidatePath('/profile');
    return { success: true, newPoints: pointsEarned, newBadges };
  }

  return { success: true, newPoints: 0, newBadges: [] };
}
