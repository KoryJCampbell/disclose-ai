import Handlebars from 'handlebars';

export function registerHelpers(): void {
  Handlebars.registerHelper('join', (arr: unknown[], separator?: string) => {
    if (!Array.isArray(arr)) return '';
    return arr.join(typeof separator === 'string' ? separator : ', ');
  });

  Handlebars.registerHelper('titleCase', (str: string) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  });

  Handlebars.registerHelper('yesNo', (val: boolean) => {
    return val ? 'Yes' : 'No';
  });

  Handlebars.registerHelper('upperCase', (str: string) => {
    return str?.toUpperCase() ?? '';
  });

  Handlebars.registerHelper('default', (val: unknown, defaultVal: unknown) => {
    return val ?? defaultVal;
  });

  Handlebars.registerHelper('ifEquals', function (this: unknown, a: unknown, b: unknown, options: Handlebars.HelperOptions) {
    return a === b ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('ifNotEmpty', function (this: unknown, arr: unknown[], options: Handlebars.HelperOptions) {
    return Array.isArray(arr) && arr.length > 0 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('checkmark', (val: boolean) => {
    return val ? '✅' : '❌';
  });

  Handlebars.registerHelper('statusBadge', (status: string) => {
    const badges: Record<string, string> = {
      draft: '🟡 Draft',
      review: '🔵 In Review',
      approved: '🟢 Approved',
      retired: '⚫ Retired',
    };
    return badges[status] ?? status;
  });

  Handlebars.registerHelper('riskColor', (level: string) => {
    const colors: Record<string, string> = {
      negligible: '🟢',
      minor: '🟡',
      moderate: '🟠',
      significant: '🔴',
      critical: '⛔',
    };
    return colors[level] ?? '⚪';
  });

  Handlebars.registerHelper('mitigationStatusIcon', (status: string) => {
    const icons: Record<string, string> = {
      planned: '📋',
      in_progress: '🔄',
      implemented: '✅',
      verified: '✅✅',
    };
    return icons[status] ?? '❓';
  });

  Handlebars.registerHelper('coverageBar', (percent: number) => {
    const filled = Math.round(percent / 5);
    const empty = 20 - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${percent}%`;
  });

  Handlebars.registerHelper('today', () => {
    return new Date().toISOString().split('T')[0];
  });

  Handlebars.registerHelper('increment', (val: number) => {
    return val + 1;
  });
}
