export const COUNTRY_CODES = [
  'AF','AL','DE','AD','AO','AG','SA','DZ','AR','AM','AU','AT','AZ','BS','BD','BB','BH','BE','BZ','BJ','BY','MM','BO','BA','BW','BR','BN','BG','BF','BI','BT','CV','KH','CM','CA','QA','TD','CL','CN','CY','CO','KM','CG','CD','KP','KR','CI','CR','HR','CU','DK','DM','EC','EG','SV','AE','ER','SK','SI','ES','US','EE','SZ','ET','PH','FI','FJ','FR','GA','GM','GE','GH','GD','GR','GT','GN','GQ','GW','GY','HT','HN','HU','IN','ID','IQ','IR','IE','IS','MH','SB','IL','IT','JM','JP','JO','KZ','KE','KG','KI','KW','LA','LS','LV','LB','LR','LY','LI','LT','LU','MK','MG','MY','MW','MV','ML','MT','MA','MU','MR','MX','FM','MD','MC','MN','ME','MZ','NA','NR','NP','NI','NE','NG','NO','NZ','OM','NL','PK','PW','PA','PG','PY','PE','PL','PT','GB','CF','CZ','DO','RW','RO','RU','WS','KN','SM','VC','LC','ST','SN','RS','SC','SL','SG','SY','SO','LK','ZA','SD','SS','SE','CH','SR','TH','TZ','TJ','TL','TG','TO','TT','TN','TM','TR','TV','UA','UG','UY','UZ','VU','VA','VE','VN','YE','DJ','ZM','ZW','PS'
];

const displayNames = typeof Intl.DisplayNames === 'function'
  ? new Intl.DisplayNames(['es'], { type: 'region' })
  : null;

export function countryFlag(code = '') {
  return /^[A-Z]{2}$/.test(code)
    ? [...code].map(letter => String.fromCodePoint(127397 + letter.charCodeAt(0))).join('')
    : '🌐';
}

export function countryName(code = '') {
  return displayNames?.of(code) || code || 'Sin especificar';
}

export function countryLabel(code = '') {
  return code ? `${countryFlag(code)} ${countryName(code)}` : '🌐 Sin especificar';
}

export const COUNTRIES = COUNTRY_CODES
  .map(code => ({ code, name: countryName(code), flag: countryFlag(code) }))
  .sort((a, b) => a.name.localeCompare(b.name, 'es'));
