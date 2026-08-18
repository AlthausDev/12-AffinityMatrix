import { Profile } from '../../domain/profile/profile';
import { PortableProfile, ProfileExportOptions } from './portable-profile';

export interface ProfileCodeCodec {
  encode(profile: Profile, options?: ProfileExportOptions): string;
  decode(code: string): PortableProfile;
}
