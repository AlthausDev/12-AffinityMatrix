import { Profile } from '../../domain/profile/profile';
import { PortableProfile } from './portable-profile';

export interface ProfileCodeCodec {
  encode(profile: Profile): string;
  decode(code: string): PortableProfile;
}
