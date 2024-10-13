import { NextResponse } from "next/server";
import axios from "axios";
import { normalizeString, TMDB_API_KEY } from "@/app/utils";
import { TVShow } from "@/app/InitialForm";

type Subtitle = {
  name: string;
  fileName: string;
};

const fetchAvailableSubtitles = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/subtitles`
  );
  return response.data;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  try {
    //TODO: improve for performance
    const availableSubtitles = await fetchAvailableSubtitles();
    const response = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
      },
    });

    //TODO: improve for performance, for now exact match
    const showsWithSubtitle: TVShow[] = response.data.results.filter(
      (tvshow: TVShow) => {
        // Log the current TV show being checked
        console.log(`Checking TV show: "${tvshow.name}"`);

        return availableSubtitles.some((subtitle: Subtitle) => {
          // Normalize the names
          const normalizedTvShowName = normalizeString(tvshow.name);
          const normalizedSubtitleName = normalizeString(subtitle.name);

          // Comparison
          console.log(
            `Comparing normalized TV show name: "${normalizedTvShowName}" with subtitle name: "${normalizedSubtitleName}"`
          );

          const isMatch = normalizedTvShowName === normalizedSubtitleName;
          console.log(`Is match: ${isMatch}`);

          return isMatch;
        });
      }
    );

    console.log("Filtered shows with subtitles:", showsWithSubtitle);
    return NextResponse.json(showsWithSubtitle);
  } catch (error) {
    console.error("Error fetching from TMDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
