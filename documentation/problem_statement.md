# Problem Statement

## 1. Executive Summary

This hackathon challenges participants to build an **Agentic AI Project Framework** — a multi-agent system that accepts a natural-language project specification and autonomously drives the full software development lifecycle, from requirements clarification through to a working, testable codebase. The challenge is not about building an AI model; it is about **systems design, agent orchestration, failure recovery, and engineering rigor**.

---

## 2. Background & Motivation

### 2.1 The Current State of AI-Assisted Development

Modern AI coding assistants have dramatically accelerated individual developer productivity. Developers can describe a task in natural language and receive syntactically correct, contextually aware code within seconds. However, these tools share a fundamental limitation: **they are reactive**. A developer must manually break down a project, hand each piece to the AI, evaluate each output, and integrate the results. This model does not scale to teams, complex requirements, or long-horizon tasks that span multiple subsystems.

### 2.2 The Gap This Framework Fills

What is missing is a **proactive orchestration layer** — a framework that can:

- **Interpret** a high-level, ambiguous project specification
- **Ask** targeted clarifying questions to eliminate ambiguity
- **Decompose** the specification into ordered, atomic implementation tasks
- **Delegate** each task to an appropriate AI agent with the right tools
- **Validate** outputs at every step before proceeding
- **Recover** intelligently from failures without abandoning the entire workflow
- **Escalate** to humans when — and only when — human judgment is genuinely required

Solving this problem requires integrating ideas from multi-agent systems, software verification, human-computer interaction, and developer tooling — making it an ideal deep-engineering hackathon challenge.

---

## 3. Problem Statement

> **Design and implement an Agentic AI Framework** that accepts a natural-language project specification and autonomously builds a working software project from scratch — coordinating specialized AI agents to clarify requirements, architect a solution, generate and test code, audit for security, and produce a fully Dockerized, verified deliverable — **with minimal human intervention**.

This is a **project hackathon**, not a feature-addition hackathon. For security and neutrality reasons, no shared source code repository is provided as a base. Each team builds their framework and all generated projects entirely from scratch. The framework must demonstrate domain-agnostic capability across multiple complexity tiers.

---

## 4. Scope

### 4.1 In Scope

| Area | Description |
|------|-------------|
| **Intake Interface** | A natural-language intake interface (CLI prompt, web form, or chat UI) for project specifications |
| **Requirement Refinement** | An automated module that identifies ambiguities and asks targeted clarifying questions |
| **Architecture Design** | A codebase planning module that designs the project structure from scratch |
| **Task Decomposition** | A planning module that decomposes the specification into ordered, atomic implementation tasks |
| **Code Generation** | A module that invokes any LLM of the team's choice using their own API keys |
| **Validation** | A module that runs generated test suites, linters, and type checkers after each step |
| **Failure Recovery** | A module that retries, self-corrects, or escalates based on the type of failure |
| **Guardrails** | A configurable guardrails system (e.g., require human approval above a file-change threshold, flag security-sensitive patterns) |
| **Dockerization** | Containerization of the generated project *(optional but recommended — see Section 9.1)* |

### 4.2 Out of Scope

- Training or fine-tuning any AI model
- Building a CI/CD pipeline or deployment system
- IDE plugin development (terminal or web interface is sufficient)
- Production-grade security hardening of the framework itself
- Modifying or extending any pre-existing shared codebase — all project code must be generated from scratch

---

## 5. Functional Requirements

The following requirements are grouped by component. Requirements marked **[CORE]** are mandatory for a passing submission. Requirements marked **[EXTENDED]** are optional and will be rewarded in scoring.

### 5.1 Requirement Intake & Refinement

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-01 | **[CORE]** | The framework must accept a natural-language project specification as its primary input and automatically identify underspecified aspects, generating a minimal set of targeted clarifying questions. |
| FR-02 | **[CORE]** | After receiving clarification responses, the framework must produce a structured specification document including: project summary, acceptance criteria, proposed architecture, and known constraints. |

