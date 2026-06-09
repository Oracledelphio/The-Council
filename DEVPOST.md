# Council AI - Devpost Submission

## Elevator Pitch
Don't ask one AI for an opinion. Ask the Council. Council AI is a multi-agent adversarial deliberation platform that pits specialized AI agents against each other to ruthlessly stress-test your proposals before you make costly decisions.

## Short Description
Council AI transforms decision-making from a solitary guess into a rigorous, multi-agent debate. Using Google Gemini and MongoDB, specialized AI agents act as an Advocate, Inquisitor, and Arbitrator to extract assumptions, attack weaknesses, and issue impartial verdicts on startup ideas, product launches, and executive strategies.

## Long Description
Founders, students, and product teams face a constant battle against decision paralysis and confirmation bias. When we ask traditional AI models to evaluate our ideas, they act as sycophants—agreeing with us, validating our assumptions, and rarely providing the harsh pushback required to prevent failure. You don't need a yes-man; you need a stress test.

**Council AI** solves the "sycophant problem" through structured Adversarial Deliberation. Instead of talking to a single chatbot, you submit your proposal to an entire board of specialized AI agents:
1. **The Advocate:** Defends your proposal, highlights asymmetric upside, and builds the strongest possible case.
2. **The Inquisitor:** A ruthless adversarial agent mandated to identify your single weakest assumption and systematically destroy it.
3. **The Arbitrator:** An impartial executive agent that evaluates both arguments, reviews historical precedents, scores confidence, and issues a final, binding verdict.

By forcing AI agents into structured disagreement, Council AI guarantees superior, deeply analytical outcomes. We combine the reasoning speed of **Google Gemini 2.5 Flash** with the robust persistence and aggregation capabilities of **MongoDB Atlas** to create a true Decision Intelligence Platform.

## What Inspired Us
As builders, we realized we were using ChatGPT as a crutch for validation rather than true critical analysis. Every time we pitched an idea to an LLM, it told us it was brilliant. That's dangerous. We were inspired by the legal system, debate clubs, and executive boardrooms—environments where truth is uncovered through structured, adversarial friction. We wanted to build a system where AI doesn't just agree with you, but actively tries to save you from your own bad ideas.

## How We Built It
- **Frontend:** A responsive, highly polished Next.js 14 application styled with Tailwind CSS and animated with Framer Motion to create a premium "war room" feel.
- **Backend:** A lightning-fast Python FastAPI server orchestrating multiple Google Gemini agents concurrently using async generators to stream the debate in real-time.
- **Database (MongoDB Track):** We utilize **MongoDB Atlas** as our institutional memory engine. Every proposal, extracted claim, streaming transcript, and final verdict is saved as flexible BSON documents. We use the async Motor driver for seamless, non-blocking Python integration.
- **Analytics:** We leverage MongoDB Aggregation Pipelines to power our Executive Analytics Dashboard, providing real-time insights into council verdicts, fund rates, and deliberation metrics.

## Challenges We Faced
1. **The Sycophant Problem:** LLMs are naturally aligned to be helpful and polite. Designing the `Inquisitor` prompt to be ruthless and adversarial without triggering safety filters required extensive prompt engineering and strict structural constraints.
2. **Parallel Agent Streaming:** Streaming two distinct AI agents (Advocate and Inquisitor) to the frontend concurrently required intricate async handling in FastAPI and careful React state management to prevent race conditions.
3. **Premature Truncation:** We initially hit token limits during intense deliberations. We had to build robust exponential backoff, length validation, and automated retry mechanisms to ensure the Arbitrator never ruled on incomplete evidence.

## What We Learned
- **Structured Disagreement Works:** Pitting LLMs against each other yields significantly higher quality analysis than asking a single LLM to play both sides.
- **Schema Flexibility is Key:** Because AI outputs are inherently unpredictable in length and structure, MongoDB's document model was the absolute perfect fit for storing deliberation transcripts without wrestling with rigid SQL columns.
- **UI Matters in AI:** Treating AI outputs not as a generic chat log, but as structured, actionable UI cards (with Verdicts, Confidence Scores, and Fatal Flaws) completely changes how users interact with the intelligence.

## Future Roadmap
- **Atlas Vector Search & Voyage AI:** We plan to implement RAG using MongoDB Atlas Vector Search so our agents can retrieve and cite external documents, research papers, and company wikis during their debates.
- **Team Councils:** Adding a multiplayer mode where human founders can step in and take over the role of Advocate while the AI plays the Inquisitor.
- **Outcome Calibration:** Allowing organizations to update decisions 6 months later with "what actually happened," turning MongoDB into a continuous training loop that improves Arbitrator accuracy over time.
