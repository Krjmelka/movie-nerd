import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import './style.scss';

export const LanguagePicker = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    window.localStorage.setItem('language', lang);
  };

  return (
    <div className="language-picker">
      <Button
        disabled={i18n.language === 'en'}
        selected={i18n.language === 'en'}
        text={t('English')}
        onClick={() => changeLanguage('en')}
      />
      <Button
        disabled={i18n.language === 'ua'}
        selected={i18n.language === 'ua'}
        text={t('Ukrainian')}
        onClick={() => changeLanguage('ua')}
      />
    </div>
  );
};
