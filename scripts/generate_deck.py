"""
One-time generator for the 78-card Tarot dataset.
Run with: python3 scripts/generate_deck.py
Outputs: src/lib/tarot/deck-data.json  (consumed by src/lib/tarot/deck.ts)

Major Arcana (22) have hand-authored unique meanings.
Minor Arcana (56) are assembled from a suit-meaning + rank-meaning matrix,
so every card gets genuinely distinct, non-duplicate copy (not filler text).
"""
import json
import re

def slugify(name):
    s = name.lower().replace("'", "")
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

MAJOR = [
    ("The Fool", 0, ["new beginnings", "spontaneity", "innocence", "a leap of faith"],
     ["recklessness", "hesitation", "poor judgment", "naivety"],
     "The Fool represents a fresh start and the willingness to step into the unknown with an open heart, trusting the journey even without a fixed plan.",
     "Reversed, The Fool can point to hesitation, impulsiveness without reflection, or a fear of taking the first step.",
     "A new connection or a lighter, more spontaneous chapter in love may be beginning.",
     "An invitation to consider a new path or opportunity, even if the destination isn't fully mapped out.",
     "A reminder to approach spending or new ventures with curiosity, but also basic caution.",
     "yes"),
    ("The Magician", 1, ["manifestation", "resourcefulness", "willpower", "skill"],
     ["manipulation", "untapped potential", "poor planning"],
     "The Magician suggests you already have the tools, skills, and resources needed to move forward; it's a card of focused intention becoming action.",
     "Reversed, it may point to scattered energy, unused talent, or a gap between intention and follow-through.",
     "You may have more influence over the direction of this connection than you realize.",
     "A moment to actively use your skills and take initiative rather than waiting.",
     "Encourages resourcefulness and confidence in using what you already have.",
     "yes"),
    ("The High Priestess", 2, ["intuition", "mystery", "inner knowing", "stillness"],
     ["secrets", "disconnection from intuition", "withheld information"],
     "The High Priestess invites you to trust quiet inner knowing over noise, and to sit with a question rather than rush an answer.",
     "Reversed, it can suggest ignoring your intuition or information that is being kept hidden.",
     "Feelings may be present but not yet openly expressed by one or both people.",
     "Suggests patience — some information may not be ready to be revealed yet.",
     "A caution against decisions made without full information; more may be beneath the surface.",
     "unclear"),
    ("The Empress", 3, ["abundance", "nurturing", "creativity", "growth"],
     ["creative block", "overdependence", "neglect"],
     "The Empress reflects abundance, nurturing, and creative growth — a season where care and patience help things flourish.",
     "Reversed, it may point to feeling creatively blocked, depleted, or overly self-critical.",
     "A warm, nurturing energy that may deepen emotional closeness.",
     "Growth-oriented energy; a good period for creative or collaborative work.",
     "Suggests steady, well-tended growth rather than quick wins.",
     "yes"),
    ("The Emperor", 4, ["structure", "authority", "stability", "discipline"],
     ["rigidity", "control issues", "lack of discipline"],
     "The Emperor represents structure, stability, and clear boundaries — the value of building something on a solid foundation.",
     "Reversed, it can suggest excessive control, rigidity, or a lack of structure where it's needed.",
     "May point to a desire for stability, commitment, or clearer boundaries.",
     "Favors planning, structure, and disciplined follow-through.",
     "Suggests a methodical, cautious approach rather than a risky one.",
     "yes"),
    ("The Hierophant", 5, ["tradition", "guidance", "learning", "shared values"],
     ["breaking convention", "rigidity", "questioning tradition"],
     "The Hierophant speaks to tradition, mentorship, and shared belief systems — learning from established wisdom.",
     "Reversed, it may reflect a wish to break from convention or question inherited beliefs.",
     "May reflect shared values or a relationship grounded in tradition or commitment.",
     "Suggests mentorship, formal training, or working within established structures.",
     "Favors conventional, well-tested approaches.",
     "yes"),
    ("The Lovers", 6, ["connection", "choice", "alignment", "values"],
     ["misalignment", "disharmony", "a difficult choice"],
     "The Lovers speaks to meaningful connection and the choices that align with your deeper values.",
     "Reversed, it can point to misalignment, disconnection, or a decision that feels unresolved.",
     "Often points directly to attraction, partnership, or a significant choice in relationships.",
     "May represent a values-based decision, such as a partnership or collaboration.",
     "Suggests weighing a decision against what truly matters to you.",
     "yes"),
    ("The Chariot", 7, ["determination", "willpower", "focus", "forward motion"],
     ["lack of direction", "aggression", "loss of control"],
     "The Chariot reflects determination and forward momentum — success through focused will, even amid opposing forces.",
     "Reversed, it may suggest scattered direction or forcing an outcome rather than steering it.",
     "Suggests pursuing what you want in a relationship with clarity and resolve.",
     "Favors determined, focused pursuit of a goal.",
     "Suggests disciplined, goal-driven decisions.",
     "yes"),
    ("Strength", 8, ["courage", "patience", "compassion", "inner resilience"],
     ["self-doubt", "impatience", "insecurity"],
     "Strength reflects quiet courage and resilience — influence through patience and compassion rather than force.",
     "Reversed, it may point to self-doubt or feeling overwhelmed.",
     "Suggests gentleness, patience, and compassion in navigating this connection.",
     "Favors calm persistence over forceful action.",
     "Suggests steady, patient handling of financial matters.",
     "yes"),
    ("The Hermit", 9, ["introspection", "solitude", "guidance", "reflection"],
     ["isolation", "loneliness", "withdrawal"],
     "The Hermit invites a period of introspection — stepping back to seek your own answers before acting.",
     "Reversed, it can point to isolation that no longer feels nourishing.",
     "May suggest a need for space or reflection before moving forward together.",
     "Suggests a pause for reflection before the next career move.",
     "Favors caution and reflection before financial decisions.",
     "unclear"),
    ("Wheel of Fortune", 10, ["cycles", "change", "turning points", "fate"],
     ["resistance to change", "bad timing", "disruption"],
     "The Wheel of Fortune points to cycles and turning points — change that is part of a larger, ongoing pattern.",
     "Reversed, it may suggest resisting an inevitable shift or feeling caught in an unlucky cycle.",
     "Suggests a shift or turning point in the relationship's trajectory.",
     "Points to a change in circumstances, possibly outside your direct control.",
     "Suggests fluctuation; timing may matter more than usual.",
     "leaning yes"),
    ("Justice", 11, ["fairness", "truth", "accountability", "balance"],
     ["unfairness", "avoidance of truth", "imbalance"],
     "Justice speaks to fairness, truth, and accountability — the natural consequences of choices already made.",
     "Reversed, it can point to an imbalance, an unresolved truth, or avoided accountability.",
     "Suggests honesty and fairness are central to this connection right now.",
     "Favors decisions grounded in fairness and clear agreements.",
     "Suggests careful accounting and fair dealings.",
     "yes"),
    ("The Hanged Man", 12, ["pause", "new perspective", "surrender", "letting go"],
     ["stalling", "resistance", "needless sacrifice"],
     "The Hanged Man suggests pausing to see a situation from a new angle rather than forcing movement.",
     "Reversed, it may reflect stalling or resisting a needed shift in perspective.",
     "Suggests a pause may reveal a perspective you hadn't considered.",
     "Favors patience; the current standstill may hold a hidden opportunity.",
     "Suggests holding off rather than acting hastily.",
     "leaning no"),
    ("Death", 13, ["transformation", "endings", "transition", "release"],
     ["resistance to change", "stagnation", "fear of endings"],
     "Death symbolizes transformation — the natural close of one chapter that makes room for another.",
     "Reversed, it may point to resisting a necessary ending or feeling stuck.",
     "Suggests a significant transition, not necessarily negative, in this relationship's shape.",
     "Points to the end of one phase and the beginning of another professionally.",
     "Suggests a meaningful shift in financial circumstances or habits.",
     "unclear"),
    ("Temperance", 14, ["balance", "moderation", "patience", "integration"],
     ["imbalance", "excess", "impatience"],
     "Temperance reflects balance and patient integration — blending different parts of life into something workable.",
     "Reversed, it can point to excess or a lack of balance.",
     "Suggests patience and compromise will serve this connection well.",
     "Favors a balanced, sustainable approach over extremes.",
     "Suggests moderation and careful blending of resources.",
     "yes"),
    ("The Devil", 15, ["attachment", "restriction", "temptation", "patterns"],
     ["release from bondage", "reclaiming power", "breaking free"],
     "The Devil highlights attachments or patterns that may feel restrictive, inviting an honest look at what's holding you.",
     "Reversed, it can reflect breaking free from a limiting pattern or reclaiming your power.",
     "May point to an intense attraction or a pattern worth examining honestly.",
     "Suggests examining whether a situation feels genuinely fulfilling or merely comfortable.",
     "Cautions against overspending or unhealthy financial patterns.",
     "leaning no"),
    ("The Tower", 16, ["sudden change", "upheaval", "revelation", "awakening"],
     ["avoiding disaster", "delayed change", "fear of change"],
     "The Tower represents sudden, revealing change — the collapse of something that was no longer stable.",
     "Reversed, it may suggest narrowly avoiding upheaval or delaying an overdue change.",
     "May point to a sudden realization or shake-up in the relationship's dynamic.",
     "Suggests an unexpected disruption that ultimately clears space for something new.",
     "Cautions that finances may be more unstable than they appear.",
     "no"),
    ("The Star", 17, ["hope", "renewal", "inspiration", "healing"],
     ["despair", "disconnection", "lack of faith"],
     "The Star offers hope and renewal after a difficult period — a quiet sense that things are healing.",
     "Reversed, it may point to feeling discouraged or disconnected from hope.",
     "Suggests healing and renewed optimism in matters of the heart.",
     "Favors a hopeful, inspired approach to long-term goals.",
     "Suggests gradual improvement and renewed confidence.",
     "yes"),
    ("The Moon", 18, ["uncertainty", "intuition", "the subconscious", "illusion"],
     ["clarity emerging", "released fear", "confusion fading"],
     "The Moon points to uncertainty and the subconscious — some things may not yet be fully clear.",
     "Reversed, it can suggest confusion beginning to lift and clarity returning.",
     "Suggests mixed signals; more clarity may be needed before conclusions are drawn.",
     "Cautions against decisions made without full information.",
     "Suggests double-checking details before committing financially.",
     "unclear"),
    ("The Sun", 19, ["joy", "success", "vitality", "clarity"],
     ["temporary setback", "diminished joy", "clouded optimism"],
     "The Sun reflects joy, clarity, and success — a genuinely positive, warm energy around the situation.",
     "Reversed, it may point to a temporary dip in optimism rather than a lasting one.",
     "A generally favorable, warm sign for connection and happiness.",
     "Favors visibility, recognition, and positive momentum.",
     "Suggests a favorable, confident financial outlook.",
     "yes"),
    ("Judgement", 20, ["reflection", "reckoning", "renewal", "calling"],
     ["self-doubt", "harsh self-judgment", "avoiding a decision"],
     "Judgement invites reflection on the past as a way of stepping into a renewed, more aligned chapter.",
     "Reversed, it may point to harsh self-criticism or avoiding an important decision.",
     "Suggests a moment of honest reflection about what this relationship truly offers.",
     "Suggests reassessing your path with fresh, honest perspective.",
     "Suggests reviewing past financial decisions before moving forward.",
     "leaning yes"),
    ("The World", 21, ["completion", "fulfillment", "wholeness", "achievement"],
     ["incomplete closure", "delay", "unfinished business"],
     "The World signals completion and fulfillment — a cycle reaching a satisfying close.",
     "Reversed, it may point to something left unresolved or a delayed sense of closure.",
     "Suggests a sense of wholeness or a meaningful milestone in the relationship.",
     "Points to the successful completion of a significant goal or project.",
     "Suggests a favorable, complete outcome to a financial matter.",
     "yes"),
]

