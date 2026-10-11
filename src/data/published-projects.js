export function publishedProjects(entries) {
  return entries
    .filter((entry) => entry.data.publish === true)
    .sort((a, b) => a.data.order - b.data.order);
}

export const barClass = {
  green: 'bg-gruvbox-green',
  blue: 'bg-gruvbox-blue',
  aqua: 'bg-gruvbox-aqua',
  purple: 'bg-gruvbox-purple',
};
