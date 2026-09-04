export function getMilestoneProgress(milestones = [], checked = new Set(), nodeIds = new Set()) {
  return milestones.map((milestone) => {
    const ids = (milestone.nodeIds || []).filter((id) => nodeIds.has(id));
    const done = ids.filter((id) => checked.has(id)).length;
    return {
      ...milestone,
      done,
      total: ids.length,
      percentage: ids.length ? Math.round((done / ids.length) * 100) : 0,
    };
  });
}

export function getSeniorityProgress(bands = [], checked = new Set(), nodeIds = new Set()) {
  const completedBands = new Set();

  return bands.map((band) => {
    const ids = (band.nodeIds || []).filter((id) => nodeIds.has(id));
    const done = ids.filter((id) => checked.has(id)).length;
    const percentage = ids.length ? Math.round((done / ids.length) * 100) : 0;
    const requirementsMet = (band.requires || []).every((id) => completedBands.has(id));
    const complete = requirementsMet && percentage === 100;
    if (complete) completedBands.add(band.id);

    return {
      ...band,
      done,
      total: ids.length,
      percentage,
      requirementsMet,
      complete,
    };
  });
}
