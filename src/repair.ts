export function repairJson(raw: string): string {
  let text = raw.trim();
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  text = text.replace(/,\s*([}\]])/g, '$1');
  return text.trim();
}
