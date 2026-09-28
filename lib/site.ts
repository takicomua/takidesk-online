export const site = {
  name: "takiDesk Online",
  shortName: "takiDesk",
  tagline: "Твій ПК — у телефоні. Без складних налаштувань.",
  description:
    "takiDesk Online — акаунт і зручне підключення до твого комп’ютера. Стрім іде з твого ПК, а не через наші сервери.",
};

export function getDownloadLinks() {
  return {
    pc:
      process.env.NEXT_PUBLIC_PC_DOWNLOAD_URL ??
      "https://github.com/takicomua/takidesk-online/releases/latest",
    android:
      process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL ??
      "https://github.com/takicomua/takidesk-online/releases/latest",
  };
}
