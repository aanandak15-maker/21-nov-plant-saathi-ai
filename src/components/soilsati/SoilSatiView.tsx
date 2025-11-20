import { FarmerFriendlyFieldsList } from "./farmer-friendly/FarmerFriendlyFieldsList";
import { LanguageSelector } from "../layout/LanguageSelector";
import { useTranslation } from "react-i18next";

export const SoilSatiView = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-background pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 shadow-lg">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>

        <h1 className="text-2xl font-bold mb-1">🌱 {t('my_fields')}</h1>
        <p className="text-sm text-green-50">{t('satellite_powered_field_intelligence')}</p>
      </header>

      {/* Farmer-Friendly Fields List */}
      <div className="p-4">
        <FarmerFriendlyFieldsList />
      </div>
    </div>
  );
};
