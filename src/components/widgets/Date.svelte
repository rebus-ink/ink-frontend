<script>
  export let updated;
  export let published;

  let created = updated ? updated : "0000-00-00";
  let replyYear = Number(created.substr(0, 4));
  let replyMonth = Number(created.substr(5, 2));
  let replyDay = Number(created.substr(8, 2));

  let currentDate = new Date();
  let oldDate = new Date(replyYear, replyMonth - 1, replyDay);
  let oneDay = 1000 * 60 * 60 * 24;
  let daysSince = Math.floor(
    (currentDate.getTime() - oldDate.getTime()) / oneDay
  );

  let display =
    daysSince <= 0
      ? "today"
      : daysSince === 1
      ? "yesterday"
      : daysSince > 1 && daysSince < 32
      ? `${daysSince} days ago`
      : daysSince > 31 && daysSince < 63
      ? "a month ago"
      : daysSince > 62 && daysSince < 366
      ? `${Math.floor(daysSince / 30)} months ago`
      : daysSince > 365 && daysSince < 730
      ? `1 year ago`
      : `${Math.floor(daysSince / 365)} years ago`;
</script>

<style>
  h5 {
    font-size: 0.75rem;
    margin: 0;
    color: #888888;
  }
</style>

<h5 class="Date">
  <strong>
    {updated.substring(0, 16) === published.substring(0, 16) ? 'Created' : 'Updated'}
  </strong>
  {display}
</h5>
