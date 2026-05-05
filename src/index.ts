import { AppEnv } from "@/libs/appEnv";
import { fetchNftsWithCache } from "@/seeker";

const appEnv = new AppEnv();

fetchNftsWithCache(appEnv);