### 5.2 Architecture & Planning

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-04 | **[CORE]** | The framework must design the project structure from scratch, determining the directory layout, modules, data models, and API contracts before any code is written. |
| FR-05 | **[CORE]** | The framework must decompose the project into an ordered list of atomic implementation tasks, where each task produces a verifiable, independently testable unit of work. |
| FR-06 | **[CORE]** | The implementation plan must be presented to the user for review and approval before execution begins. |

### 5.3 Code Generation

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-08 | **[CORE]** | The framework must invoke the team's chosen LLM via its API to generate code for each task, providing it with the structured specification, current project state, and any project-specific coding standards. |
| FR-09 | **[CORE]** | Generated code changes must be presented as a diff or summary to the user before being applied to the filesystem. |

### 5.4 Test-Driven Validation

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-11 | **[CORE]** | The framework must follow a TDD-first approach: the QA agent must generate failing test cases before any production code is written for each task. |
| FR-12 | **[CORE]** | After code generation, the framework must automatically run the test suite and treat any test failure as a blocking event that triggers the failure recovery module. |
| FR-14 | **[EXTENDED]** | The framework should run an AI-powered security audit pass after each major module is complete, flagging injection vulnerabilities, auth flaws, and logic errors. |

### 5.5 Failure Recovery

| ID | Priority | Requirement |
|----|----------|-------------|
| FR-15 | **[CORE]** | When validation fails, the framework must automatically retry by passing the error output back to the code generation module, up to a configurable maximum number of retries. |
| FR-17 | **[EXTENDED]** | The framework should support rollback to the last passing checkpoint if the user chooses to abort mid-workflow. |

---

## 6. Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | **Usability** | A user with no prior knowledge of the framework should be able to submit their first project specification within 5 minutes of setup. |
| NFR-02 | **Transparency** | Every action the framework takes (API call, file write, test run) must be logged in a human-readable activity log. |
| NFR-03 | **Configurability** | Guardrails, retry limits, and checkpoint triggers must be configurable via a single YAML or JSON config file without code changes. |
| NFR-04 | **Portability** | The framework must run on a standard developer machine (Windows or Linux) with no mandatory cloud infrastructure dependencies beyond the chosen LLM API. |
| NFR-05 | **Safety** | The framework must never execute shell commands that delete files outside the project working directory. |
| NFR-06 | **Observability** | The framework must provide a summary at the end of the workflow showing: tasks completed, tasks skipped, files generated, tests passed/failed, and total API calls made. |

---

## 7. Project Complexity Tiers

To ensure the engine is truly domain-agnostic and robust, the specific tasks are withheld until the final phase. The tool must generate code for **5 levels of complexity** without any manual human code-level intervention.

| Tier | Project Name | Core Engineering Challenge |
|------|-------------|---------------------------|
| 1 | **The Ledger** | Basic CRUD microservice with strict schema validation. |
| 2 | **Logic Engine** | Dynamic business rules engine (e.g., a complex regional tax / pricing calculator). |
| 3 | **Live Bridge** | Integration with 3rd-party APIs using async fetching and robust error handling. |
| 4 | **The Gatekeeper** | Full OAuth2 / JWT authentication service with Role-Based Access Control (RBAC). |
| 5 | **Mongo-SQL Engine** | Implementing Inner, Left, Right, and Full Outer joins on MongoDB. Must sync historical data first, then transition to live data via Change Streams. |

---

## 8. Expected Output

A complete, successful run of the framework must produce **all of** the following artifacts:

### 8.1 Intermediate Artifacts

| Artifact | Description |
|----------|-------------|
| **Structured Specification Document** | A machine-readable (JSON or YAML) and human-readable summary of the refined project requirements, acceptance criteria, and proposed architecture. |
| **Implementation Plan** | An ordered, numbered list of tasks with per-task risk level, estimated file scope, and checkpoint flags. |
| **Activity Log** | A timestamped, append-only log of every action taken by the framework during the workflow. |

### 8.2 Code Artifacts

| Artifact | Description |
|----------|-------------|
| **Generated Project Repository** | A complete, runnable project built from scratch, structured according to the plan produced in Phase 1. |
| **Test Suite** | Automatically generated tests (written TDD-first) with a documented pass rate. At minimum, one test per implemented task. |
| **Docker Compose File** *(Optional)* | A `docker-compose.yml` that builds and runs the generated project in an isolated environment. |

