export function buildVisualSteps(screens, compact = false) {
  return screens.flatMap(screen => {
    const split = compact && screen.panes.length > 1;
    const groups = split ? screen.panes.map(pane => [pane]) : [screen.panes];
    return groups.map(panes => ({
      key: `${screen.id}:${panes.map(pane => pane.id).join(",")}`,
      screen,
      panes,
      split
    }));
  });
}
