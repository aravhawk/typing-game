const excerpts = [
  "The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet at least once. Typing exercises help us master keyboard layouts and improve our communication skills.",
  "In the depths of winter, I finally learned that there was in me an invincible summer. The trees swayed gently in the evening breeze. Nature reminds us of the cycles of life and the resilience within all living things.",
  "Technology is best when it brings people together. The future of computing lies in understanding human connections and building bridges. Innovation thrives when we collaborate and share knowledge across boundaries.",
  "Writing is thinking on paper. Every word we type, every sentence we compose, shapes our thoughts and communicates our ideas. The act of writing clarifies our thinking and helps us understand ourselves better.",
  "The journey of a thousand miles begins with a single step. Progress happens gradually, one moment at a time. Patience and persistence are the keys to achieving our long-term goals and aspirations.",
  "Code is like humor. When you have to explain it, it's bad. The best solutions are elegant and immediately understandable. Clear code speaks for itself and requires no additional documentation to convey its purpose.",
  "In the quiet moments between keystrokes, ideas take shape. Focus and concentration create the space for creativity to flourish. Deep work requires us to eliminate distractions and embrace the flow state.",
  "Practice makes perfect. Every repetition strengthens neural pathways, building muscle memory and skill. Consistent effort over time transforms beginners into experts through dedicated training.",
  "The internet has become a vast repository of human knowledge. We can learn anything, connect with anyone, and explore endless possibilities. This digital age presents unprecedented opportunities for growth and discovery.",
  "Keyboard shortcuts save time and keep our hands on the keys. Efficiency comes from understanding the tools at our disposal. Mastering the fundamentals enables us to work faster and more effectively in any environment.",
  "Octopuses have three hearts and blue blood. Two hearts pump blood to the gills while the third sends it to the rest of the body. They can also change color and texture in milliseconds to blend into their surroundings.",
  "The Grand Canyon was carved over millions of years by the Colorado River. Its layered red rock reveals nearly two billion years of geological history. Standing at its rim, you can see formations older than most life on Earth.",
  "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that were thousands of years old and still perfectly edible. Its low moisture content and acidic pH create an environment where bacteria cannot survive.",
  "The longest recorded flight of a chicken is thirteen seconds. Chickens are descendants of the red junglefowl and were originally domesticated for cockfighting, not for food. They can recognize over one hundred individual faces.",
  "Glass is made by heating sand to an extremely high temperature until it melts. When it cools, the molecules freeze in a disordered state, making glass technically neither a solid nor a liquid. Ancient Romans were among the first to use glass windows.",
  "A single bolt of lightning contains enough energy to toast about a hundred thousand slices of bread. Lightning strikes the Earth roughly eight million times per day. The air around a bolt heats to five times the temperature of the sun.",
  "Bananas are berries, but strawberries are not. In botanical terms, a berry develops from a single flower with one ovary and has seeds embedded in the flesh. This classification surprises most people who learn it for the first time.",
  "The Arctic tern migrates from pole to pole each year, covering about seventy thousand kilometers. Over its lifetime, it travels the equivalent of three round trips to the moon. No other animal undertakes such a long annual journey.",
  "Paper was invented in China around the second century. Before that, people wrote on bamboo strips, silk, and even animal bones. The invention spread along the Silk Road and eventually transformed communication across the entire world.",
  "Coral reefs cover less than one percent of the ocean floor but support roughly a quarter of all marine species. They grow slowly, sometimes just a few centimeters per year. Healthy reefs also protect coastlines from storm damage and erosion.",
];

export function getRandomExcerpt() {
  return excerpts[Math.floor(Math.random() * excerpts.length)];
}

export { excerpts };
