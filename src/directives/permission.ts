import type { Directive } from 'vue';
function hasPermission(need: string): boolean {
  try {
    const list = JSON.parse(localStorage.getItem('permissions') || '[]') as string[];
    return list.includes(need);
  } catch { return false; }
}
export const permission: Directive = {
  mounted(el, binding) {
    const need = String(binding.value);
    if (!hasPermission(need)) el.style.display = 'none';
  },
  updated(el, binding) {
    const need = String(binding.value);
    el.style.display = hasPermission(need) ? '' : 'none';
  }
};