### 8.3 Summary Artifacts

| Artifact | Description |
|----------|-------------|
| **Workflow Summary Report** | A final report showing: tasks completed, tasks skipped, files generated, tests passed/failed, and total API calls made. |
| **Security Audit Report** *(if FR-14 implemented)* | A summary of flagged vulnerabilities and the framework's resolution of each. |

---

## 9. Hackathon Phases

The hackathon is conducted in two sequential phases. Phase 1 is an elimination round. Only teams that pass Phase 1 proceed to Phase 2.

### Phase 1 — Design Presentation (Elimination Round)

In this phase, teams present their proposed architecture and approach. No implementation is required or expected. Judges evaluate the **quality of thinking**, not working code.

**Deliverable:** A design document or presentation (PPT or PDF) covering:

1. **Agent Architecture** — Which agents will the framework use? What is each agent's responsibility?
2. **Workflow Design** — How do agents hand off work to each other? Where are the human-in-the-loop checkpoints?
3. **Failure Strategy** — How will the framework detect, handle, and recover from failures?
4. **Tech Stack Justification** — Which LLM(s) and orchestration framework(s) will be used, and why?
5. **Risk Assessment** — What are the hardest parts of the implementation, and how do you plan to mitigate them?

**Outcome:** A subset of teams is selected to advance to Phase 2. Judges will provide brief feedback to eliminated teams.

### Phase 2 — Final Implementation & Demo

Selected teams implement their framework over the remaining hackathon period. At the end, each team delivers a live demo in front of the judges.

**The demo must include:**

- A live run of the framework receiving a project specification from one of the complexity tiers (revealed at the start of Phase 2).
- The framework autonomously clarifying requirements, generating a plan, producing code, running tests, and delivering a summary report — all in real time.
- At least one deliberate failure scenario handled gracefully by the recovery module.
- A walkthrough of the generated project code demonstrating it is functional and test-passing.

---

## 10. Evaluation Criteria

Phase 1 and Phase 2 are evaluated separately. Phase 1 evaluates design quality only. Phase 2 evaluates the working system.

### Phase 1 — Design Evaluation (Pass / Fail)

| Criterion | What Judges Look For |
|-----------|---------------------|
| **Agent Architecture Clarity** | Are agents well-defined with clear, non-overlapping responsibilities? |
| **Workflow Completeness** | Does the workflow cover the full lifecycle from intake to output without obvious gaps? |
| **Failure Thinking** | Has the team thought through failure modes, not just the happy path? |
| **Feasibility** | Is the design achievable within the hackathon timeline by this team? |

### Phase 2 — Final Evaluation (100 Points)

| Criterion | Points | What Judges Look For |
|-----------|--------|---------------------|
| **Agentic Autonomy** | 30 | Zero-touch capability from specification to working code. How much did humans need to intervene beyond the defined checkpoints? |
| **TDD & Verification Accuracy** | 25 | Did the QA agent write failing tests first? What percentage of tests pass on the final generated code? |
| **Complex Logic & State Orchestration** | 20 | Correctness of complex tasks, resilience to edge cases, and quality of agent state handoffs. |
| **Failure Handling & Recovery** | 10 | Can the framework handle a deliberately broken scenario and recover without crashing? |
| **Code & Architecture Quality** | 10 | Is the framework itself well-structured, readable, and maintainable? |
| **Extended Features** | 5 | Credit for optional features: Docker output, security audit, advanced observability dashboard. |

---

## 11. Constraints & Guardrails

### 11.1 Technology Constraints

- Teams may use any LLM API of their choice (e.g., OpenAI, Anthropic, Google, Mistral, or open-source models). Teams must use their own API keys.
- The framework must generate code for a real, runnable project — not a simulated or stub implementation.
- Docker is optional. If implemented, the generated project must pass a `docker compose up` health check.
- The backend of any generated project must be in **Python**. The frontend, if required by the project tier, must be in **Angular or React**.

### 11.2 Safety Constraints

- The framework must never execute shell commands that delete files outside the project working directory.
- API keys must not be hard-coded in source files. Any submitted code containing hard-coded API keys will be **disqualified**.
- Teams must not share or reuse any pre-written code as the "generated" output. All project code must be genuinely produced by the framework during the demo.

