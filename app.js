import { app } from 'mu';
import { processTriples } from './lib/delta';
import bodyParser from 'body-parser';

console.log("starting...")

// parse application/json
app.use(bodyParser.json());

app.post('/delta', async function (req, res, next) {
  res.status(202).end();

  let count= 1;
  for (let { inserts, deletes } of req.body) {
    if (inserts.length > 0) await processTriples(inserts);
    if (deletes.length > 0) await processTriples(deletes); 
  }  
});
