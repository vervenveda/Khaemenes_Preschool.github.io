# Preschool Mentor — NAIB → Archaemenes patch

Target: `vervenveda/Khaemenes_Preschool.github.io/mentor/index.html`

Correct authority chain:

```text
Preschool Mentor Page
        ↓
       NAIB
        ↓
NAIB assigns mentor AI
        ↓
Archaemenes the Owl
        ↓
age/stage-adaptive presentation
```

The page still owns child-safe controls, learner-scoped progress, activity recommendations, session feelings, the contained app window, and voice/read-aloud controls. The page does **not** own mentor assignment.

## 1. Load the NAIB public router

Find:

```html
<script src="../assets/preschool-catalog.js"></script>
<script src="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js"></script>
<script>
```

Replace with:

```html
<script src="../assets/preschool-catalog.js"></script>
<script src="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-family-registry.js"></script>
<script src="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-naib-mentor-router.js"></script>
<script>
```

## 2. Replace the local mentor authority

Replace the complete `const MENTORS={...};` block with:

```js
const ARCHAEMENES_FALLBACK=Object.freeze({
  id:"archaemenes",
  name:"Archaemenes",
  title:"Scholar Owl",
  avatar:"🦉",
  colors:["#48baf0","#6bd8e7"],
  intro:"I am Archaemenes the Owl. Let’s look closely, wonder together, and choose one good next step.",
  presentationMode:"preschool-fallback",
  assignedBy:"NAIB"
});
```

The fallback only prevents a blank page if the router fails to load. It is not a second assignment authority.

## 3. Initialize with the fallback

Find:

```js
let mentor=MENTORS.pip;
```

Replace with:

```js
let mentor=ARCHAEMENES_FALLBACK;
let mentorAssignment=null;
```

## 4. Make the page ask NAIB

Replace the entire current `mentorDisplay()` function with:

```js
function mentorDisplay(){
  const naib=window.KhaemenesNAIB||null;

  mentorAssignment=naib?.assignMentor?.({
    personType:"learner",
    personId:learner?.accountId||learner?.learnerId||"",
    learnerId:learner?.learnerId||"",
    accountId:learner?.accountId||"",
    stage:learner?.stage||legacy?.pathway||"preschool",
    ageBand:currentAgeBand(),
    interests:currentInterests(),
    surface:"khaemenes-preschool-mentor",
    intent:"learning-mentor"
  })||null;

  if(mentorAssignment?.status==="assigned"&&mentorAssignment.mentor){
    try{
      window.dispatchEvent(new CustomEvent("khaemenes-mentor-assigned",{
        detail:{
          assignedBy:"NAIB",
          mentorId:mentorAssignment.mentorId,
          specialist:mentorAssignment.specialist,
          stage:mentorAssignment.stage,
          presentationMode:mentorAssignment.mentor.presentationMode
        }
      }));
    }catch{}
    return mentorAssignment.mentor;
  }

  return ARCHAEMENES_FALLBACK;
}
```

The page no longer reads `mentorId` or `mentorIdentity` to decide who the mentor is. Those fields can remain temporarily for compatibility and future migration.

## 5. Make the assignment visible

Inside `renderMentor()`, find:

```js
$("mentorLabel").textContent=`${learner.nickname||"Your"}’s learning Mentor`;
```

Replace with:

```js
$("mentorLabel").textContent=`${learner.nickname||"Your"}’s learning Mentor · assigned by NAIB`;
```

The child-facing identity remains **Archaemenes**.

## 6. Voice choices are voice styles, not other mentor identities

Replace the four labels in the `voiceFriends` HTML:

```html
<button class="voice-friend" data-voice-friend="sunny" aria-pressed="true"><span>☀️</span>Bright</button>
<button class="voice-friend" data-voice-friend="bunny" aria-pressed="false"><span>🐰</span>Playful</button>
<button class="voice-friend" data-voice-friend="rainbow" aria-pressed="false"><span>🌈</span>Warm</button>
<button class="voice-friend" data-voice-friend="owl" aria-pressed="false"><span>🦉</span>Story</button>
```

Then change the `VOICE_FRIENDS` display names/greetings so all greetings identify **Archaemenes**, not Sunny/Benny/Rae/Story Owl. Keep the current voice-selection regexes, rates, and pitches.

Suggested names/greetings:

```js
sunny:   {name:"Bright",   greeting:"Hello, learning friend. Archaemenes is ready for a bright little adventure."}
bunny:   {name:"Playful",  greeting:"Hello, learning friend. Archaemenes is ready for a playful learning adventure."}
rainbow: {name:"Warm",     greeting:"Hello, learning friend. Archaemenes is ready for a warm and colorful learning adventure."}
owl:     {name:"Story",    greeting:"Hello, careful listener. Archaemenes is ready for a gentle storytime adventure."}
```

Only replace `name` and `greeting`; preserve the existing `rate`, `pitch`, and `preferred` values.

## Future transport seam

Current transitional call:

```js
KhaemenesNAIB.assignMentor(context)
```

The router also exposes:

```js
await KhaemenesNAIB.requestMentor(context)
```

When the full NAIB / AI Adoption service exists, the pages keep calling NAIB. Only the implementation behind the router changes.