SUITS = {
    "Wands": {
        "element": "fire", "theme": "creativity, ambition, and action",
        "love": "passion and momentum", "career": "initiative and drive", "money": "active pursuit of opportunity",
    },
    "Cups": {
        "element": "water", "theme": "emotion, relationships, and intuition",
        "love": "emotional depth and connection", "career": "fulfillment and meaningful work", "money": "value beyond the purely material",
    },
    "Swords": {
        "element": "air", "theme": "thought, communication, and conflict",
        "love": "honest communication", "career": "clarity of thinking and decisions", "money": "careful, rational planning",
    },
    "Pentacles": {
        "element": "earth", "theme": "material matters, work, and stability",
        "love": "practical commitment and security", "career": "tangible progress and results", "money": "stability and long-term security",
    },
}

RANKS = [
    ("Ace", 1, "new beginning and raw potential", "a fresh opportunity worth noticing"),
    ("Two", 2, "balance, choice, or partnership", "weighing two paths or people"),
    ("Three", 3, "early growth and collaboration", "the first visible results of effort"),
    ("Four", 4, "stability and a pause to consolidate", "a foundation worth protecting"),
    ("Five", 5, "tension, conflict, or challenge", "friction that asks for a response"),
    ("Six", 6, "cooperation and moving past difficulty", "support, generosity, or progress"),
    ("Seven", 7, "assessment and perseverance", "a moment to evaluate your approach"),
    ("Eight", 8, "movement, focus, or restriction", "swift change or a narrowing of options"),
    ("Nine", 9, "resilience near the end of a cycle", "strength gathered from experience"),
    ("Ten", 10, "culmination, for better or worse", "the full weight of where this cycle has led"),
    ("Page", 11, "a curious, early-stage message or energy", "a student's openness to learning"),
    ("Knight", 12, "active pursuit of a goal", "energy in motion, for good or ill"),
    ("Queen", 13, "mature, inward mastery", "nurturing command of this suit's domain"),
    ("King", 14, "mature, outward mastery", "confident authority in this suit's domain"),
]

