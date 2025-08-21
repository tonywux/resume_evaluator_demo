# Resume Evaluator Demo

A comprehensive AI-powered resume evaluation system that analyzes candidate resumes against job requirements using customizable scoring criteria.

## Overview

This system evaluates resumes by comparing candidate qualifications against job descriptions using predefined evaluation rules. It leverages Large Language Models (LLMs) to provide intelligent, automated assessment with detailed scoring output.

## Features

- **Multi-format Input**: Accepts JSON resume and job description files
- **Flexible Evaluation Rules**: Supports customizable JSON-based evaluation criteria
- **Multiple LLM Providers**: Compatible with Deepseek, Qwen, Grok, and OpenAI
- **Parallel Processing**: Runs multiple evaluation rules concurrently for efficiency
- **Structured Output**: Returns detailed evaluation results in JSON format
- **Error Handling**: Provides comprehensive error reporting and graceful failure handling

## How It Works

### 1. Define Evaluation Rules
Create evaluation rules in JSON format supporting two types of criteria:

- **Boolean Rules**: Yes/No questions (e.g., "Does the candidate have experience working at XPENG or related companies?")
  - Returns: `{"criteria": "XPENG_experience", "value": true, "type": "boolean"}`

- **Rating Rules**: Scored assessments on a 1-5 scale (e.g., "Rate the candidate's soft skills - teamwork, communication, etc. - against the job requirements")
  - Returns: `{"criteria": "soft_skills_rating", "value": 4, "type": "rating"}`

Multiple rules can be defined within a single JSON configuration file.

### 2. Provide Input Data
Supply the following inputs:
- **Resume**: Candidate information in JSON format
- **Job Description**: Position requirements in JSON format

### 3. Execute Evaluation
The system processes all evaluation rules in parallel:
- Each rule receives the complete resume and job description
- All rules execute simultaneously to optimize processing time
- Individual responses are collected for each evaluation criterion

### 4. Generate Results
After all rules complete, the system outputs a comprehensive JSON report combining all evaluation responses:

```json
{
  "evaluation_id": "eval_20240101_001",
  "timestamp": "2024-01-01T10:00:00Z",
  "candidate_info": {
    "name": "John Doe",
    "resume_id": "resume_001"
  },
  "job_info": {
    "title": "Senior Software Engineer",
    "job_id": "job_001"
  },
  "results": [
    {
      "criteria": "XPENG_experience",
      "value": true,
      "type": "boolean",
      "explanation": "Experience working at XPENG or related companies"
    },
    {
      "criteria": "soft_skills_rating",
      "value": 4,
      "type": "rating",
      "explanation": "Soft skills assessment (teamwork, communication)",
      "weight": 0.2
    }
  ]
}
```

This structured format ensures easy parsing and integration with downstream systems.

## Error Handling

The system includes robust error handling mechanisms to ensure reliable operation and provide detailed diagnostic information when issues occur.