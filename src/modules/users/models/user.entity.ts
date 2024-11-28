export type UserEntity = {
  id: string;
  displayName: string;
  userPrincipalName: string;
  mail?: string;
  jobTitle?: string;
  busyHours?: number;
  show: boolean;
};

export const ShowUsersFilter = [
  'joao.priante@proaero.aero',
  'pedro@flyaxis.aero',
  'rodrigo@flyaxis.aero',
];
