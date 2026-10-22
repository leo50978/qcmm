export function buildVisualSteps(screens, compact = false) {
  return screens.flatMap(screen => {
    // A screen may contain two related decisions; keep those together on phones.
    // Split only exceptional dense screens with more than two panes.
    const split = compact && screen.panes.length > 2;
    const groups = split ? screen.panes.map(pane => [pane]) : [screen.panes];
    return groups.map(panes => ({
      key: `${screen.id}:${panes.map(pane => pane.id).join(",")}`,
      screen,
      panes,
      split
    }));
  });
}
