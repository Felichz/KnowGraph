// Card context sentences (src/logic/guidance.js). {names} is a list of concept titles.
export default {
  start: "{lead}This is the starting point: it does not assume any earlier concept.",
  missing: "{lead}Before studying this concept you need to complete: {names}. Those concepts appear here as a foundation, not as an optional detail.",
  after: "{lead}You got here after {names}; this concept uses those ideas and adds a new decision.",
  and: " and ",
};
