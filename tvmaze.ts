import axios from "axios";
import * as $ from 'jquery';

const $showsList: JQuery<HTMLElement> = $("#showsList");
const $episodesArea: JQuery<HTMLElement> = $("#episodesArea");
const $searchForm: JQuery<HTMLElement> = $("#searchForm");
const BASE_URL: string = "https://api.tvmaze.com/";
const MISSING_IMAGE_URL: string = "https://tinyurl.com/tv-missing"

interface ShowInterface {
  id: number,
  name: string,
  summary: string,
  image: Record<string,string> | undefined,
}

interface EpisodeInterface {
  id: number,
  name: string,
  season: number,
  number: number
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */


async function getShowsByTerm(term: string): Promise<ShowInterface[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const response = await axios.get(`${BASE_URL}search/shows?q=${term}`);
  console.log(response.data);
  return (
    response.data.map((s: { show: ShowInterface}) => {
      return {
        id: s.show.id,
        name: s.show.name,
        summary: s.show.summary,
        image: s.show.image?.original 
      }
    })
  );
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowInterface[]): void {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image ? show.image: MISSING_IMAGE_URL}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): Promise<void> {
  const term = $("#searchForm-term").val() as string;
  const shows: ShowInterface[] = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt: JQuery.SubmitEvent) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id: number): Promise<EpisodeInterface[]>  { 
  const response = await axios.get(`${BASE_URL}shows/${id}/episodes`);
  const episodes = response.data;
  return episodes.map(e => 
    {return { id: e.id,
     name: e.name
     , season: e.season,
      number: e.number}})
}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }