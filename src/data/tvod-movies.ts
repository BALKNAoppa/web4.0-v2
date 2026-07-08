/**
 * Univision Web 4.0 — TVOD movie catalog
 *
 * Search engine үүн дээр substring + genre + year-ээр шүүлт хийнэ.
 * Semantic search (LLM) нь description + themes + keywords-ийг ашиглана.
 * Описаны англиар бичсэн нь LLM-д илүү нарийн semantic understanding өгдөг.
 * Mongolian query-уудыг ч multilingual model автоматаар ойлгож тааруулна.
 * Постер зургийг public/tvod/{id}.jpg нэрээр тавьж болно. Хэрэв жинхэнэ
 * постер байхгүй бол picsum.photos-аас seeded placeholder татна.
 */
export type TvodMovie = {
  id: string;
  title: string;
  /** Зэрэг харагдах genre tag-ууд */
  genres: string[];
  year: number;
  /** IMDb-маягийн 10-аас хувиарласан үнэлгээ */
  rating: number;
  /** public folder absolute path эсвэл remote URL */
  poster?: string;

  // ===================================================
  // Semantic search-д ашиглах metadata.
  // Хоосон үлдээж болно, гэхдээ semantic search-ийн
  // чанарт нөлөөлнө.
  // ===================================================
  /** 2-3 sentence plot/description in English */
  description?: string;
  /** Кинонын үндсэн сэдэв, мэдрэмж — 4-6 ширхэг */
  themes?: string[];
  /** Илүү тодорхой keyword-уудаар query таарагдахад тус болно — 5-10 ширхэг */
  keywords?: string[];
};

export const tvodGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
] as const;

/**
 * Кино постерийн path буцаах helper. public/tvod/{id}.jpg-аас уншина.
 * (Функцийн нэр legacy — өмнө picsum.photos placeholder татаж байсан.)
 */
function picsumPoster(id: string): string {
  return `/tvod/${id}.jpg`;
}

