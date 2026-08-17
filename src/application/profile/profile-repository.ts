import { Profile, ProfileId } from '../../domain/profile/profile';

export interface ProfileRepository {
  findAll(): readonly Profile[];
  findById(id: ProfileId): Profile | undefined;
  save(profile: Profile): void;
  delete(id: ProfileId): void;
}