### 11.3 Ethical Constraints

- Teams must not use the framework to generate code that contains malicious logic, even as a demonstration of capabilities.
- All AI-generated code submitted as part of the deliverable must be reviewed and understood by at least one team member.

---

## 12. Provided Resources

| Resource | Details |
|----------|---------|
| **Mentor Sessions** | 30-minute mentor slots available on request (max 2 per team across both phases). Mentors can advise on architecture and approach but will not write code or review implementation details. |
| **Infrastructure** | Teams are responsible for sourcing their own LLM API access, development environment, and any additional tooling or libraries they choose to use. |

---

## 13. Submission Requirements

### Phase 1 Submission

Submit the following before the Phase 1 presentation deadline:

1. **Design document or presentation** (PPT or PDF) covering the five areas listed in Section 9.
2. **One-paragraph team introduction** — names, backgrounds, and why this problem interests the team.

### Phase 2 Submission

Selected teams must submit **all of** the following before the Phase 2 demo:

1. **GitHub repository link** — public or shared with judges — containing all framework source code.
2. **README.md** — with setup instructions, config file documentation, and a brief description of the framework's architecture.
3. **Architecture diagram** — updated from Phase 1 to reflect the actual implementation, showing agent interactions and data flow.
4. **Reflection document** (1 page max) — key design decisions made, what the team would do differently with more time, and an honest assessment of current limitations.

> **⚠️ Submissions missing any required item will be considered incomplete and may be disqualified from judging.**

---

## 14. Notes for Judges

This section is intended to help judges apply the evaluation criteria consistently.

- A team with a **reliable Tier 1–2 framework** should score higher than a team that attempts Tier 4–5 but produces brittle, frequently failing output.
- The **TDD-first criterion is non-negotiable**. A framework that writes tests after the code, or skips tests entirely, cannot score full marks in the Verification category regardless of other quality.
- Phase 2 demos must use the **project tier revealed at the start of Phase 2**. Teams may not substitute an easier tier or use a pre-prepared project.
- **Partial credit** is available for incomplete Extended features if the team clearly articulates design intent and remaining work.
- A framework that detects failures, recovers gracefully, and communicates clearly is more impressive than one that only works on the happy path.

---

## Appendix A: Glossary

| Term | Definition |
|------|-----------|
| **Agentic AI** | An AI system that autonomously takes sequences of actions to accomplish a goal, as opposed to responding to a single prompt. |
| **Atomic Task** | A unit of work that produces a single, independently verifiable change to the codebase. |
| **Checkpoint** | A point in the workflow where execution pauses and a human must explicitly approve before continuing. |
| **Guardrail** | A configurable constraint that prevents the framework from taking certain categories of action without human approval. |
| **Orchestration Layer** | The component of the framework responsible for sequencing agents, managing state, and deciding when to escalate to humans. |
| **Structured Specification** | A machine- and human-readable document produced by the requirement refinement module that precisely defines the project to be built. |
| **TDD (Test-Driven Development)** | A development approach where failing tests are written before production code, ensuring every unit of code has a corresponding verification. |
| **Change Streams** | A MongoDB feature that allows applications to listen to real-time data changes in a collection, used in Tier 5 of the complexity table. |

---

## Appendix B: Suggested Agent Roles

Teams are free to structure their framework however they choose. The following is one illustrative decomposition, **not** a required architecture:

| Agent | Responsibility |
|-------|---------------|
| **Intake Agent** | Receives raw specification, identifies ambiguity, generates clarifying questions, and produces the structured specification. |
| **Architect Agent** | Designs project structure, directory layout, data models, and API contracts from scratch. |
| **Planner Agent** | Converts the structured specification and architecture into an ordered atomic task list. |
| **QA Agent (TDD-First)** | Writes failing test cases before any production code is generated for each task. |
| **Coder Agent** | Invokes the chosen LLM to generate production code that satisfies the failing tests. |
| **Security Auditor Agent** | Performs a pre-commit audit, flagging injection vulnerabilities, auth flaws, and logic errors. |
| **Recovery Agent** | Diagnoses failures and decides between retry, guidance request, or escalation. |