# Frozen deterministic retrieval benchmark

This branch is a disposable public execution host for the deterministic retriever developed in the private `DaddysCoder/rag-work` repository.

## Freeze point

- Private source PR: `DaddysCoder/rag-work#16`
- Frozen private head: `54e41943d0fca5f050241a51cc28b43327c3652f`
- Retrieval code was frozen before the first successful BEIR result was observed.
- The public copy contains only benchmark-relevant retrieval code. It does not contain the product database, encryption, upload pipeline, security controls, UI, participant data, credentials, or secrets.

## Pre-registered datasets

The first public run uses three BEIR datasets selected before observing results:

1. SciFact
2. NFCorpus
3. ArguAna

These cover scientific-claim retrieval, biomedical retrieval, and argument retrieval respectively.

## Fixed configuration

- Candidate prefilter limit: **350**
- Returned results: **20**
- No embeddings
- No external model
- No LLM
- No external inference API
- Candidate selection reproduces the equality behavior of the production blind-index overlap prefilter in plaintext for public evaluation.
- The same `rankCandidates` logic used by the product is used by the benchmark.

## Metrics

- Hit@1
- Recall@3
- Recall@10
- Recall@20
- MRR@10
- nDCG@10
- MAP@10
- Query coverage
- p50 / p95 retrieval latency

## Control

The harness also runs a local plain BM25 control over title + body using the same base tokenizer. This is a local control, **not** an official Pyserini/BEIR leaderboard implementation and should not be represented as one.

## Interpretation

This benchmark measures retrieval only. It does not measure generated-answer quality, application security, database compromise resistance, encryption overhead, document-ingestion safety, or human review controls.

The initial public scores must be preserved before any subsequent tuning against these datasets. Later versions should be reported as separate revisions rather than replacing the frozen baseline.