export const tvodMovies: TvodMovie[] = [
  // ===========================================================
  // Бодит постертой 5 — public/tvod/ folder-т аль хэдийн байгаа
  // ===========================================================
  {
    id: "obsession",
    title: "Obsession",
    genres: ["Thriller", "Drama"],
    year: 2023,
    rating: 7.9,
    poster: "/tvod/obsession.jpg",
    description:
      "A young woman matches with a charming man on social media, only to discover he is a controlling and dangerous predator who refuses to let her go.",
    themes: ["controlling relationship", "social media danger", "psychological thriller", "obsession"],
    keywords: ["stalker", "social media", "dating", "manipulation", "toxic relationship", "psychological"],
  },
  {
    id: "mortal-kombat-2",
    title: "Mortal Kombat II",
    genres: ["Action", "Adventure"],
    year: 2025,
    rating: 6.8,
    poster: "/tvod/mortal-kombat-2.jpg",
    description:
      "Earthrealm's champions reunite to face Outworld's tyrant Shao Kahn in the legendary Mortal Kombat tournament that will decide the fate of every realm.",
    themes: ["fighting tournament", "video game adaptation", "good vs evil realms", "warrior ensemble"],
    keywords: ["martial arts", "fatality", "Shao Kahn", "Sub-Zero", "Scorpion", "video game", "fighting", "Outworld"],
  },
  {
    id: "demon-slayer-infinity-castle",
    title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
    genres: ["Animation", "Action"],
    year: 2025,
    rating: 7.7,
    poster: "/tvod/demon-slayer-infinity-castle.jpg",
    description:
      "Tanjiro and the Demon Slayer Corps are dragged into Muzan's mysterious Infinity Castle for the final all-out battle against the upper-rank demons.",
    themes: ["anime epic", "demon hunting", "loyal siblings", "final battle"],
    keywords: ["anime", "shonen", "katana", "Tanjiro", "Nezuko", "demon", "Hashira", "ufotable animation"],
  },
  {
    id: "michael",
    title: "Michael",
    genres: ["Drama"],
    year: 2025,
    rating: 7.6,
    poster: "/tvod/michael.jpg",
    description:
      "The life story of pop icon Michael Jackson, charting his rise from child star to King of Pop, his personal struggles, and the controversies that defined an era.",
    themes: ["music biopic", "fame and tragedy", "artistic genius", "child stardom"],
    keywords: ["Michael Jackson", "pop", "Thriller", "Moonwalk", "music legend", "biopic", "1980s music"],
  },
  {
    id: "normal",
    title: "Normal",
    genres: ["Drama", "Crime"],
    year: 2024,
    rating: 6.5,
    poster: "/tvod/normal.jpg",
    description:
      "An ordinary suburban family hides crime, deception, and dark secrets behind closed doors, slowly unraveling in this slow-burn drama about hidden lives.",
    themes: ["suburban deception", "family secrets", "hidden crime", "slow-burn drama"],
    keywords: ["suburban", "family secrets", "hidden lives", "crime drama", "deception", "slow-burn"],
  },

  // ===========================================================
  // Placeholder (picsum) — бодит постер хийгдэх хүртэл түр
  // ===========================================================
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    genres: ["Sci-Fi", "Adventure"],
    year: 2024,
    rating: 8.5,
    poster: "/tvod/dune-part-two.jpg",
    description:
      "Paul Atreides unites with the Fremen to seek revenge against the conspirators who destroyed his family, while wrestling with the prophecy that brands him a messiah.",
    themes: ["epic space opera", "prophecy and destiny", "desert planet", "messianic figure", "political intrigue"],
    keywords: ["Arrakis", "sandworm", "spice", "Fremen", "Paul Atreides", "Frank Herbert", "Villeneuve", "messiah"],
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    genres: ["Drama", "Thriller"],
    year: 2023,
    rating: 8.4,
    poster: "/tvod/oppenheimer.jpg",
    description:
      "The story of J. Robert Oppenheimer, the brilliant physicist who led the Manhattan Project to build the atomic bomb, and the political and moral reckoning that followed.",
    themes: ["historical biopic", "scientific genius", "moral burden", "Cold War paranoia", "Prometheus parallel"],
    keywords: ["atomic bomb", "Manhattan Project", "Los Alamos", "physics", "Nolan", "Cillian Murphy", "WWII"],
  },
  {
    id: "barbie",
    title: "Barbie",
    genres: ["Comedy", "Adventure"],
    year: 2023,
    rating: 7.0,
    poster: "/tvod/barbie.jpg",
    description:
      "Barbie escapes the perfect Barbie Land for the real world, where she confronts existential dread, patriarchy, and the messy question of what it means to be human.",
    themes: ["existential comedy", "feminism", "identity crisis", "patriarchy critique", "toy world"],
    keywords: ["Barbie", "Ken", "Mattel", "Greta Gerwig", "pink", "doll", "satire", "Margot Robbie"],
  },
  {
    id: "interstellar",
    title: "Interstellar",
    genres: ["Sci-Fi", "Drama"],
    year: 2014,
    rating: 8.7,
    poster: "/tvod/interstellar.jpg",
    description:
      "In a future where Earth is dying, a team of astronauts travel through a wormhole near Saturn to find humanity a new home — while one father fights against time to reunite with his daughter.",
    themes: ["space exploration", "father-daughter bond", "time dilation", "sacrifice", "survival of humanity"],
    keywords: ["space", "wormhole", "black hole", "time dilation", "love transcending time", "epic sci-fi", "Nolan"],
  },
  {
    id: "inception",
    title: "Inception",
    genres: ["Sci-Fi", "Thriller"],
    year: 2010,
    rating: 8.8,
    poster: "/tvod/inception.jpg",
    description:
      "A professional thief who steals secrets from people's dreams is offered a chance at redemption: instead of stealing, he must plant an idea into a target's subconscious through a heist of the mind.",
    themes: ["dreams within dreams", "reality vs illusion", "guilt", "heist", "mind manipulation"],
    keywords: ["dream", "subconscious", "heist", "puzzle plot", "mind-bending", "Nolan", "DiCaprio"],
  },
  {
    id: "the-batman",
    title: "The Batman",
    genres: ["Action", "Crime"],
    year: 2022,
    rating: 7.8,
    poster: picsumPoster("the-batman"),
    description:
      "In his second year of fighting crime, Batman uncovers deep corruption in Gotham City as a sadistic serial killer known as the Riddler systematically targets the city's elite.",
    themes: ["urban noir", "detective work", "corruption", "vengeance vs justice", "morally grey hero"],
    keywords: ["Batman", "Gotham", "noir", "detective", "Riddler", "dark crime", "moody atmosphere"],
  },
  {
    id: "everything-everywhere",
    title: "Everything Everywhere All at Once",
    genres: ["Sci-Fi", "Comedy"],
    year: 2022,
    rating: 8.0,
    poster: picsumPoster("everything-everywhere"),
    description:
      "A struggling Chinese-American laundromat owner is unexpectedly thrown across the multiverse, where she must channel alternate versions of herself to save reality and reconnect with her family.",
    themes: ["multiverse", "immigrant family", "mother-daughter relationship", "existential meaning", "absurdist comedy"],
    keywords: ["multiverse", "Chinese American", "Michelle Yeoh", "kung fu", "Daniels", "A24", "absurd", "family"],
  },
  {
    id: "spider-verse-2",
    title: "Spider-Man: Across the Spider-Verse",
    genres: ["Animation", "Action"],
    year: 2023,
    rating: 8.7,
    poster: picsumPoster("spider-verse-2"),
    description:
      "Miles Morales is hurled across the multiverse and joins a society of Spider-People, but clashes with them over how to handle a new threat — and the very fabric of fate itself.",
    themes: ["multiverse adventure", "coming of age", "destiny vs choice", "groundbreaking animation"],
    keywords: ["Spider-Man", "Miles Morales", "multiverse", "animation", "Sony", "comic book", "Gwen Stacy"],
  },
  {
    id: "john-wick-4",
    title: "John Wick: Chapter 4",
    genres: ["Action", "Thriller"],
    year: 2023,
    rating: 7.7,
    poster: picsumPoster("john-wick-4"),
    description:
      "John Wick takes the fight to the High Table across Paris, Berlin, and Osaka, dueling assassins worldwide in pursuit of his freedom from the underworld that hunts him.",
    themes: ["stylish action", "revenge", "honor among assassins", "neon-lit choreography"],
    keywords: ["assassin", "John Wick", "Keanu Reeves", "gun-fu", "neon", "High Table", "Paris duel"],
  },
  {
    id: "killers-flower-moon",
    title: "Killers of the Flower Moon",
    genres: ["Crime", "Drama"],
    year: 2023,
    rating: 7.6,
    poster: picsumPoster("killers-flower-moon"),
    description:
      "In 1920s Oklahoma, members of the oil-rich Osage Nation are murdered one by one in a chilling true-crime epic about colonial greed, betrayal, and the birth of the FBI.",
    themes: ["true crime", "colonial greed", "betrayal", "indigenous tragedy", "historical injustice"],
    keywords: ["Osage", "Oklahoma", "oil money", "Scorsese", "DiCaprio", "De Niro", "true story", "FBI"],
  },
  {
    id: "past-lives",
    title: "Past Lives",
    genres: ["Drama", "Romance"],
    year: 2023,
    rating: 7.9,
    poster: picsumPoster("past-lives"),
    description:
      "Two childhood sweethearts from Korea reconnect in New York twenty years later, contemplating love, destiny, and the lives they didn't live. A quiet, melancholic romance.",
    themes: ["lost love", "immigrant nostalgia", "what if", "destiny vs reality", "quiet drama"],
    keywords: ["Korean", "immigrant", "first love", "New York", "Celine Song", "in-yun", "A24", "subtle"],
  },
  {
    id: "zone-of-interest",
    title: "The Zone of Interest",
    genres: ["Drama", "Horror"],
    year: 2023,
    rating: 7.4,
    poster: picsumPoster("zone-of-interest"),
    description:
      "The commandant of Auschwitz and his family build an idyllic domestic life right next to the death camp, the unimaginable horror always present just beyond the garden wall.",
    themes: ["banality of evil", "Holocaust", "domestic horror", "moral oblivion", "sound design"],
    keywords: ["Auschwitz", "Holocaust", "Nazi", "Jonathan Glazer", "WWII", "domestic", "evil", "A24"],
  },
  {
    id: "anatomy-of-a-fall",
    title: "Anatomy of a Fall",
    genres: ["Drama", "Thriller"],
    year: 2023,
    rating: 7.7,
    poster: picsumPoster("anatomy-of-a-fall"),
    description:
      "A successful novelist becomes the prime suspect in her husband's mysterious death at their remote French chalet, putting her marriage and identity on trial in a tense courtroom drama.",
    themes: ["courtroom drama", "marriage breakdown", "ambiguous truth", "French cinema", "intelligent thriller"],
    keywords: ["courtroom", "French", "marriage", "trial", "Sandra Hüller", "Cannes", "ambiguous", "Justine Triet"],
  },
  {
    id: "the-holdovers",
    title: "The Holdovers",
    genres: ["Comedy", "Drama"],
    year: 2023,
    rating: 7.9,
    poster: picsumPoster("the-holdovers"),
    description:
      "A grumpy boarding-school teacher is stuck on campus over Christmas break in 1970s New England with a troubled student and the school's grieving cook, forging unlikely bonds.",
    themes: ["holiday melancholy", "unlikely friendship", "1970s", "loneliness", "academic setting"],
    keywords: ["boarding school", "Christmas", "Paul Giamatti", "70s", "Alexander Payne", "winter", "loner"],
  },
  {
    id: "poor-things",
    title: "Poor Things",
    genres: ["Comedy", "Sci-Fi"],
    year: 2023,
    rating: 7.8,
    poster: picsumPoster("poor-things"),
    description:
      "A young woman reanimated by an eccentric scientist embarks on an outlandish Victorian-era odyssey of self-discovery, sexual awakening, and personal freedom across Europe.",
    themes: ["feminist coming of age", "surreal world", "sexual liberation", "Frankenstein twist", "absurd visual"],
    keywords: ["Frankenstein", "Emma Stone", "Yorgos Lanthimos", "Victorian", "fantasy", "absurd", "feminism"],
  },
  {
    id: "godzilla-minus-one",
    title: "Godzilla Minus One",
    genres: ["Action", "Drama"],
    year: 2023,
    rating: 7.7,
    poster: picsumPoster("godzilla-minus-one"),
    description:
      "In postwar Japan, a former kamikaze pilot wrestling with survivor's guilt and PTSD faces a new terror as Godzilla emerges from the ocean to devastate a nation already on its knees.",
    themes: ["postwar trauma", "kaiju", "human drama", "survivor guilt", "national rebuild"],
    keywords: ["Godzilla", "kaiju", "Japan", "WWII postwar", "Toho", "Tokyo", "monster movie"],
  },
  {
    id: "scream-6",
    title: "Scream VI",
    genres: ["Horror", "Thriller"],
    year: 2023,
    rating: 6.5,
    poster: picsumPoster("scream-6"),
    description:
      "The surviving Woodsboro victims have moved to New York City, but Ghostface follows them, launching the most savage and meta chapter yet of the long-running slasher franchise.",
    themes: ["slasher horror", "meta franchise", "survivor trauma", "NYC setting"],
    keywords: ["Ghostface", "slasher", "Woodsboro", "New York", "horror sequel", "Scream"],
  },
  {
    id: "talk-to-me",
    title: "Talk to Me",
    genres: ["Horror"],
    year: 2023,
    rating: 7.2,
    poster: picsumPoster("talk-to-me"),
    description:
      "When a group of Australian teens discover an embalmed hand that lets them speak with the dead, what starts as a viral party trick spirals into possession and horror.",
    themes: ["possession horror", "teen reckless", "grief", "Australian indie"],
    keywords: ["possession", "ghost", "Australian horror", "Reddit", "teenagers", "embalmed hand", "A24"],
  },
  {
    id: "the-creator",
    title: "The Creator",
    genres: ["Sci-Fi", "Action"],
    year: 2023,
    rating: 6.8,
    poster: picsumPoster("the-creator"),
    description:
      "In a future war between humans and AI, a hardened soldier searches for the legendary weapon designed to end the war — a child AI capable of unimaginable power.",
    themes: ["AI war", "future ethics", "child savior", "Asian-inspired sci-fi"],
    keywords: ["AI", "future war", "robots", "child", "Gareth Edwards", "Vietnam-style", "post-apocalyptic"],
  },
  {
    id: "may-december",
    title: "May December",
    genres: ["Drama"],
    year: 2023,
    rating: 7.0,
    poster: picsumPoster("may-december"),
    description:
      "An actress travels to study a controversial woman whose tabloid scandal made her infamous decades ago, in a haunting drama about performance, identity, and exploitation.",
    themes: ["identity exploration", "performative role", "tabloid scandal", "Todd Haynes signature"],
    keywords: ["scandal", "Natalie Portman", "Julianne Moore", "Todd Haynes", "actress", "drama"],
  },

  // ===========================================================
  // Нэмэлт 25 кино
  // ===========================================================
  {
    id: "avatar-2",
    title: "Avatar: The Way of Water",
    genres: ["Sci-Fi", "Adventure"],
    year: 2022,
    rating: 7.6,
    poster: picsumPoster("avatar-2"),
    description:
      "Jake Sully and Neytiri have started a family, but when an old threat returns, they must leave their forest home and seek shelter with Pandora's water-dwelling Na'vi clans.",
    themes: ["alien ecology", "family protection", "colonialism allegory", "underwater epic", "James Cameron"],
    keywords: ["Pandora", "Na'vi", "James Cameron", "water", "Avatar sequel", "tulkun", "Metkayina", "3D"],
  },
  {
    id: "top-gun-maverick",
    title: "Top Gun: Maverick",
    genres: ["Action", "Drama"],
    year: 2022,
    rating: 8.2,
    poster: picsumPoster("top-gun-maverick"),
    description:
      "Decades after the original, Maverick returns to Top Gun as an instructor to train a new generation of pilots for an impossible mission — and to confront the ghosts of his past.",
    themes: ["legacy and mentorship", "aerial dogfights", "comeback", "father figure", "practical effects"],
    keywords: ["Tom Cruise", "fighter jet", "Top Gun", "Navy", "Maverick", "F-18", "aerial action"],
  },
  {
    id: "the-whale",
    title: "The Whale",
    genres: ["Drama"],
    year: 2022,
    rating: 7.7,
    poster: picsumPoster("the-whale"),
    description:
      "A reclusive 600-pound English teacher who refuses to leave his apartment attempts to reconnect with his estranged teenage daughter as his health rapidly deteriorates.",
    themes: ["redemption", "father-daughter reconciliation", "isolation", "self-destruction"],
    keywords: ["Brendan Fraser", "Darren Aronofsky", "obesity", "redemption", "single location", "Moby Dick"],
  },
  {
    id: "tar",
    title: "Tár",
    genres: ["Drama"],
    year: 2022,
    rating: 7.4,
    poster: picsumPoster("tar"),
    description:
      "Lydia Tár, one of the greatest living conductors and the first female chief conductor of a major German orchestra, finds her life unraveling as cancellation, scandal, and her own demons close in.",
    themes: ["power and abuse", "cancellation", "classical music world", "queer protagonist", "ambiguous morality"],
    keywords: ["conductor", "Cate Blanchett", "Berlin Philharmonic", "Todd Field", "cancel culture", "Mahler"],
  },
  {
    id: "glass-onion",
    title: "Glass Onion: A Knives Out Mystery",
    genres: ["Comedy", "Crime"],
    year: 2022,
    rating: 7.1,
    poster: picsumPoster("glass-onion"),
    description:
      "Detective Benoit Blanc is invited to a tech billionaire's private Greek island for a murder-mystery weekend — only for a real murder to occur among the eccentric guests.",
    themes: ["whodunit", "tech billionaire satire", "Greek island", "ensemble mystery"],
    keywords: ["Benoit Blanc", "Daniel Craig", "Rian Johnson", "Knives Out", "Greece", "whodunit", "tech CEO"],
  },
  {
    id: "knives-out",
    title: "Knives Out",
    genres: ["Comedy", "Crime"],
    year: 2019,
    rating: 7.9,
    poster: picsumPoster("knives-out"),
    description:
      "When a wealthy mystery novelist is found dead under suspicious circumstances, eccentric detective Benoit Blanc investigates his backstabbing, dysfunctional family in a modern whodunit.",
    themes: ["modern whodunit", "wealthy family secrets", "class commentary", "twisty plot"],
    keywords: ["Benoit Blanc", "Daniel Craig", "Rian Johnson", "mystery", "mansion", "inheritance", "Ana de Armas"],
  },
  {
    id: "joker",
    title: "Joker",
    genres: ["Crime", "Drama"],
    year: 2019,
    rating: 8.4,
    poster: picsumPoster("joker"),
    description:
      "A failed stand-up comedian and mentally ill loner, ground down by an indifferent society, descends into madness and emerges as Gotham's clown prince of crime.",
    themes: ["mental illness", "social decay", "origin story", "character study", "violent unraveling"],
    keywords: ["Joker", "Joaquin Phoenix", "Gotham", "Todd Phillips", "mental health", "stand-up comedian", "Arthur Fleck"],
  },
  {
    id: "parasite",
    title: "Parasite",
    genres: ["Drama", "Thriller"],
    year: 2019,
    rating: 8.5,
    poster: picsumPoster("parasite"),
    description:
      "The destitute Kim family schemes their way one by one into the lives of the wealthy Park family, with darkly comic — then catastrophic — results in this Korean class-divide masterpiece.",
    themes: ["class divide", "Korean black comedy", "social satire", "violent twist", "Bong Joon-ho"],
    keywords: ["Bong Joon-ho", "Korean", "class", "Palme d'Or", "Oscar Best Picture", "wealth inequality", "dark comedy"],
  },
  {
    id: "1917",
    title: "1917",
    genres: ["Drama", "Action"],
    year: 2019,
    rating: 8.2,
    poster: picsumPoster("1917"),
    description:
      "Two young British soldiers race against time across no-man's-land in WWI to deliver a message that could save 1,600 men, in a war epic shot to look like a single continuous take.",
    themes: ["WWI war epic", "real-time tension", "brotherhood", "single-take filmmaking"],
    keywords: ["WWI", "Sam Mendes", "trench warfare", "long take", "British", "messenger", "1917"],
  },
  {
    id: "once-upon-hollywood",
    title: "Once Upon a Time in Hollywood",
    genres: ["Comedy", "Drama"],
    year: 2019,
    rating: 7.6,
    poster: picsumPoster("once-upon-hollywood"),
    description:
      "In 1969 Los Angeles, a faded TV cowboy and his loyal stunt double drift through the dying days of old Hollywood — with the Manson family lurking right next door.",
    themes: ["1969 Los Angeles", "Hollywood nostalgia", "friendship", "alternate history", "Tarantino"],
    keywords: ["Tarantino", "Brad Pitt", "Leonardo DiCaprio", "Manson", "Sharon Tate", "1960s", "Hollywood"],
  },
  {
    id: "the-irishman",
    title: "The Irishman",
    genres: ["Crime", "Drama"],
    year: 2019,
    rating: 7.8,
    poster: picsumPoster("the-irishman"),
    description:
      "An aging Irish-American mob hitman reflects on his decades-long association with the mafia and his role in the unsolved disappearance of union boss Jimmy Hoffa.",
    themes: ["mafia epic", "regret", "aging", "loyalty", "Scorsese sweeping crime"],
    keywords: ["Scorsese", "De Niro", "Al Pacino", "Joe Pesci", "Jimmy Hoffa", "mob", "mafia", "Netflix"],
  },
  {
    id: "marriage-story",
    title: "Marriage Story",
    genres: ["Drama", "Romance"],
    year: 2019,
    rating: 7.9,
    poster: picsumPoster("marriage-story"),
    description:
      "A theater director and his actress wife navigate the painful, bicoastal process of divorce while fighting bitterly for custody of their young son.",
    themes: ["divorce", "co-parenting", "modern marriage", "intimate drama", "actor breakdown scenes"],
    keywords: ["Noah Baumbach", "Adam Driver", "Scarlett Johansson", "divorce", "custody", "Los Angeles", "New York", "Netflix"],
  },
  {
    id: "jojo-rabbit",
    title: "Jojo Rabbit",
    genres: ["Comedy", "Drama"],
    year: 2019,
    rating: 7.9,
    poster: picsumPoster("jojo-rabbit"),
    description:
      "A lonely 10-year-old boy in WWII Germany discovers his mother is hiding a Jewish girl in their attic — while his only friend is a goofy, imaginary version of Adolf Hitler.",
    themes: ["satire", "anti-war", "child perspective", "Nazi Germany", "imaginary friend"],
    keywords: ["Taika Waititi", "Hitler", "Nazi", "WWII", "satire", "child", "Scarlett Johansson"],
  },
  {
    id: "little-women",
    title: "Little Women",
    genres: ["Drama", "Romance"],
    year: 2019,
    rating: 7.8,
    poster: picsumPoster("little-women"),
    description:
      "The four March sisters come of age in Civil War-era America, each pursuing love, art, and personal independence on their own terms in Greta Gerwig's spirited adaptation.",
    themes: ["sisterhood", "coming of age", "19th century America", "female autonomy", "writer's journey"],
    keywords: ["Greta Gerwig", "Saoirse Ronan", "Louisa May Alcott", "March sisters", "Civil War era", "period drama"],
  },
  {
    id: "avengers-endgame",
    title: "Avengers: Endgame",
    genres: ["Action", "Sci-Fi"],
    year: 2019,
    rating: 8.4,
    poster: picsumPoster("avengers-endgame"),
    description:
      "Five years after Thanos snapped half of all life out of existence, the surviving Avengers undertake a desperate time heist to undo his devastation and save the universe.",
    themes: ["superhero epic", "time heist", "sacrifice", "team finale", "ten-year payoff"],
    keywords: ["Marvel", "Avengers", "Thanos", "time travel", "Iron Man", "Captain America", "MCU", "Infinity Stones"],
  },
  {
    id: "black-panther",
    title: "Black Panther",
    genres: ["Action", "Adventure"],
    year: 2018,
    rating: 7.3,
    poster: picsumPoster("black-panther"),
    description:
      "T'Challa returns home to the secretive African nation of Wakanda to take the throne, but a long-lost relative arrives to challenge his rule and force the kingdom out of isolation.",
    themes: ["afrofuturism", "kingship and duty", "diaspora", "Marvel hero", "cultural pride"],
    keywords: ["Wakanda", "Marvel", "Chadwick Boseman", "vibranium", "Africa", "Killmonger", "Ryan Coogler"],
  },
  {
    id: "la-la-land",
    title: "La La Land",
    genres: ["Romance", "Drama"],
    year: 2016,
    rating: 8.0,
    poster: picsumPoster("la-la-land"),
    description:
      "An aspiring actress and a struggling jazz pianist fall in love in modern Los Angeles, each chasing their dreams as their relationship is tested by the cost of artistic ambition.",
    themes: ["modern musical", "Hollywood dreamers", "bittersweet romance", "jazz", "what-if ending"],
    keywords: ["musical", "Damien Chazelle", "Ryan Gosling", "Emma Stone", "jazz", "Los Angeles", "City of Stars"],
  },
  {
    id: "mad-max-fury-road",
    title: "Mad Max: Fury Road",
    genres: ["Action", "Adventure"],
    year: 2015,
    rating: 8.1,
    poster: picsumPoster("mad-max-fury-road"),
    description:
      "In a post-apocalyptic wasteland, Imperator Furiosa rebels against the tyrannical warlord Immortan Joe, leading his enslaved wives on a high-octane vehicular chase to freedom.",
    themes: ["post-apocalyptic chase", "feminist action", "practical stunts", "vehicular mayhem"],
    keywords: ["Mad Max", "Furiosa", "George Miller", "wasteland", "war boys", "Charlize Theron", "chase film"],
  },
  {
    id: "whiplash",
    title: "Whiplash",
    genres: ["Drama"],
    year: 2014,
    rating: 8.5,
    poster: picsumPoster("whiplash"),
    description:
      "An ambitious young jazz drummer enrolls at an elite music conservatory and is mentored — and brutally tormented — by an instructor who will accept nothing less than greatness.",
    themes: ["mentor abuse", "obsession with greatness", "music drama", "tension"],
    keywords: ["jazz drums", "Miles Teller", "J.K. Simmons", "Damien Chazelle", "music school", "perfection"],
  },
  {
    id: "birdman",
    title: "Birdman",
    genres: ["Comedy", "Drama"],
    year: 2014,
    rating: 7.7,
    poster: picsumPoster("birdman"),
    description:
      "A washed-up Hollywood actor known for playing a superhero stages an ambitious Broadway play to revive his career and reclaim his artistic credibility — while battling his own ego.",
    themes: ["faded fame", "artistic identity", "Broadway backstage", "meta-cinema", "one-take aesthetic"],
    keywords: ["Michael Keaton", "Iñárritu", "Broadway", "superhero satire", "Edward Norton", "Riggan"],
  },
  {
    id: "grand-budapest-hotel",
    title: "The Grand Budapest Hotel",
    genres: ["Comedy", "Adventure"],
    year: 2014,
    rating: 8.1,
    poster: picsumPoster("grand-budapest-hotel"),
    description:
      "In a fictional 1930s Eastern European country, the legendary concierge of a grand mountainside hotel and his trusted lobby boy become embroiled in the theft of a priceless painting.",
    themes: ["Wes Anderson whimsy", "symmetrical visuals", "European nostalgia", "comedic adventure"],
    keywords: ["Wes Anderson", "Ralph Fiennes", "hotel", "pastel", "Eastern Europe", "concierge", "ensemble"],
  },
  {
    id: "gravity",
    title: "Gravity",
    genres: ["Sci-Fi", "Drama"],
    year: 2013,
    rating: 7.7,
    poster: picsumPoster("gravity"),
    description:
      "A medical engineer on her first shuttle mission and a veteran astronaut must survive when debris destroys their craft, leaving them adrift in the silent void of space.",
    themes: ["survival in space", "minimal cast", "Alfonso Cuarón", "isolation", "rebirth"],
    keywords: ["Sandra Bullock", "George Clooney", "Cuarón", "space station", "survival", "zero gravity"],
  },
  {
    id: "12-years-a-slave",
    title: "12 Years a Slave",
    genres: ["Drama"],
    year: 2013,
    rating: 8.1,
    poster: picsumPoster("12-years-a-slave"),
    description:
      "Solomon Northup, a free Black man living in 1841 New York, is kidnapped and sold into slavery in the South, where he endures twelve years of horror in this devastating true story.",
    themes: ["true story slavery", "historical injustice", "endurance", "antebellum South"],
    keywords: ["slavery", "Solomon Northup", "Steve McQueen", "Chiwetel Ejiofor", "antebellum", "Best Picture"],
  },
  {
    id: "drive",
    title: "Drive",
    genres: ["Action", "Crime"],
    year: 2011,
    rating: 7.8,
    poster: picsumPoster("drive"),
    description:
      "A Hollywood stunt driver moonlights as a getaway driver and becomes entangled with his neighbor and her dangerous past in this neon-soaked, synthwave-scored Los Angeles noir.",
    themes: ["neon noir", "stoic protagonist", "Los Angeles night", "synth soundtrack", "violent crime"],
    keywords: ["Ryan Gosling", "Nicolas Winding Refn", "neon", "Los Angeles", "getaway driver", "synthwave"],
  },
  {
    id: "the-social-network",
    title: "The Social Network",
    genres: ["Drama"],
    year: 2010,
    rating: 7.8,
    poster: picsumPoster("the-social-network"),
    description:
      "Mark Zuckerberg founds Facebook from his Harvard dorm room, leading to lawsuits from former friends and a meteoric rise that costs him everything human in the process.",
    themes: ["startup origin", "betrayal", "ambition cost", "tech revolution", "Aaron Sorkin dialogue"],
    keywords: ["Facebook", "Mark Zuckerberg", "Harvard", "David Fincher", "Aaron Sorkin", "tech startup", "lawsuit"],
  },
];

