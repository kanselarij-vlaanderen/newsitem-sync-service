import { querySudo, updateSudo } from '@lblod/mu-auth-sudo';
import { sparqlEscape, sparqlEscapeUri } from 'mu';

import { GRAPH } from '../config';

async function newsItemStillExists(subject) {
  const queryString = `
    PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>

    SELECT DISTINCT *
    WHERE {
        GRAPH ${sparqlEscapeUri(GRAPH)} {
            ${sparqlEscapeUri(subject)} a besluit:Agendapunt 
        }
    }
  `;

  const result = await querySudo(queryString);
  return result.results.bindings.length;
}

export default {
  newsItemStillExists
};