import { newsItemStillExists } from './lib/delta';

app.post('/delta', async function (req, res,) {
  res.status(202).end();
  const insertionDeltas = req.body.map(d => d.inserts).reduce((ds, d) => Array.prototype.concat.apply(ds, d));
  const deletionDeltas = req.body.map(d => d.deletes).reduce((ds, d) => Array.prototype.concat.apply(ds, d));
  if (insertionDeltas.length || deletionDeltas.length) {
    console.debug(`Received deltas (${insertionDeltas.length + deletionDeltas.length} total)`);
  } else {
    return; // Empty delta message received on startup?
  }

  for (const d of insertionDeltas) {
    const subject = d.subject.value;

    if (await newsItemStillExists(subject)) {
      // update title
    } else {
      // delete title
    }
  }
};