/**
 * TVOD library tab-д харагдах category-уудын төрөл.
 * Тус бүрд топ 5 highlight кино.
 */
export type TvodCategory = {
  id: string;
  title: string;
  movies: TvodMovie[];
};

// =====================================================================
// CATEGORY DEFINITIONS — filter + sort logic-уудыг нэг газар
// =====================================================================
const byRating = (a: TvodMovie, b: TvodMovie) => b.rating - a.rating;
const byYear = (a: TvodMovie, b: TvodMovie) => b.year - a.year;
const hasGenre = (g: string) => (m: TvodMovie) => m.genres.includes(g);

type CategoryDef = {
  id: string;
  title: string;
  filter: (m: TvodMovie) => boolean;
  sort: (a: TvodMovie, b: TvodMovie) => number;
};

const categoryDefs: CategoryDef[] = [
  {
    id: "top-rated",
    title: "Топ үнэлгээтэй",
    filter: () => true,
    sort: byRating,
  },
  {
    id: "new-releases",
    title: "Шинээр нээлтээ хийсэн",
    filter: () => true,
    sort: byYear,
  },
  {
    id: "action",
    title: "Action ба Adventure",
    filter: (m) => hasGenre("Action")(m) || hasGenre("Adventure")(m),
    sort: byRating,
  },
  {
    id: "sci-fi",
    title: "Sci-Fi",
    filter: hasGenre("Sci-Fi"),
    sort: byRating,
  },
  {
    id: "drama",
    title: "Drama",
    filter: hasGenre("Drama"),
    sort: byRating,
  },
];

