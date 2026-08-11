// Per-game beginner guides. Update `updated` whenever a guide is revised so
// players can see the arena's guides evolve over time.

export interface GameGuide {
  id: string;
  title: string;
  howToPlay: string[];
  beginnerTips: string[];
  proTips: string[];
  updated: string;
}

export const GUIDES: GameGuide[] = [
  {
    id: 'spin',
    title: 'Spin the Cup',
    howToPlay: [
      'Three cups line up in front of you. One hides a pebble underneath.',
      'Watch closely while the cups shuffle around.',
      'When the cups stop, click the cup you believe holds the pebble.',
      'Lift the cup to reveal the answer. Correct picks earn points and a new round.',
      'Clear all 8 rounds to win the game.',
    ],
    beginnerTips: [
      'This is the friendliest game in the arena. Start here before anything else.',
      'Do not look away during the shuffle. Fix your eyes on the cup with the pebble.',
      'Watch the cup, not the pebble. The cup is what moves.',
    ],
    proTips: [
      'On Fast Shuffle the cups move six times. Try to track the pebble through every single swap.',
      'Cups that cross each other are easy to lose. Count swaps instead of following the cup.',
      'Pick fast after the shuffle stops: speed is part of your score.',
    ],
    updated: '2026-08-10',
  },
  {
    id: 'classic',
    title: 'Classic Pairs',
    howToPlay: [
      'A grid of face-down cards is dealt. Each card has a matching twin somewhere on the board.',
      'Click a card to reveal it, then click a second card to look for its pair.',
      'If the two cards match, they stay revealed. If not, they flip back over.',
      'Clear the whole board to complete the game.',
    ],
    beginnerTips: [
      'Always open cards in a pattern: left to right, row by row. It is easier to remember positions.',
      'Only flip the second card after you have memorized where the first one sits.',
      'Start with the 4x4 grid. Sixteen cards are much easier than thirty-six.',
    ],
    proTips: [
      'Talk to yourself. Saying "crown, third row, second from the left" builds stronger memory traces.',
      'Keep a mental map of failed pairs too. Knowing where something is NOT is half the win.',
      'Speed bonus rewards finishing under 30 seconds, but combos reward accuracy. Play clean, then fast.',
    ],
    updated: '2026-08-10',
  },
  {
    id: 'pattern',
    title: 'Pattern Echo',
    howToPlay: [
      'Cells on a grid light up one by one in a sequence.',
      'Watch the whole sequence before touching anything.',
      'When the prompt appears, repeat the sequence by clicking the cells in the exact same order.',
      'Each correct round adds one more step and the sequence gets faster.',
    ],
    beginnerTips: [
      'Break the sequence into chunks of two or three cells, like reading a phone number.',
      'Give the cells nicknames ("top left corner") instead of raw positions.',
      'Stay on the 3x3 grid until you can clear several rounds without a mistake.',
    ],
    proTips: [
      'Chunk the sequence into rhythm groups and tap along mentally.',
      'Anchor the first cell to a fixed landmark. Everything else builds from it.',
      'When speed rises, stop narrating and let the pattern be visual only.',
    ],
    updated: '2026-08-10',
  },
  {
    id: 'number',
    title: 'Number Vault',
    howToPlay: [
      'A string of digits flashes on screen for a few seconds.',
      'Wait for the prompt, then type the digits back on the number pad.',
      'Forward mode asks for the digits in order. Reverse and Ascending change the rules.',
      'A correct answer grows the sequence and your score.',
    ],
    beginnerTips: [
      'Read the digits out loud as they appear. Sound doubles the memory channel.',
      'Group them like a date or a price: 482901 becomes 48-29-01.',
      'Start in Forward mode to learn the rhythm, then try Reverse.',
    ],
    proTips: [
      'In Reverse mode, memorize the sequence as a sound ("four-eight-two") and replay it backwards.',
      'In Ascending mode, sort the digits in your head before they disappear.',
      'Keep a steady typing rhythm. Hesitation eats your speed bonus.',
    ],
    updated: '2026-08-10',
  },
  {
    id: 'stars',
    title: 'Chasing Stars',
    howToPlay: [
      'Stars appear at random positions on a grid and then vanish.',
      'Memorize exactly which cells held the stars.',
      'Click every star position. Miss one and the game ends.',
    ],
    beginnerTips: [
      'Sketch the shape the stars make. A triangle is easier to keep than five separate dots.',
      'Anchor the stars to the grid edges and corners first.',
      'Play on the 3x3 grid to learn the trick, then grow the board.',
    ],
    proTips: [
      'Count the stars and check them off as you click. Never trust the grid alone.',
      'Close your eyes for half a second to "lock in" the image.',
      'Use the edges: stars near a corner are easier to hold in memory, so scan corners first.',
    ],
    updated: '2026-08-10',
  },
  {
    id: 'color',
    title: 'Color Cascade',
    howToPlay: [
      'Colored buttons light up one at a time in a sequence.',
      'Watch the cascade and memorize the order of colors.',
      'When your turn comes, repeat the cascade by clicking the buttons in order.',
      'Each successful round extends the cascade.',
    ],
    beginnerTips: [
      'Say the color names out loud as they flash.',
      'Attach colors to familiar things: "red like the rose, blue like the sky".',
      'Start on Easy with four colors so the palette is small.',
    ],
    proTips: [
      'Assign each color a finger position so your hand remembers the pattern too.',
      'When the cascade speeds up, stop naming colors and feel the rhythm.',
      'Watch the full cascade before planning: planning while watching causes missed steps.',
    ],
    updated: '2026-08-10',
  },
  {
    id: 'words',
    title: 'Word Chain',
    howToPlay: [
      'Words appear one at a time and stack up in your memory.',
      'After the reveal, type every word you saw, in order.',
      'Each word you enter correctly locks into the chain.',
      'A wrong word ends the run.',
    ],
    beginnerTips: [
      'Build a silly sentence from the first letters of the words.',
      'Type each word as soon as it appears to practice the spelling.',
      'Easy mode uses short words. Master it before attempting Long words.',
    ],
    proTips: [
      'Store the words as images, not letters. "Apple" becomes a picture of an apple.',
      'Keep a running story as the chain grows. Stories are far stickier than lists.',
      'Press Enter immediately after each word to keep the rhythm steady.',
    ],
    updated: '2026-08-10',
  },
  {
    id: 'path',
    title: 'Pathfinder',
    howToPlay: [
      'A route lights up across a grid, from the green start to the red finish.',
      'Memorize the route while it is shown.',
      'After it fades, walk the same route by clicking each square in order.',
      'One wrong step ends the run.',
    ],
    beginnerTips: [
      'Trace the route with your eyes two or three times while it is visible.',
      'Notice whether the route hugs the edges or cuts across the middle.',
      'Start on the small 4x4 grid to feel the pacing.',
    ],
    proTips: [
      'Memorize the turns, not the squares: "right, down, down, right".',
      'Count how many times the route changes direction. It is usually fewer than the squares.',
      'On larger grids, split the route into thirds and check off each third as you walk it.',
    ],
    updated: '2026-08-10',
  },
  {
    id: 'rhythm',
    title: 'Rhythm Recall',
    howToPlay: [
      'Pads light up and play a beat, one after another.',
      'Listen and watch the rhythm pattern.',
      'On your turn, hit the pads in the exact same order.',
      'Correct rounds add beats and raise the tempo.',
    ],
    beginnerTips: [
      'Hum the beat to yourself as it plays.',
      'Tap the rhythm with a finger on the table. Body memory helps.',
      'Stay on the 4-pad Easy setting while you learn the pattern shape.',
    ],
    proTips: [
      'Count the beats ("one two, one two three") instead of watching the pads.',
      'Memorize the pattern as a song, not a list of pads.',
      'Keep your eyes on the center and let your peripheral vision catch the flashes.',
    ],
    updated: '2026-08-10',
  },
  {
    id: 'ship',
    title: 'Spaceship Run',
    howToPlay: [
      'A safe route snakes from your ship on the left to a planet on the right.',
      'The route is shown for a few seconds. Memorize every step.',
      'When it hides, fly the route by clicking each safe cell in order.',
      'Clicking an asteroid ends the run. Reaching the planet wins.',
    ],
    beginnerTips: [
      'Watch the route as a single line, not as separate cells.',
      'Notice the shape: does it climb, dive, or stay level?',
      'Start on the Short Route (3 steps) to learn the rhythm.',
    ],
    proTips: [
      'Memorize the turns ("up, straight, down") instead of individual squares.',
      'Anchor the route to the grid edges, just like Pathfinder.',
      'Fly quickly on the first two steps and slow down for the final approach: the speed bonus rewards fast flights.',
    ],
    updated: '2026-08-10',
  },
];

export function getGuide(id: string): GameGuide | undefined {
  return GUIDES.find((g) => g.id === id);
}