def yes_no_for_rank(rank_num):
    if rank_num in (1, 3, 6, 10, 14):
        return "yes"
    if rank_num in (2, 9, 11, 13):
        return "leaning yes"
    if rank_num in (4, 7, 12):
        return "unclear"
    if rank_num in (5, 8):
        return "leaning no"
    return "unclear"

cards = []
cid = 1

for name, number, up_kw, rev_kw, up_m, rev_m, love_m, career_m, money_m, yn in MAJOR:
    cards.append({
        "id": cid, "name": name, "slug": slugify(name), "arcana": "major",
        "number": number, "suit": None,
        "upright_keywords": up_kw, "reversed_keywords": rev_kw,
        "upright_meaning": up_m, "reversed_meaning": rev_m,
        "love_meaning": love_m, "career_meaning": career_m, "money_meaning": money_m,
        "general_meaning": up_m,
        "yes_no_tendency": yn,
        "image_url": f"/tarot/major/{slugify(name)}.svg",
    })
    cid += 1

for suit, info in SUITS.items():
    for rank_name, rank_num, up_theme, rev_theme in RANKS:
        name = f"{rank_name} of {suit}"
        up_m = f"The {name} reflects {up_theme}, connected to {info['theme']} ({info['element']} energy)."
        rev_m = f"Reversed, the {name} can suggest the shadow side of {up_theme} — delayed, blocked, or turned inward."
        love_m = f"In matters of the heart, the {name} points to {info['love']}, colored by {rev_theme}."
        career_m = f"Professionally, the {name} suggests {info['career']}, shaped by {up_theme}."
        money_m = f"Financially, the {name} suggests {info['money']}, tempered by {up_theme}."
        general_m = up_m
        cards.append({
            "id": cid, "name": name, "slug": slugify(name), "arcana": "minor",
            "number": rank_num, "suit": suit,
            "upright_keywords": [w.strip() for w in up_theme.split(" and ")] + [info["element"]],
            "reversed_keywords": [w.strip() for w in rev_theme.split(" or ")],
            "upright_meaning": up_m, "reversed_meaning": rev_m,
            "love_meaning": love_m, "career_meaning": career_m, "money_meaning": money_m,
            "general_meaning": general_m,
            "yes_no_tendency": yes_no_for_rank(rank_num),
            "image_url": f"/tarot/minor/{slugify(name)}.svg",
        })
        cid += 1

assert len(cards) == 78, len(cards)

with open("src/lib/tarot/deck-data.json", "w") as f:
    json.dump(cards, f, indent=2)

print(f"Wrote {len(cards)} cards to src/lib/tarot/deck-data.json")
