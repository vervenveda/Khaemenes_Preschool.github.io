/*
 * Khaemenes Preschool Shared Catalog v1.0.0
 * ------------------------------------------------------------
 * One source of truth for:
 *   - Crechè Adventure Garden activity metadata
 *   - Guided Preschool mentor eligibility and planning metadata
 *
 * Compatibility rules:
 *   - `id` preserves the current Crechè/profile/favorites ID.
 *   - `mentor.legacyId` preserves the current Guided Preschool
 *     activity ID so existing mentor progress does not reset.
 *   - Existing filenames are preserved exactly, including legacy
 *     spaces/spellings. Consumers must URL-encode path segments.
 *
 * This file does not collect, transmit, or store learner data.
 */
(function attachKhaemenesPreschoolCatalog(global) {
  "use strict";

  const VERSION = "1.0.0";

  const CATEGORIES = {
  "all": {
    "label": "All Adventures",
    "icon": "✨",
    "a": "#7457ff",
    "b": "#ef5bb8"
  },
  "letters": {
    "label": "ABC Rocket",
    "icon": "🔤",
    "a": "#ff526d",
    "b": "#ff9d2e"
  },
  "words": {
    "label": "Words & Stories",
    "icon": "📚",
    "a": "#9a55e8",
    "b": "#ef5bb8"
  },
  "numbers": {
    "label": "Numbers & Shapes",
    "icon": "🔢",
    "a": "#168fe5",
    "b": "#22d0e8"
  },
  "art": {
    "label": "Little Art Studio",
    "icon": "🎨",
    "a": "#ff8a1f",
    "b": "#ffd437"
  },
  "feelings": {
    "label": "Feelings Garden",
    "icon": "💛",
    "a": "#f14fa8",
    "b": "#ff756c"
  },
  "life": {
    "label": "Life Skills Club",
    "icon": "🏡",
    "a": "#00ae88",
    "b": "#8bd738"
  },
  "music": {
    "label": "Music & Movement",
    "icon": "🎵",
    "a": "#6b63ee",
    "b": "#1ebfe8"
  },
  "movement": {
    "label": "Move & Groove",
    "icon": "🦘",
    "a": "#ff7a4f",
    "b": "#ffd23f"
  },
  "wonder": {
    "label": "Weather & Wonder",
    "icon": "🌎",
    "a": "#08a987",
    "b": "#48b8e8"
  },
  "grownup": {
    "label": "Grown-Up Corner",
    "icon": "🧑‍🧒",
    "a": "#4e5874",
    "b": "#28324d"
  }
};

  const MENTOR_DOMAINS = {
  "letters": {
    "label": "Language & Early Literacy",
    "icon": "🔤",
    "a": "#ef6a66",
    "b": "#f6a83a"
  },
  "numbers": {
    "label": "Numbers & Early Reasoning",
    "icon": "🔢",
    "a": "#2398d5",
    "b": "#42c7dc"
  },
  "feelings": {
    "label": "Feelings, Friendship & Self-Knowledge",
    "icon": "💛",
    "a": "#e95ca8",
    "b": "#ef7a6b"
  },
  "creative": {
    "label": "Art, Music & Imagination",
    "icon": "🎨",
    "a": "#7254d8",
    "b": "#e95ca8"
  },
  "movement": {
    "label": "Movement, Health & Life Skills",
    "icon": "🦘",
    "a": "#23a67c",
    "b": "#8ccf54"
  },
  "wonder": {
    "label": "Nature, Weather & Wonder",
    "icon": "🌎",
    "a": "#168a88",
    "b": "#42c7dc"
  }
};

  const ACTIVITIES = [
  {
    "id": "abc-story-time-folder",
    "title": "ABC Story Time",
    "file": "ABC_Story_Time/index.html",
    "category": "letters",
    "icon": "📖",
    "desc": "Open a gentle alphabet story experience for early readers and listeners.",
    "tags": "abc story time alphabet reading folder",
    "mentor": {
      "eligible": true,
      "legacyId": "abc-story",
      "domain": "letters",
      "ages": [
        "2-3",
        "3-4",
        "4-5"
      ],
      "minutes": 7,
      "energy": "gentle",
      "interests": [
        "stories"
      ],
      "desc": "Listen to a gentle alphabet story and notice letters."
    }
  },
  {
    "id": "art-color-studio-folder",
    "title": "Art Color Studio",
    "file": "Art_color_studio/index.html",
    "category": "art",
    "icon": "🎨",
    "desc": "Explore colors, drawing, and creative choices in a playful studio.",
    "tags": "art color studio drawing folder",
    "mentor": {
      "eligible": true,
      "legacyId": "color-studio",
      "domain": "creative",
      "ages": [
        "2-3",
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 10,
      "energy": "gentle",
      "interests": [
        "art"
      ],
      "desc": "Explore colors, drawing, and creative choices."
    }
  },
  {
    "id": "feelings-explorer-folder",
    "title": "Feelings Emotional Explorer",
    "file": "Feelings_emotional_explorer/index.html",
    "category": "feelings",
    "icon": "🧭",
    "desc": "Name feelings, notice body clues, and explore caring responses.",
    "tags": "feelings emotional explorer sel folder",
    "mentor": {
      "eligible": true,
      "legacyId": "feelings-explorer",
      "domain": "feelings",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "gentle",
      "interests": [
        "helping"
      ],
      "desc": "Name feelings, notice body clues, and explore caring responses."
    }
  },
  {
    "id": "brush-teeth-folder",
    "title": "How to Brush Your Teeth",
    "file": "Life_skills_little_Tikes_How_to_Brush_Your_Teeth/index.html",
    "category": "life",
    "icon": "🪥",
    "desc": "Learn a safe, child-friendly tooth-brushing routine.",
    "tags": "life skills brush teeth hygiene folder",
    "mentor": {
      "eligible": true,
      "legacyId": "brush-teeth",
      "domain": "movement",
      "ages": [
        "2-3",
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 6,
      "energy": "gentle",
      "interests": [
        "helping"
      ],
      "desc": "Learn a child-friendly tooth-brushing routine."
    }
  },
  {
    "id": "emotions-friendship-garden-folder",
    "title": "Emotions & Friendship Garden",
    "file": "Life_skills_little_Tikes_Life_Skills_Emotions_Friendship_Garden/index.html",
    "category": "feelings",
    "icon": "🌻",
    "desc": "Practice feelings, friendship, boundaries, kindness, and repair.",
    "tags": "life skills emotions friendship garden folder",
    "mentor": {
      "eligible": true,
      "legacyId": "friendship-garden",
      "domain": "feelings",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 9,
      "energy": "gentle",
      "interests": [
        "helping",
        "nature"
      ],
      "desc": "Practice friendship, boundaries, kindness, and repair."
    }
  },
  {
    "id": "sunny-abcs-folder",
    "title": "Sunny ABCs & 123s Storytime",
    "file": "Sunny_ABCs_123s_Storytime/index.html",
    "category": "letters",
    "icon": "🌞",
    "desc": "Explore letters, numbers, and cheerful storytime activities.",
    "tags": "sunny abc 123 storytime folder",
    "mentor": {
      "eligible": true,
      "legacyId": "sunny-story",
      "domain": "letters",
      "ages": [
        "2-3",
        "3-4",
        "4-5"
      ],
      "minutes": 8,
      "energy": "steady",
      "interests": [
        "stories",
        "numbers"
      ],
      "desc": "Meet letters and numbers in a cheerful storytime."
    }
  },
  {
    "id": "storybird-folder",
    "title": "Storybird Grove",
    "file": "reading_storybird_grove/index.html",
    "category": "words",
    "icon": "🐦",
    "desc": "Read, imagine, and explore stories in a gentle story grove.",
    "tags": "reading storybird grove folder",
    "mentor": {
      "eligible": true,
      "legacyId": "storybird",
      "domain": "letters",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 10,
      "energy": "gentle",
      "interests": [
        "stories",
        "nature"
      ],
      "desc": "Read, imagine, and explore a gentle story grove."
    }
  },
  {
    "id": "alphabet-adventure",
    "title": "Alphabet Adventure",
    "file": "ABC_Alphabet_Adventure_index.html",
    "category": "letters",
    "icon": "🧭",
    "desc": "Travel through a bright alphabet world filled with letters and pictures.",
    "tags": "alphabet adventure letters phonics",
    "mentor": {
      "eligible": true,
      "legacyId": "alphabet-adventure",
      "domain": "letters",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 9,
      "energy": "steady",
      "interests": [
        "stories"
      ],
      "desc": "Travel through a bright world of letters and pictures."
    }
  },
  {
    "id": "abc-bilingual",
    "title": "Bilingual ABC",
    "file": "ABC_bilingual_index.html",
    "category": "letters",
    "icon": "🌎",
    "desc": "Explore alphabet words across languages.",
    "tags": "alphabet bilingual language",
    "mentor": {
      "eligible": true,
      "legacyId": "bilingual-abc",
      "domain": "letters",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "steady",
      "interests": [
        "stories"
      ],
      "desc": "Explore alphabet words across languages."
    }
  },
  {
    "id": "abc-bubble",
    "title": "ABC Bubble Adventure",
    "file": "ABC_bubble_adventure_index.html",
    "category": "letters",
    "icon": "🫧",
    "desc": "Pop and match playful alphabet bubbles.",
    "tags": "alphabet bubbles game",
    "mentor": {
      "eligible": true,
      "legacyId": "abc-bubbles",
      "domain": "letters",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 7,
      "energy": "wiggly",
      "interests": [
        "movement"
      ],
      "desc": "Pop and match playful alphabet bubbles."
    }
  },
  {
    "id": "abc-cosmic",
    "title": "Cosmic Alphabet",
    "file": "ABC_cosmic_alphabet_index.html",
    "category": "letters",
    "icon": "🚀",
    "desc": "Practice letters among stars and planets.",
    "tags": "alphabet cosmic space",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "abc-match",
    "title": "ABC Match",
    "file": "ABC_match_index.html",
    "category": "letters",
    "icon": "🔤",
    "desc": "Match letters and pictures to build recognition.",
    "tags": "alphabet matching",
    "mentor": {
      "eligible": true,
      "legacyId": "abc-match",
      "domain": "letters",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 7,
      "energy": "steady",
      "interests": [
        "stories"
      ],
      "desc": "Match letters and pictures to build recognition."
    }
  },
  {
    "id": "abc-time",
    "title": "ABC Time",
    "file": "ABC_time_index.html",
    "category": "letters",
    "icon": "⏰",
    "desc": "Practice letters, sounds, and simple words.",
    "tags": "alphabet time phonics",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "art-resources",
    "title": "Little Artist Resources",
    "file": "Art _resources_index.html",
    "category": "art",
    "icon": "🧰",
    "desc": "Open a colorful collection of creative ideas and art resources.",
    "tags": "art resources supplies",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "art-color-mixing",
    "title": "Color Mixing Studio",
    "file": "Art_color_mixing_index.html",
    "category": "art",
    "icon": "🌈",
    "desc": "Mix colors and discover new combinations.",
    "tags": "art color mixing primary secondary",
    "mentor": {
      "eligible": true,
      "legacyId": "color-mixing",
      "domain": "creative",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "steady",
      "interests": [
        "art"
      ],
      "desc": "Mix colors and discover new combinations."
    }
  },
  {
    "id": "art-museum",
    "title": "Little Museum",
    "file": "Art_little_museum_index.html",
    "category": "art",
    "icon": "🏛️",
    "desc": "Explore a child-friendly little museum of art and ideas.",
    "tags": "art museum gallery",
    "mentor": {
      "eligible": true,
      "legacyId": "little-museum",
      "domain": "creative",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "gentle",
      "interests": [
        "art",
        "stories"
      ],
      "desc": "Explore a child-friendly museum of art and ideas."
    }
  },
  {
    "id": "art-match-colors",
    "title": "Match the Colors",
    "file": "Art_match_colors_index.html",
    "category": "art",
    "icon": "🎯",
    "desc": "Match and name colors through visual play.",
    "tags": "art colors matching",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "recipes",
    "title": "Little Kitchen Recipes",
    "file": "Life_Skills_kitchen_ resipes_index.html",
    "category": "life",
    "icon": "🥗",
    "desc": "Explore child-friendly recipes with adult help and kitchen safety.",
    "tags": "life skills kitchen recipes cooking",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "schoolwork",
    "title": "Schoolwork Helper",
    "file": "Life_Skills_schoolwork_index.html",
    "category": "life",
    "icon": "🎒",
    "desc": "Practice small, supportive steps for starting schoolwork.",
    "tags": "life skills schoolwork focus",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "compass",
    "title": "Compass Exploration",
    "file": "Life_skills_compass_exploration_index.html",
    "category": "life",
    "icon": "🧭",
    "desc": "Learn directions through a walking adventure.",
    "tags": "life skills compass directions",
    "mentor": {
      "eligible": true,
      "legacyId": "compass",
      "domain": "wonder",
      "ages": [
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "wiggly",
      "interests": [
        "nature",
        "movement"
      ],
      "desc": "Learn directions through a walking adventure."
    }
  },
  {
    "id": "support",
    "title": "Support Crechè",
    "file": "Life_skills_donate_index.html",
    "category": "grownup",
    "icon": "💝",
    "desc": "A grown-up support page for helping free learning tools grow.",
    "tags": "support donate grownup",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "life-skills-home",
    "title": "Life Skills Clubhouse",
    "file": "Life_skills_index.html",
    "category": "life",
    "icon": "🏡",
    "desc": "Enter the central life-skills learning space.",
    "tags": "life skills routines",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "kitchen-helper",
    "title": "Little Kitchen Helper",
    "file": "Life_skills_kitchen_helper_index.html",
    "category": "life",
    "icon": "👩‍🍳",
    "desc": "Learn safe, simple ways to help in the kitchen.",
    "tags": "life skills kitchen helper",
    "mentor": {
      "eligible": true,
      "legacyId": "kitchen-helper",
      "domain": "movement",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "steady",
      "interests": [
        "helping"
      ],
      "desc": "Learn safe ways to help in the kitchen with an adult."
    }
  },
  {
    "id": "make-bed",
    "title": "Making Your Bed",
    "file": "Life_skills_make_bed_index.html",
    "category": "life",
    "icon": "🛏️",
    "desc": "Practice caring for a sleeping space one step at a time.",
    "tags": "life skills make bed",
    "mentor": {
      "eligible": true,
      "legacyId": "make-bed",
      "domain": "movement",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 7,
      "energy": "steady",
      "interests": [
        "helping"
      ],
      "desc": "Practice caring for a sleeping space one step at a time."
    }
  },
  {
    "id": "organizer",
    "title": "Mini Organizer",
    "file": "Life_skills_organizer_index.html",
    "category": "life",
    "icon": "🗓️",
    "desc": "Practice tidy missions and simple routines.",
    "tags": "life skills organizer tidy",
    "mentor": {
      "eligible": true,
      "legacyId": "organizer",
      "domain": "movement",
      "ages": [
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "steady",
      "interests": [
        "helping"
      ],
      "desc": "Practice a small tidy mission and simple routine."
    }
  },
  {
    "id": "walk-dog",
    "title": "Walking With a Dog Safely",
    "file": "Life_skills_walk_dog_index.html",
    "category": "life",
    "icon": "🐕",
    "desc": "Learn adult-guided dog-walking safety and care.",
    "tags": "life skills dog safety",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "music-staff",
    "title": "Harmony Haven Staff Studio",
    "file": "Music_staff_studio_index.html",
    "category": "music",
    "icon": "🎼",
    "desc": "Write notes on a staff and play back a simple score.",
    "tags": "music staff notation composer",
    "mentor": {
      "eligible": true,
      "legacyId": "music-staff",
      "domain": "creative",
      "ages": [
        "4-5",
        "5-6"
      ],
      "minutes": 9,
      "energy": "steady",
      "interests": [
        "music"
      ],
      "desc": "Place notes on a staff and hear a simple score."
    }
  },
  {
    "id": "move-groove",
    "title": "Move & Groove",
    "file": "PE_move_n_groove_index.html",
    "category": "movement",
    "icon": "💃",
    "desc": "Move through 42 warm-ups, active games, cool-downs, and safe learning checks.",
    "tags": "movement physical education pe exercise dance fitness",
    "mentor": {
      "eligible": true,
      "legacyId": "move-groove",
      "domain": "movement",
      "ages": [
        "2-3",
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "wiggly",
      "interests": [
        "movement",
        "music"
      ],
      "desc": "Move through a safe warm-up, active game, and cool-down."
    }
  },
  {
    "id": "spelling-game",
    "title": "Spelling Game",
    "file": "Spelling_game_index.html",
    "category": "words",
    "icon": "🧩",
    "desc": "Build words through playful spelling practice.",
    "tags": "spelling game",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "spelling-journal",
    "title": "Spelling Journal",
    "file": "Spelling_journal_index.html",
    "category": "words",
    "icon": "📓",
    "desc": "Record and practice new spelling words.",
    "tags": "spelling journal writing",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "spelling-safari",
    "title": "Spelling Safari",
    "file": "Spelling_safari_index.html",
    "category": "words",
    "icon": "🦒",
    "desc": "Go on a word safari with letters and spelling patterns.",
    "tags": "spelling safari",
    "mentor": {
      "eligible": true,
      "legacyId": "spelling-safari",
      "domain": "letters",
      "ages": [
        "5-6"
      ],
      "minutes": 9,
      "energy": "steady",
      "interests": [
        "stories",
        "nature"
      ],
      "desc": "Go on a word safari with early spelling patterns."
    }
  },
  {
    "id": "sunny-abcs-file",
    "title": "Sunny ABCs & 123s Storytime",
    "file": "Sunny_ABCs_123s_Storytime_index.html",
    "category": "letters",
    "icon": "☀️",
    "desc": "A single-file Sunny letters, numbers, and storytime adventure.",
    "tags": "sunny abc 123 storytime",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "drawing-tool",
    "title": "Drawing Tool",
    "file": "art_drawing_tool_index.html",
    "category": "art",
    "icon": "🖍️",
    "desc": "Draw, doodle, and create freely.",
    "tags": "art drawing tool",
    "mentor": {
      "eligible": true,
      "legacyId": "drawing",
      "domain": "creative",
      "ages": [
        "2-3",
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 10,
      "energy": "gentle",
      "interests": [
        "art"
      ],
      "desc": "Draw, doodle, and create freely."
    }
  },
  {
    "id": "kindness",
    "title": "Acts of Kindness",
    "file": "feelings_act_of_kindness_index.html",
    "category": "feelings",
    "icon": "💛",
    "desc": "Practice kind choices and caring actions.",
    "tags": "feelings kindness empathy",
    "mentor": {
      "eligible": true,
      "legacyId": "kindness",
      "domain": "feelings",
      "ages": [
        "2-3",
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 6,
      "energy": "gentle",
      "interests": [
        "helping"
      ],
      "desc": "Practice kind choices and caring actions."
    }
  },
  {
    "id": "feelings-game",
    "title": "Feelings Game",
    "file": "feelings_game_index.html",
    "category": "feelings",
    "icon": "🎭",
    "desc": "Identify emotions in everyday situations.",
    "tags": "feelings game emotions",
    "mentor": {
      "eligible": true,
      "legacyId": "feelings-game",
      "domain": "feelings",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 7,
      "energy": "steady",
      "interests": [
        "helping",
        "stories"
      ],
      "desc": "Identify feelings in everyday situations."
    }
  },
  {
    "id": "noetic-emotions",
    "title": "Noetic Emotions Explorer",
    "file": "feelings_noetic_emotions_index.html",
    "category": "feelings",
    "icon": "🧠",
    "desc": "Explore emotions, thoughts, and inner experiences gently.",
    "tags": "feelings noetic emotions",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "joke-jar",
    "title": "Joke Jar",
    "file": "joke_jar_index.html",
    "category": "wonder",
    "icon": "😂",
    "desc": "Open the jar for a child-friendly joke and giggle.",
    "tags": "jokes humor language",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "math-cloud",
    "title": "Pre-K Math Cloud",
    "file": "math_cloud_index.html",
    "category": "numbers",
    "icon": "☁️",
    "desc": "Travel through a complete early-math learning journey.",
    "tags": "math numbers curriculum",
    "mentor": {
      "eligible": true,
      "legacyId": "math-cloud",
      "domain": "numbers",
      "ages": [
        "4-5",
        "5-6"
      ],
      "minutes": 10,
      "energy": "steady",
      "interests": [
        "numbers"
      ],
      "desc": "Travel through a complete early-math journey."
    }
  },
  {
    "id": "piano",
    "title": "Little Composer Piano",
    "file": "music_piano_index.html",
    "category": "music",
    "icon": "🎹",
    "desc": "Play rainbow keys, record melodies, and explore sound.",
    "tags": "music piano composer",
    "mentor": {
      "eligible": true,
      "legacyId": "piano",
      "domain": "creative",
      "ages": [
        "2-3",
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "wiggly",
      "interests": [
        "music"
      ],
      "desc": "Play rainbow keys and explore sound."
    }
  },
  {
    "id": "numbers-1-12",
    "title": "Numbers 1–12 Fun",
    "file": "numbers_1-12_fun_index.html",
    "category": "numbers",
    "icon": "1️⃣",
    "desc": "Count and recognize numbers one through twelve.",
    "tags": "numbers counting",
    "mentor": {
      "eligible": true,
      "legacyId": "numbers-1-12",
      "domain": "numbers",
      "ages": [
        "2-3",
        "3-4",
        "4-5"
      ],
      "minutes": 7,
      "energy": "steady",
      "interests": [
        "numbers"
      ],
      "desc": "Count and recognize numbers one through twelve."
    }
  },
  {
    "id": "numbers-drag",
    "title": "Numbers Drag & Drop",
    "file": "numbers_drag_n_drop_index.html",
    "category": "numbers",
    "icon": "🖐️",
    "desc": "Drag numbers into order and matching spaces.",
    "tags": "numbers drag drop",
    "mentor": {
      "eligible": true,
      "legacyId": "numbers-drag",
      "domain": "numbers",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 7,
      "energy": "steady",
      "interests": [
        "numbers",
        "movement"
      ],
      "desc": "Drag numbers into order and matching spaces."
    }
  },
  {
    "id": "learn-word",
    "title": "Learn a New Word",
    "file": "reading_learnanewword_index.html",
    "category": "words",
    "icon": "💬",
    "desc": "Discover one new word at a time.",
    "tags": "reading vocabulary",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "sight-words",
    "title": "Sight Words",
    "file": "reading_sight_words_index.html",
    "category": "words",
    "icon": "👀",
    "desc": "Practice common early-reading words.",
    "tags": "reading sight words",
    "mentor": {
      "eligible": true,
      "legacyId": "sight-words",
      "domain": "letters",
      "ages": [
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "steady",
      "interests": [
        "stories"
      ],
      "desc": "Practice common early-reading words."
    }
  },
  {
    "id": "shapes-game",
    "title": "Shapes Game",
    "file": "shapes_game_index.html",
    "category": "numbers",
    "icon": "🔺",
    "desc": "Explore common shapes through colorful play.",
    "tags": "shapes geometry",
    "mentor": {
      "eligible": true,
      "legacyId": "shapes-game",
      "domain": "numbers",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 7,
      "energy": "steady",
      "interests": [
        "numbers",
        "art"
      ],
      "desc": "Explore common shapes through colorful play."
    }
  },
  {
    "id": "shapes-match",
    "title": "Match the Shapes",
    "file": "shapes_match_index.html",
    "category": "numbers",
    "icon": "🟦",
    "desc": "Match shapes by form and color.",
    "tags": "shapes matching",
    "mentor": {
      "eligible": true,
      "legacyId": "shape-match",
      "domain": "numbers",
      "ages": [
        "2-3",
        "3-4",
        "4-5"
      ],
      "minutes": 6,
      "energy": "gentle",
      "interests": [
        "numbers",
        "art"
      ],
      "desc": "Match shapes by form and color."
    }
  },
  {
    "id": "weather-tots",
    "title": "Weather for Tots",
    "file": "weather_for_tots_index.html",
    "category": "wonder",
    "icon": "🌦️",
    "desc": "Meet sunshine, clouds, rain, snow, wind, and fog.",
    "tags": "weather tots",
    "mentor": {
      "eligible": true,
      "legacyId": "weather-tots",
      "domain": "wonder",
      "ages": [
        "2-3",
        "3-4",
        "4-5"
      ],
      "minutes": 7,
      "energy": "gentle",
      "interests": [
        "nature"
      ],
      "desc": "Meet sunshine, clouds, rain, snow, wind, and fog."
    }
  },
  {
    "id": "weather-adventure",
    "title": "Sunny's Weather Adventure",
    "file": "weather_index.html",
    "category": "wonder",
    "icon": "☀️",
    "desc": "Explore animated weather scenes with Sunny.",
    "tags": "weather sunny adventure",
    "mentor": {
      "eligible": true,
      "legacyId": "sunny-weather",
      "domain": "wonder",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "steady",
      "interests": [
        "nature"
      ],
      "desc": "Explore animated weather scenes with Sunny."
    }
  },
  {
    "id": "moon-phase",
    "title": "Sunny's Moon Adventure",
    "file": "weather_moon_phase_index.html",
    "category": "wonder",
    "icon": "🌙",
    "desc": "Explore the eight main lunar phases.",
    "tags": "moon phases",
    "mentor": {
      "eligible": true,
      "legacyId": "moon",
      "domain": "wonder",
      "ages": [
        "4-5",
        "5-6"
      ],
      "minutes": 8,
      "energy": "gentle",
      "interests": [
        "space",
        "nature"
      ],
      "desc": "Explore the eight main lunar phases."
    }
  },
  {
    "id": "solanar-weather",
    "title": "Solanar Kid Weather",
    "file": "weather_solonarium_index.html",
    "category": "wonder",
    "icon": "🌤️",
    "desc": "See real current weather, hourly conditions, and a 7-day forecast.",
    "tags": "weather real forecast solanar",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "wondercabinet",
    "title": "The Wondercabinet",
    "file": "wondercabinet_index.html",
    "category": "wonder",
    "icon": "🗝️",
    "desc": "Open tiny drawers for words, tracing, stories, art, calm, music, and rewards.",
    "tags": "wonder cabinet curiosity",
    "mentor": {
      "eligible": true,
      "legacyId": "wondercabinet",
      "domain": "wonder",
      "ages": [
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 9,
      "energy": "steady",
      "interests": [
        "stories",
        "art",
        "music"
      ],
      "desc": "Open drawers for words, tracing, stories, art, calm, and music."
    }
  },
  {
    "id": "abc-adventure-hub",
    "title": "ABC Adventure Hub",
    "file": "ABC_adventure_hub_index.html",
    "category": "letters",
    "icon": "🚪",
    "desc": "Enter the central alphabet hub and choose from several letter-learning adventures.",
    "tags": "abc alphabet adventure hub letters phonics portal",
    "mentor": {
      "eligible": false
    }
  },
  {
    "id": "cosmic-arabic",
    "title": "Cosmic Arabic Alphabet Quest",
    "file": "cosmic_arabic_alphabet_quest_index.html",
    "category": "letters",
    "icon": "🌙",
    "desc": "Explore all 28 Arabic letters through tracing, listening, matching, and a 42-week constellation journey.",
    "tags": "arabic alphabet language tracing phonics multilingual cosmic",
    "mentor": {
      "eligible": true,
      "legacyId": "cosmic-arabic",
      "domain": "letters",
      "ages": [
        "4-5",
        "5-6"
      ],
      "minutes": 10,
      "energy": "steady",
      "interests": [
        "space",
        "stories"
      ],
      "desc": "Trace and hear Arabic letters in a constellation journey."
    }
  },
  {
    "id": "little-worlds",
    "title": "Little Worlds Promenade",
    "file": "little_worlds_promenade_index.html",
    "category": "wonder",
    "icon": "🎠",
    "desc": "Visit imaginative little worlds filled with gentle discovery, play, and curiosity.",
    "tags": "little worlds promenade imagination exploration wonder",
    "mentor": {
      "eligible": true,
      "legacyId": "little-worlds",
      "domain": "wonder",
      "ages": [
        "2-3",
        "3-4",
        "4-5",
        "5-6"
      ],
      "minutes": 9,
      "energy": "gentle",
      "interests": [
        "stories",
        "art"
      ],
      "desc": "Visit imaginative little worlds filled with gentle discovery."
    }
  }
];

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
    return value;
  }

  function byId(id) {
    return ACTIVITIES.find(activity => activity.id === id) || null;
  }

  function byFile(file) {
    return ACTIVITIES.find(activity => activity.file === file) || null;
  }

  function byMentorId(id) {
    return ACTIVITIES.find(activity =>
      activity.mentor?.eligible && activity.mentor.legacyId === id
    ) || null;
  }

  function childActivities() {
    return ACTIVITIES.filter(activity => activity.category !== "grownup");
  }

  function grownupActivities() {
    return ACTIVITIES.filter(activity => activity.category === "grownup");
  }

  function mentorActivities({ preserveLegacyIds = true } = {}) {
    return ACTIVITIES
      .filter(activity => activity.mentor?.eligible)
      .map(activity => ({
        id: preserveLegacyIds ? activity.mentor.legacyId : activity.id,
        catalogId: activity.id,
        title: activity.title,
        file: activity.file,
        category: activity.category,
        domain: activity.mentor.domain,
        icon: activity.icon,
        ages: [...activity.mentor.ages],
        minutes: activity.mentor.minutes,
        energy: activity.mentor.energy,
        interests: [...activity.mentor.interests],
        desc: activity.mentor.desc || activity.desc,
        tags: activity.tags
      }));
  }

  function validate() {
    const errors = [];
    const warnings = [];
    const ids = new Set();
    const files = new Set();
    const mentorIds = new Set();
    const ageBands = new Set(["2-3", "3-4", "4-5", "5-6"]);
    const energyLevels = new Set(["gentle", "steady", "wiggly"]);

    for (const activity of ACTIVITIES) {
      if (!activity.id) errors.push("An activity is missing id.");
      if (!activity.title) errors.push(`${activity.id || "unknown"} is missing title.`);
      if (!activity.file) errors.push(`${activity.id || "unknown"} is missing file.`);

      if (ids.has(activity.id)) errors.push(`Duplicate activity id: ${activity.id}`);
      ids.add(activity.id);

      if (files.has(activity.file)) errors.push(`Duplicate activity file: ${activity.file}`);
      files.add(activity.file);

      if (!CATEGORIES[activity.category]) {
        errors.push(`${activity.id} uses unknown Crechè category: ${activity.category}`);
      }

      if (activity.mentor?.eligible) {
        const mentor = activity.mentor;

        if (!mentor.legacyId) errors.push(`${activity.id} mentor metadata is missing legacyId.`);
        if (mentorIds.has(mentor.legacyId)) errors.push(`Duplicate mentor legacyId: ${mentor.legacyId}`);
        mentorIds.add(mentor.legacyId);

        if (!MENTOR_DOMAINS[mentor.domain]) {
          errors.push(`${activity.id} uses unknown mentor domain: ${mentor.domain}`);
        }

        if (!Array.isArray(mentor.ages) || !mentor.ages.length) {
          errors.push(`${activity.id} has no mentor age bands.`);
        } else {
          mentor.ages.forEach(age => {
            if (!ageBands.has(age)) errors.push(`${activity.id} uses unknown age band: ${age}`);
          });
        }

        if (!energyLevels.has(mentor.energy)) {
          errors.push(`${activity.id} uses unknown energy level: ${mentor.energy}`);
        }

        if (!(Number(mentor.minutes) > 0 && Number(mentor.minutes) <= 12)) {
          errors.push(`${activity.id} mentor minutes must be between 1 and 12.`);
        }
      }
    }

    const children = childActivities().length;
    const grownups = grownupActivities().length;
    const mentorCount = ACTIVITIES.filter(activity => activity.mentor?.eligible).length;

    if (children !== 52) warnings.push(`Expected 52 child activities; found ${children}.`);
    if (grownups !== 1) warnings.push(`Expected 1 grown-up resource; found ${grownups}.`);
    if (mentorCount !== 36) warnings.push(`Expected 36 mentor-eligible activities; found ${mentorCount}.`);

    return {
      ok: errors.length === 0,
      version: VERSION,
      counts: {
        total: ACTIVITIES.length,
        children,
        grownups,
        mentorEligible: mentorCount
      },
      errors,
      warnings
    };
  }

  deepFreeze(CATEGORIES);
  deepFreeze(MENTOR_DOMAINS);
  deepFreeze(ACTIVITIES);

  const API = {
    version: VERSION,
    categories: CATEGORIES,
    mentorDomains: MENTOR_DOMAINS,
    activities: ACTIVITIES,
    byId,
    byFile,
    byMentorId,
    childActivities,
    grownupActivities,
    mentorActivities,
    validate
  };

  Object.freeze(API);
  global.KhaemenesPreschoolCatalog = API;

  const audit = validate();
  if (!audit.ok) {
    console.error("Khaemenes Preschool shared catalog validation failed.", audit);
  } else if (audit.warnings.length) {
    console.warn("Khaemenes Preschool shared catalog warnings.", audit);
  }
})(window);
