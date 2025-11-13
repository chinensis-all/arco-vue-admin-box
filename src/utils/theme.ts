export type Theme = {
  preview: string; body: string; sider: string; header: string; content: string;
  footer: string; link: string; fg: string; sfg: string; activeMenu?: string;
};
export const themes: Theme[] = [
  { preview:'#0080a0', body:'#f0f9ff', sider:'#0080a0', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#0080a0', fg:'#1f2328', sfg:'#ffffff', activeMenu:'#ffd700' },
  { preview:'#0078D4', body:'#f5f5f5', sider:'#0f4c8a', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#0078D4', fg:'#222', sfg:'#fff' },
  { preview:'#0063B1', body:'#eef2f9', sider:'#102542', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#4cc2ff', fg:'#1f2328', sfg:'#e6e6e6' },
  { preview:'#4c1d95', body:'#f7f3ff', sider:'#2e1065', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#5b21b6', fg:'#1f2328', sfg:'#ddd6fe' },
  { preview:'#22c55e', body:'#f6fef9', sider:'#14532d', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#16a34a', fg:'#1f2328', sfg:'#dcfce7' },
  { preview:'#ef4444', body:'#fff6f6', sider:'#7f1d1d', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#ef4444', fg:'#1f2328', sfg:'#fee2e2' },
  { preview:'#f59e0b', body:'#fffaf0', sider:'#7c2d12', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#f59e0b', fg:'#1f2328', sfg:'#ffedd5' },
  { preview:'#10b981', body:'#f0fdfa', sider:'#064e3b', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#10b981', fg:'#1f2328', sfg:'#d1fae5' },
  { preview:'#14b8a6', body:'#f0fdfa', sider:'#134e4a', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#14b8a6', fg:'#1f2328', sfg:'#ccfbf1' },
  { preview:'#38bdf8', body:'#f0f9ff', sider:'#0c4a6e', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#38bdf8', fg:'#1f2328', sfg:'#e0f2fe' },
  { preview:'#e9d5ff', body:'#faf5ff', sider:'#c4b5fd', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#9333ea', fg:'#1f2328', sfg:'#1f2937' },
  { preview:'#ffc0cb', body:'#fff5f7', sider:'#ffc0cb', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#ff6b9d', fg:'#1f2328', sfg:'#5a1a2e' },
  { preview:'#ffffff', body:'#f5f5f5', sider:'#ffffff', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#0080a0', fg:'#1f2328', sfg:'#1f2328' },
  { preview:'#000000', body:'#f5f7f9', sider:'#0f1115', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#4cc2ff', fg:'#1f2328', sfg:'#e6e6e6' },
  { preview:'#001242', body:'#eef2ff', sider:'#001242', header:'#ffffff', content:'#ffffff', footer:'#ffffff', link:'#001242', fg:'#1f2328', sfg:'#ffffff' },
];
export const DEEP_BLUE_INDEX = 2;

export function applyTheme(obj: Theme) {
  const root = document.documentElement;
  root.style.setProperty('--body-bg', obj.body);
  root.style.setProperty('--body-fg', obj.fg);
  root.style.setProperty('--sider-bg', obj.sider);
  root.style.setProperty('--sider-fg', obj.sfg);
  root.style.setProperty('--header-bg', obj.header);
  root.style.setProperty('--header-fg', obj.fg);
  root.style.setProperty('--content-bg', 'transparent');
  root.style.setProperty('--content-fg', obj.fg);
  root.style.setProperty('--footer-bg', obj.footer);
  root.style.setProperty('--footer-fg', obj.fg);
  root.style.setProperty('--link', obj.preview);
  root.style.setProperty('--primary-color', obj.preview);
  root.style.setProperty('--active-menu-bg', obj.activeMenu || 'rgba(255, 255, 255, 0.28)');
}
export function loadPersistedThemeIndex(): number | null {
  const s = localStorage.getItem('themeIndex');
  return s != null ? Number(s) : null;
}
export function persistThemeIndex(i: number) {
  localStorage.setItem('themeIndex', String(i));
}
