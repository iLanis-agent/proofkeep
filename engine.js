/* ProofKeep engine - pure warranty-math, shared by app.html and node tests. */
(function(root, factory){
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ProofKeepEngine = factory();
})(typeof self !== 'undefined' ? self : this, function(){

  function toDate(iso){
    var p = iso.split('-');
    return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  }
  function toISO(d){
    return d.getUTCFullYear() + '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + d.getUTCDate()).slice(-2);
  }

  /* warranty end = purchase date + months (same day-of-month, clamped), end of that day */
  function coverageEndISO(purchaseISO, months){
    var d = toDate(purchaseISO);
    var day = d.getUTCDate();
    d.setUTCMonth(d.getUTCMonth() + months);
    if (d.getUTCDate() < day) d.setUTCDate(0); /* clamp e.g. Jan 31 + 1mo -> Feb 28 */
    return toISO(d);
  }

  function daysLeft(todayISO, endISO){
    var ms = toDate(endISO).getTime() - toDate(todayISO).getTime();
    return Math.round(ms / 86400000);
  }

  /* status: expired / closing (<=30d) / active */
  function status(todayISO, endISO){
    var d = daysLeft(todayISO, endISO);
    if (d < 0) return 'expired';
    if (d <= 30) return 'closing';
    return 'active';
  }

  function daysLabel(todayISO, endISO){
    var d = daysLeft(todayISO, endISO);
    if (d < 0) return 'expired ' + (-d) + ' day' + (-d === 1 ? '' : 's') + ' ago';
    if (d === 0) return 'expires today';
    if (d === 1) return '1 day left';
    if (d < 60) return d + ' days left';
    var m = Math.round(d / 30.44);
    if (m < 24) return m + ' month' + (m === 1 ? '' : 's') + ' left';
    var y = Math.round(d / 365.25 * 10) / 10;
    return (y % 1 === 0 ? y.toFixed(0) : y) + ' years left';
  }

  /* sort: soonest lapse first; expired sink to the bottom */
  function sortItems(items, todayISO){
    return items.slice().sort(function(a, b){
      var ea = coverageEndISO(a.purchase, a.months);
      var eb = coverageEndISO(b.purchase, b.months);
      var da = daysLeft(todayISO, ea), db = daysLeft(todayISO, eb);
      var xa = da < 0, xb = db < 0;
      if (xa !== xb) return xa ? 1 : -1;
      return da - db;
    });
  }

  /* next claim-window warning: count of active items inside `within` days */
  function closingCount(items, todayISO, within){
    var n = 0;
    for (var i = 0; i < items.length; i++){
      var d = daysLeft(todayISO, coverageEndISO(items[i].purchase, items[i].months));
      if (d >= 0 && d <= within) n++;
    }
    return n;
  }

  function fmtISO(iso){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var p = iso.split('-');
    return months[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0];
  }

  return {
    coverageEndISO: coverageEndISO,
    daysLeft: daysLeft,
    status: status,
    daysLabel: daysLabel,
    sortItems: sortItems,
    closingCount: closingCount,
    fmtISO: fmtISO
  };
});
