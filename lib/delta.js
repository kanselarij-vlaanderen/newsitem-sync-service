import { querySudo, updateSudo } from '@lblod/mu-auth-sudo';
import { sparqlEscapeString, sparqlEscapeUri } from 'mu';  
import { GRAPH } from '../config';

// this is not a bug/typo, content maps on title and title maps on alternative
const CONTENT_TYPE = "http://purl.org/dc/terms/title"; 
const TITLE_TYPE = "http://purl.org/dc/terms/alternative";

/**
 * For all agenda-item triples of type 'mededeling' having predicate CONTENT_TYPE or TITLE_TYPE 
 * the respective title or content of the news-item linked to the agenda item is updated
 * 
 * @param triples 
 */
async function processTriples(triples) {
  for (const triple of triples) {
    const subjectUri = triple.subject.value;
    if ((triple.predicate.value === TITLE_TYPE || triple.predicate.value === CONTENT_TYPE)
      && await agendaItemStillExists(subjectUri)) {
      console.log(triple.subject.value);
      if (triple.predicate.value === TITLE_TYPE) {
        await updateNewsItemTitle(subjectUri, triple.object.value);
      }
      if (triple.predicate.value === CONTENT_TYPE) {
        await updateNewsItemContent(subjectUri, triple.object.value)
      }
    }
  };
}

async function agendaItemStillExists(subject) {
  const queryString = `
    PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>

    SELECT DISTINCT *
    WHERE {
        GRAPH <${GRAPH}> {
            ${sparqlEscapeUri(subject)} a besluit:Agendapunt ;
            ext:wordtGetoondAlsMededeling "true"^^<http://mu.semte.ch/vocabularies/typed-literals/boolean> .
        }
    }
  `;

  const result = await querySudo(queryString);
  return result.results.bindings.length;
}

async function updateNewsItemTitle(agendaPuntUri, title) {
  await updateSudo(`
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX besluitvorming: <http://data.vlaanderen.be/ns/besluitvorming#>
    PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
    PREFIX prov: <http://www.w3.org/ns/prov#>

    DELETE {
      GRAPH <${GRAPH}> {
        ?nieuwsbriefUri dct:title ?o .
      }
    }
    INSERT {
      GRAPH <${GRAPH}> {
        ?nieuwsbriefUri dct:title ${sparqlEscapeString(title)} .
      }
    }
    WHERE {
      GRAPH <${GRAPH}> {
        ${sparqlEscapeUri(agendaPuntUri)} a besluit:Agendapunt ;
          ^besluitvorming:heeftOnderwerp/prov:generated ?nieuwsbriefUri .
        ?nieuwsbriefUri a besluitvorming:NieuwsbriefInfo ;
          dct:title ?o .
      }
    }
  `);
}

async function updateNewsItemContent(agendaPuntUri, title) {
  await updateSudo(`
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      PREFIX besluitvorming: <http://data.vlaanderen.be/ns/besluitvorming#>
      PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
      PREFIX prov: <http://www.w3.org/ns/prov#>
  
      DELETE {
        GRAPH <${GRAPH}> {
          ?nieuwsbriefUri ext:htmlInhoud ?o .
        }
      }
      INSERT {
        GRAPH <${GRAPH}> {
          ?nieuwsbriefUri ext:htmlInhoud ${sparqlEscapeString(title)} .
        }
      }
      WHERE {
        GRAPH <${GRAPH}> {
          ${sparqlEscapeUri(agendaPuntUri)} a besluit:Agendapunt ;
            ^besluitvorming:heeftOnderwerp/prov:generated ?nieuwsbriefUri .
          ?nieuwsbriefUri a besluitvorming:NieuwsbriefInfo ;
            ext:htmlInhoud ?o.
        }
      }
    `);
}


export {
  processTriples
};