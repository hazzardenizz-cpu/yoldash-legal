// A free-text route change must never retain a previous city's coordinates.
export function cargoCityFields(which, selection, city, country, original = null) {
  const keys = ['city_id','geoname_id','lat','lng','city_name_en','city_name_fa','city_name_tr'];
  const changed = original && (city !== original[`${which}_city`] || country !== original[`${which}_country_code`]);
  if (!selection && !changed) return {};
  const fields = Object.fromEntries(keys.map(key => [`${which}_${key}`, null]));
  if (!selection) return fields;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selection.city_id || '')) fields[`${which}_city_id`] = selection.city_id;
  const numbers = {geoname_id:selection.geoname_id,lat:selection.latitude,lng:selection.longitude};
  for (const [key,value] of Object.entries(numbers)) {
    if (value != null && value !== '' && Number.isFinite(Number(value))) fields[`${which}_${key}`] = Number(value);
  }
  for (const lang of ['en','fa','tr']) if (selection[`name_${lang}`]) fields[`${which}_city_name_${lang}`] = selection[`name_${lang}`];
  return fields;
}
