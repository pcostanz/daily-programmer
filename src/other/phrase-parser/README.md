## Problem

Given input of a string, write a program that will output the top 10 repeated phrases from the input string. A phrase can be defined as three to ten consecutive words. Phrases are repeated if they are used at least two times. Phrases do not span sentences or punctuation like commas. Phrases that are nested within larger phrases should be omitted from the top 10 regardless of how frequently the nested phrase is used. For example, if "do the thing" and "do the thing with the stuff" are both repeat phrases, "do the thing" should not be part of the top 10.

### Example input

Well, I do think there's blame, yes. I do think there's blame on both sides. You look at both sides. I think there's blame on both sides and I have no doubt about it and you don't have any doubt about it either and, and, and, and if you reported it accurately, you would say it. You have some very bad people in that group, but you also had people that were very fine people on both sides. You had people in that group, excuse me, excuse me, I saw the same pictures as you did. You had people in that group that were there to protest the taking down of, to them, a very, very important statue and the renaming of a park from Robert E Lee to another name.

### Example output (verified in main.test.js)

[
  'i do think there's blame',
  'think there's blame on both sides',
  'doubt about it',
  'you had people in that group',
]