/**
 * Тухайн category-н БҮХ кинонуудыг filter + sort-той буцаах (detail page-д).
 */
export function getCategoryMovies(id: string): TvodMovie[] {
  const def = categoryDefs.find((c) => c.id === id);
  if (!def) return [];
  return tvodMovies.filter(def.filter).sort(def.sort);
}

/** Category-н title буцаах (detail page header-д) */
export function getCategoryTitle(id: string): string | undefined {
  return categoryDefs.find((c) => c.id === id)?.title;
}

/** Бүх category id-уудыг буцаах (static params generation-д хэрэг болж магадгүй) */
export function getCategoryIds(): string[] {
  return categoryDefs.map((c) => c.id);
}

/**
 * Landing page-д харагдах category-уудын top 5 (dedupped).
 * Кино бүр зөвхөн НЭГ category-д харагдана (дараалал priority).
 */
export const tvodCategories: TvodCategory[] = (() => {
  const used = new Set<string>();
  return categoryDefs.map((def) => {
    const source = tvodMovies.filter(def.filter).sort(def.sort);
    const picked: TvodMovie[] = [];
    for (const movie of source) {
      if (used.has(movie.id)) continue;
      used.add(movie.id);
      picked.push(movie);
      if (picked.length >= 5) break;
    }
    return { id: def.id, title: def.title, movies: picked };
  });
})();
