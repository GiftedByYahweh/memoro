import type { UseCase } from '@/common/use-case';
import type { Profile } from '../entities/profile.entity';
import type { ProfileRepository } from '../repositories/profile.repository';

export interface CreateProfileInput {
  userId: string;
}

export type CreateProfileUseCase = UseCase<CreateProfileInput, Profile>;

export interface CreateProfileUseCaseDeps {
  profileRepository: ProfileRepository;
}

export function createProfileUseCase(deps: CreateProfileUseCaseDeps): CreateProfileUseCase {
  const { profileRepository } = deps;

  return async (input: CreateProfileInput): Promise<Profile> => {
    return profileRepository.create(input);
  };
}
