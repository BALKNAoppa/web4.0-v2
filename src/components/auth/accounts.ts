/**
 * Auth-ийн хэрэглэгчийн төрөл + demo account-ууд.
 *
 * Тусдаа модуль болгосон шалтгаан: `auth-provider` нь `auth-dialog`-ийг
 * import хийдэг тул хэрэв энэ value-ууд provider дотор байвал circular import
 * үүснэ. Иймд энд төвлөрүүлэв.
 */
export type AuthUser = {
  name: string;
  /** Univision GO апп идэвхжсэн эсэх — түрээсэлсэн киног үзэх урсгалыг салгана */
  goAppActivated: boolean;
};

/**
 * Demo нэвтрэлт. Backend байхгүй тул хоёр төрлийн хэрэглэгчийг урьдчилан
 * бэлдэж, login dialog дээрх түргэн нэвтрэх товчоор сонгоно.
 */
export const DEMO_ACCOUNTS: { activated: AuthUser; notActivated: AuthUser } = {
  activated: { name: "Идэвхжүүлсэн хэрэглэгч", goAppActivated: true },
  notActivated: { name: "Идэвхжүүлээгүй хэрэглэгч", goAppActivated: false },
};
