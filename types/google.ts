export interface DrivePermission {
  id: string;
  type: 'user' | 'group' | 'domain' | 'anyone';
  emailAddress?: string;
  domain?: string;
  role:
    | 'owner'
    | 'organizer'
    | 'fileOrganizer'
    | 'writer'
    | 'commenter'
    | 'reader';
  deleted?: boolean;
  displayName?: string;
  photoLink?: string;
}

export interface DrivePermissionsResponse {
  permissions: DrivePermission[];
  nextPageToken?: string;
}

export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken?: string;
}

export interface OAuth2Tokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
  token_type: string;
}
