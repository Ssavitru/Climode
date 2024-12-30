import { useEffect, useState, useRef } from 'react';
import { format, register } from 'timeago.js';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface TimeAgoProps {
  date: Date;
  className?: string;
  language?: 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar';
}

// Register locales
register('en', (number: number, index: number): [string, string] => {
  return [
    ['just now', 'right now'],
    ['%s seconds ago', 'in %s seconds'],
    ['1 minute ago', 'in 1 minute'],
    ['%s minutes ago', 'in %s minutes'],
    ['1 hour ago', 'in 1 hour'],
    ['%s hours ago', 'in %s hours'],
    ['1 day ago', 'in 1 day'],
    ['%s days ago', 'in %s days'],
    ['1 week ago', 'in 1 week'],
    ['%s weeks ago', 'in %s weeks'],
    ['1 month ago', 'in 1 month'],
    ['%s months ago', 'in %s months'],
    ['1 year ago', 'in 1 year'],
    ['%s years ago', 'in %s years']
  ][index];
});

register('fr', (number: number, index: number): [string, string] => {
  return [
    ['à l\'instant', 'dans un instant'],
    ['il y a %s secondes', 'dans %s secondes'],
    ['il y a 1 minute', 'dans 1 minute'],
    ['il y a %s minutes', 'dans %s minutes'],
    ['il y a 1 heure', 'dans 1 heure'],
    ['il y a %s heures', 'dans %s heures'],
    ['il y a 1 jour', 'dans 1 jour'],
    ['il y a %s jours', 'dans %s jours'],
    ['il y a 1 semaine', 'dans 1 semaine'],
    ['il y a %s semaines', 'dans %s semaines'],
    ['il y a 1 mois', 'dans 1 mois'],
    ['il y a %s mois', 'dans %s mois'],
    ['il y a 1 an', 'dans 1 an'],
    ['il y a %s ans', 'dans %s ans']
  ][index];
});

register('es', (number: number, index: number): [string, string] => {
  return [
    ['justo ahora', 'en un momento'],
    ['hace %s segundos', 'en %s segundos'],
    ['hace 1 minuto', 'en 1 minuto'],
    ['hace %s minutos', 'en %s minutos'],
    ['hace 1 hora', 'en 1 hora'],
    ['hace %s horas', 'en %s horas'],
    ['hace 1 día', 'en 1 día'],
    ['hace %s días', 'en %s días'],
    ['hace 1 semana', 'en 1 semana'],
    ['hace %s semanas', 'en %s semanas'],
    ['hace 1 mes', 'en 1 mes'],
    ['hace %s meses', 'en %s meses'],
    ['hace 1 año', 'en 1 año'],
    ['hace %s años', 'en %s años']
  ][index];
});

register('de', (number: number, index: number): [string, string] => {
  return [
    ['gerade eben', 'in einem Moment'],
    ['vor %s Sekunden', 'in %s Sekunden'],
    ['vor 1 Minute', 'in 1 Minute'],
    ['vor %s Minuten', 'in %s Minuten'],
    ['vor 1 Stunde', 'in 1 Stunde'],
    ['vor %s Stunden', 'in %s Stunden'],
    ['vor 1 Tag', 'in 1 Tag'],
    ['vor %s Tagen', 'in %s Tagen'],
    ['vor 1 Woche', 'in 1 Woche'],
    ['vor %s Wochen', 'in %s Wochen'],
    ['vor 1 Monat', 'in 1 Monat'],
    ['vor %s Monaten', 'in %s Monaten'],
    ['vor 1 Jahr', 'in 1 Jahr'],
    ['vor %s Jahren', 'in %s Jahren']
  ][index];
});

register('it', (number: number, index: number): [string, string] => {
  return [
    ['poco fa', 'tra poco'],
    ['%s secondi fa', 'tra %s secondi'],
    ['1 minuto fa', 'tra 1 minuto'],
    ['%s minuti fa', 'tra %s minuti'],
    ['1 ora fa', 'tra 1 ora'],
    ['%s ore fa', 'tra %s ore'],
    ['1 giorno fa', 'tra 1 giorno'],
    ['%s giorni fa', 'tra %s giorni'],
    ['1 settimana fa', 'tra 1 settimana'],
    ['%s settimane fa', 'tra %s settimane'],
    ['1 mese fa', 'tra 1 mese'],
    ['%s mesi fa', 'tra %s mesi'],
    ['1 anno fa', 'tra 1 anno'],
    ['%s anni fa', 'tra %s anni']
  ][index];
});

register('ar', (number: number, index: number): [string, string] => {
  return [
    ['منذ لحظات', 'بعد لحظات'],
    ['منذ %s ثانية', 'بعد %s ثانية'],
    ['منذ دقيقة', 'بعد دقيقة'],
    ['منذ %s دقائق', 'بعد %s دقائق'],
    ['منذ ساعة', 'بعد ساعة'],
    ['منذ %s ساعات', 'بعد %s ساعات'],
    ['منذ يوم', 'بعد يوم'],
    ['منذ %s أيام', 'بعد %s أيام'],
    ['منذ أسبوع', 'بعد أسبوع'],
    ['منذ %s أسابيع', 'بعد %s أسابيع'],
    ['منذ شهر', 'بعد شهر'],
    ['منذ %s أشهر', 'بعد %s أشهر'],
    ['منذ سنة', 'بعد سنة'],
    ['منذ %s سنوات', 'بعد %s سنوات']
  ][index];
});

export function TimeAgo({ date, className, language = 'en' }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useAppTranslation(language);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Update immediately
    setTimeAgo(format(date, language));

    // Set new interval
    intervalRef.current = setInterval(() => {
      setTimeAgo(format(date, language));
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [date, language]);

  return (
    <span className={className}>
      {t('weather.lastUpdated')} {timeAgo}
    </span>
  );
}
