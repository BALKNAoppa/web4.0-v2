export type AuthUser = {
  name: string;
  goAppActivated: boolean;
};

export const DEMO_ACCOUNTS: { activated: AuthUser; notActivated: AuthUser } = {
  activated: { name: "Идэвхжүүлсэн хэрэглэгч", goAppActivated: true },
  notActivated: { name: "Идэвхжүүлээгүй хэрэглэгч", goAppActivated: false },
};
